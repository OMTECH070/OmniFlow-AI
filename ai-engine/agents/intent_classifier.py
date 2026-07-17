from typing import Literal
from pydantic import BaseModel, Field

from schema.intent import Intent
from utils.llm_client import LLMClient
from utils.logger import logger

class IntentClassifierOutput(BaseModel):
    """Output validation schema for intent classifier."""
    intent: Literal["chat", "search", "automation", "code", "unknown"] = Field(
        ..., 
        description="The primary intent classification of the user's input."
    )

class IntentClassifier:
    """Agent that identifies intent category for incoming user queries."""

    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    async def classify(self, user_input: str) -> Intent:
        """Identifies and returns the Intent enum of the input query."""
        logger.info(f"Classifying intent for input: '{user_input}'")
        
        prompt = (
            f"You are a professional classification model.\n"
            f"Categorize the user's request into exactly one of these classes:\n"
            f"- chat: conversational chat, definitions, math or basic queries.\n"
            f"- search: searching web news, article lookup, or scraping links.\n"
            f"- automation: browser automation actions (clicking elements, logging into web interfaces).\n"
            f"- code: writing, explaining, or reviewing code scripts.\n"
            f"- unknown: anything else.\n\n"
            f"Query: '{user_input}'"
        )
        
        system_instruction = "You classify text into intent categories. Output only valid JSON."
        
        try:
            output = await self.llm_client.generate_json(
                prompt=prompt,
                schema=IntentClassifierOutput,
                system_instruction=system_instruction
            )
            logger.info(f"Classified intent result: '{output.intent}'")
            return Intent(output.intent)
        except Exception as e:
            logger.error(f"IntentClassifier failed: {e}. Defaulting to CHAT.")
            return Intent.CHAT