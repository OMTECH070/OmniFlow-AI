import inspect
from typing import Dict, Any, List
from pydantic import BaseModel, Field

from schema.task import Task
from utils.llm_client import LLMClient
from utils.logger import logger

class ToolCallModel(BaseModel):
    """Validation schema for mapping task description to a tool method call."""
    method: str = Field(..., description="Exact name of the method to call")
    arguments: Dict[str, Any] = Field(
        default_factory=dict, 
        description="Key-value arguments to pass to the method"
    )

class ToolExecutor:
    """Agent that maps task descriptions to tool methods and executes them."""

    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    async def execute(self, task: Task, tools: Any) -> Dict[str, Any]:
        """Determines and executes the appropriate tool method for the given Task."""
        if not tools:
            return {
                "task_id": task.task_id,
                "status": "skipped",
                "message": "No tool library mapped for this task intent."
            }

        # Dynamically discover tools methods and docstrings
        available_methods = [
            m for m in dir(tools) 
            if not m.startswith('_') and callable(getattr(tools, m))
        ]
        
        methods_info = []
        for method_name in available_methods:
            method_obj = getattr(tools, method_name)
            doc = method_obj.__doc__ or "No description provided."
            methods_info.append(f"- {method_name}: {doc.strip()}")
            
        methods_list_str = "\n".join(methods_info)
        
        prompt = (
            f"You are the Tool Executor Agent for OmniFlow.\n"
            f"Translate the user subtask description into a method call on the tools library.\n\n"
            f"Available Methods in Library:\n{methods_list_str}\n\n"
            f"Subtask Description to execute: '{task.description}'\n\n"
            f"Output the matching method name and standard JSON arguments."
        )
        
        system_instruction = "You select and parameterize python tool actions based on natural language task descriptions."
        
        try:
            tool_call = await self.llm_client.generate_json(
                prompt=prompt,
                schema=ToolCallModel,
                system_instruction=system_instruction
            )
            
            logger.info(f"Resolved tool call: {tool_call.method}() with args: {tool_call.arguments}")
            
            if hasattr(tools, tool_call.method):
                method_func = getattr(tools, tool_call.method)
                
                # Execute asynchronously if it is a coroutine
                if inspect.iscoroutinefunction(method_func):
                    result = await method_func(**tool_call.arguments)
                else:
                    result = method_func(**tool_call.arguments)
                    
                return {
                    "task_id": task.task_id,
                    "method": tool_call.method,
                    "arguments": tool_call.arguments,
                    "status": "success",
                    "result": result
                }
            else:
                err_msg = f"Method '{tool_call.method}' does not exist on toolset library."
                logger.error(err_msg)
                return {
                    "task_id": task.task_id,
                    "status": "error",
                    "message": err_msg
                }
                
        except Exception as e:
            logger.error(f"Tool execution failed for task {task.task_id}: {e}")
            return {
                "task_id": task.task_id,
                "status": "error",
                "message": f"Execution exception: {e}"
            }
        finally:
            # If browser tools was used, we automatically ensure close_browser is eventually called 
            # to prevent hanging browser processes. 
            if hasattr(tools, "close_browser") and tools.page is not None:
                try:
                    await tools.close_browser()
                except Exception:
                    pass