from typing import Literal
from pydantic import BaseModel, Field

from app.services.llm import BaseLLMService
from app.services.prompt_service import PromptService
from app.utils.logger import logger

class IntentOutput(BaseModel):
    """Output structure for intent classification."""
    intent: Literal["flight_search", "shopping", "email", "calendar", "research"] = Field(
        ...,
        description="The classified intent of the user request."
    )

class IntentAgent:
    """Agent responsible for identifying the user's intent."""

    def __init__(self, llm_service: BaseLLMService, prompt_service: PromptService):
        self.llm_service = llm_service
        self.prompt_service = prompt_service

    async def classify(self, query: str) -> str:
        """Classifies the user query intent."""
        logger.info(f"Classifying intent for query: '{query}'")
        
        # Load and format the prompt
        prompt = self.prompt_service.format_prompt("intent", query=query)
        system_instruction = (
            "You are an expert intent classification system. "
            "Analyze the input query and output a single intent matching the schema."
        )
        
        try:
            output = await self.llm_service.generate_json(
                prompt=prompt,
                schema=IntentOutput,
                system_instruction=system_instruction
            )
            logger.info(f"Classified intent: '{output.intent}'")
            return output.intent
        except Exception as e:
            logger.error(f"IntentAgent failed to classify. Defaulting to 'flight_search'. Error: {e}")
            return "flight_search"
