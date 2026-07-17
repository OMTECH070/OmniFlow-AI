import json
from typing import List, Dict, Any
from utils.llm_client import LLMClient
from utils.logger import logger

class ResponseGenerator:
    """Agent that synthesizes execution results and plans into user-friendly responses."""

    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    async def generate(self, user_input: str, plan: List[Any], tool_results: List[Dict[str, Any]]) -> str:
        """Generates conversational response using LLM."""
        logger.info("ResponseGenerator: Compiling final assistant response.")
        
        plan_details = []
        for task in plan:
            plan_details.append(f"- Step {task.task_id} [{task.intent}]: {task.description}")
            
        plan_str = "\n".join(plan_details)
        results_json = json.dumps(tool_results, indent=2)
        
        prompt = (
            f"You are OmniFlow, an advanced agentic coding and browser control assistant.\n"
            f"Answer the user query by summarizing what was accomplished based on the execution details.\n\n"
            f"User Original Query: '{user_input}'\n\n"
            f"Steps Planned:\n{plan_str}\n\n"
            f"Tool Execution Logs:\n{results_json}\n\n"
            f"Formulate a clear, direct, and professional summary response to the user."
        )
        
        system_instruction = "You are OmniFlow AI. Keep responses professional, helpful, and concise."
        
        try:
            response = await self.llm_client.generate_text(
                prompt=prompt,
                system_instruction=system_instruction
            )
            return response
        except Exception as e:
            logger.error(f"ResponseGenerator failed to generate text: {e}")
            # Fallback response summarizing tools status
            success_count = sum(1 for r in tool_results if r.get("status") == "success")
            return (
                f"OmniFlow completed {success_count} execution steps out of {len(plan)} total plan tasks. "
                f"Execution details: {results_json}"
            )