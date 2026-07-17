from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

from app.services.llm import BaseLLMService
from app.utils.logger import logger

class ExtractedEntitiesModel(BaseModel):
    """Pydantic model representing extracted travel entities."""
    from_location: Optional[str] = Field(
        default=None, 
        description="Departure or origin location (e.g., 'Mumbai')"
    )
    to_location: Optional[str] = Field(
        default=None, 
        description="Arrival or destination location (e.g., 'Delhi')"
    )
    date: Optional[str] = Field(
        default=None, 
        description="Date or timing expression of travel (e.g., 'Next Friday')"
    )
    budget: Optional[str] = Field(
        default=None, 
        description="Any financial budget constraints specified (e.g., 'under 6000')"
    )

class EntityExtractorAgent:
    """Agent responsible for parsing travel parameters from natural language prompts."""

    def __init__(self, llm_service: BaseLLMService):
        self.llm_service = llm_service

    async def extract(self, query: str) -> ExtractedEntitiesModel:
        """Extracts structured entities from the query."""
        logger.info(f"Extracting entities for query: '{query}'")
        
        # Inject the current datetime as context for resolving expressions like "next Friday"
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        prompt = (
            f"You are an expert entity extraction assistant for travel requests.\n"
            f"Analyze the user's query and extract the departure location, destination location, date, and budget.\n\n"
            f"Context: Today's date and time is {current_time}.\n"
            f"User Query: '{query}'\n\n"
            f"Extract all parameters matching the target JSON schema. If an entity is not specified, leave it null."
        )
        
        system_instruction = "You are a professional travel entity extraction model. Output only JSON."
        
        try:
            entities = await self.llm_service.generate_json(
                prompt=prompt,
                schema=ExtractedEntitiesModel,
                system_instruction=system_instruction
            )
            logger.info(f"Extracted entities: {entities}")
            return entities
        except Exception as e:
            logger.error(f"EntityExtractorAgent failed to extract: {e}. Returning empty entities.")
            return ExtractedEntitiesModel()
