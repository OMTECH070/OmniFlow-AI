import json
from typing import List
from app.services.llm import BaseLLMService
from app.services.prompt_service import PromptService
from app.models.flight import Flight
from app.utils.logger import logger

class SummarizerAgent:
    """Agent responsible for comparing flight options and generating a summary recommendation."""

    def __init__(self, llm_service: BaseLLMService, prompt_service: PromptService):
        self.llm_service = llm_service
        self.prompt_service = prompt_service

    async def summarize(self, flights: List[Flight]) -> str:
        """Compares flights and generates a text summary listing the best option, reason, pros, and cons."""
        logger.info(f"Summarizing {len(flights)} flight options...")
        
        # Serialize flights list to pass into the prompt
        flights_data = [flight.model_dump() for flight in flights]
        flights_json = json.dumps(flights_data, indent=2)
        
        prompt = self.prompt_service.format_prompt("summary", flights_json=flights_json)
        system_instruction = (
            "You are a professional travel consulting assistant. "
            "Compare the flight results and write a summary. "
            "Identify the best option, explain the reasoning, and provide the pros and cons."
        )
        
        try:
            summary_text = await self.llm_service.generate_text(
                prompt=prompt,
                system_instruction=system_instruction
            )
            logger.info("Flight summary generation completed.")
            return summary_text
        except Exception as e:
            logger.error(f"SummarizerAgent failed: {e}")
            return "Error: Could not generate comparison summary."
