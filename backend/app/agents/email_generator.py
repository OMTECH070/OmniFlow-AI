import json
from typing import List
from app.services.llm import BaseLLMService
from app.services.prompt_service import PromptService
from app.models.flight import Flight
from app.utils.logger import logger

class EmailGeneratorAgent:
    """Agent responsible for crafting a polished email draft with flight choices."""

    def __init__(self, llm_service: BaseLLMService, prompt_service: PromptService):
        self.llm_service = llm_service
        self.prompt_service = prompt_service

    async def generate_email(self, summary: str, flights: List[Flight]) -> str:
        """Drafts a professional email summarizing the flight options."""
        logger.info("Drafting flight summary email...")
        
        flights_data = [flight.model_dump() for flight in flights]
        flights_json = json.dumps(flights_data, indent=2)
        
        prompt = self.prompt_service.format_prompt(
            "email", 
            summary=summary, 
            flights_json=flights_json
        )
        system_instruction = (
            "You are a professional assistant. "
            "Write a clean, polite, and formal email summarizing the flight recommendations for the client."
        )
        
        try:
            email_text = await self.llm_service.generate_text(
                prompt=prompt,
                system_instruction=system_instruction
            )
            logger.info("Email draft generated successfully.")
            return email_text
        except Exception as e:
            logger.error(f"EmailGeneratorAgent failed: {e}")
            return "Error: Could not draft email."
