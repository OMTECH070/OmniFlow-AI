from typing import List
from pydantic import BaseModel, Field
from schema.task import Task
from utils.llm_client import LLMClient
from utils.logger import logger

class PlannerOutput(BaseModel):
    """Output JSON validation model for planner output."""
    plan: List[Task] = Field(..., description="Ordered list of sequential task steps to execute")

class Planner:
    """Agent that plans and decomposes user queries into subtask items."""

    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    async def create_plan(self, user_input: str) -> List[Task]:
        """Creates a sequential execution plan of Tasks."""
        logger.info(f"Generating execution plan for input: '{user_input}'")
        
        prompt = (
            f"You are a professional task planning assistant.\n"
            f"Decompose the following user request into a step-by-step sequential list of subtasks.\n\n"
            f"User input query: '{user_input}'\n\n"
            f"Assign each subtask an incrementing ID (e.g. task_01, task_02), an intent domain (e.g. chat, search, automation), and a description."
        )
        
        system_instruction = "You are a task planner. Create structured, step-by-step task lists."
        
        try:
            output = await self.llm_client.generate_json(
                prompt=prompt,
                schema=PlannerOutput,
                system_instruction=system_instruction
            )
            logger.info(f"Successfully generated plan containing {len(output.plan)} steps.")
            return output.plan
        except Exception as e:
            logger.error(f"Planner failed: {e}. Falling back to default plan.")
            return [
                Task(
                    task_id="task_01", 
                    intent="chat", 
                    description=f"Respond directly to request: '{user_input}'"
                )
            ]