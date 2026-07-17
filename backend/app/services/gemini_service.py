import asyncio
import json
from functools import partial
from typing import Optional, Type
import google.generativeai as genai
from pydantic import BaseModel

from app.services.llm import BaseLLMService
from app.utils.config import settings
from app.utils.logger import logger
from app.utils.constants import DEFAULT_GEMINI_MODEL

class GeminiService(BaseLLMService):
    """Implementation of BaseLLMService using the official Google Gemini API SDK."""

    def __init__(self):
        self.api_key = settings.gemini_api_key
        if not self.api_key or self.api_key == "YOUR_GEMINI_API_KEY_HERE":
            logger.warning("GEMINI_API_KEY environment variable is not set. Gemini LLM calls will fail.")
        genai.configure(api_key=self.api_key)

    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """Generates plain text content using Gemini 1.5 Flash in a separate thread to prevent blocking."""
        try:
            logger.info("Sending text generation request to Gemini...")
            model = genai.GenerativeModel(
                model_name=DEFAULT_GEMINI_MODEL,
                system_instruction=system_instruction
            )
            
            # google-generativeai is blocking, so run it in the event loop's executor
            loop = asyncio.get_running_loop()
            func = partial(model.generate_content, prompt)
            response = await loop.run_in_executor(None, func)
            
            logger.info("Text generation completed successfully.")
            return response.text
        except Exception as e:
            logger.error(f"Error during Gemini text generation: {e}")
            raise e

    def _clean_schema(self, schema_dict: dict) -> dict:
        """Recursively removes 'default' and 'title' keys from JSON schema for Gemini API compatibility."""
        if not isinstance(schema_dict, dict):
            return schema_dict
        cleaned = {k: v for k, v in schema_dict.items() if k not in ('default', 'title')}
        for k, v in cleaned.items():
            if isinstance(v, dict):
                cleaned[k] = self._clean_schema(v)
            elif isinstance(v, list):
                cleaned[k] = [self._clean_schema(item) if isinstance(item, dict) else item for item in v]
        return cleaned

    async def generate_json(self, prompt: str, schema: Type[BaseModel], system_instruction: Optional[str] = None) -> BaseModel:
        """Generates structured JSON content validated against a Pydantic model."""
        try:
            logger.info(f"Sending JSON generation request to Gemini with schema: {schema.__name__}...")
            model = genai.GenerativeModel(
                model_name=DEFAULT_GEMINI_MODEL,
                system_instruction=system_instruction
            )
            
            # Extract and clean Pydantic schema to avoid Gemini 'Unknown field for Schema: default' errors
            raw_schema = schema.model_json_schema()
            cleaned_schema = self._clean_schema(raw_schema)
            
            generation_config = genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=cleaned_schema
            )
            
            loop = asyncio.get_running_loop()
            func = partial(model.generate_content, prompt, generation_config=generation_config)
            response = await loop.run_in_executor(None, func)
            
            json_str = response.text
            logger.info("Structured JSON generated successfully.")
            logger.debug(f"Raw response: {json_str}")
            
            # Load and validate using Pydantic model
            return schema.model_validate_json(json_str)
        except Exception as e:
            logger.error(f"Error during Gemini JSON generation: {e}")
            raise e
