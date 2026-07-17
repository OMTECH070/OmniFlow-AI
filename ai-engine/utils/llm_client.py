import asyncio
from functools import partial
from typing import Optional, Type
from pydantic import BaseModel

from config.settings import Settings
from utils.logger import logger

class LLMClient:
    """Unified service adapter managing OpenAI and Google Gemini connections."""

    def __init__(self):
        self.settings = Settings()
        self.provider = self.settings.DEFAULT_LLM_PROVIDER
        
        # Initialize Gemini API
        if self.settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.settings.GEMINI_API_KEY)
            except Exception as e:
                logger.error(f"Failed to configure Gemini: {e}")
                
        # Initialize OpenAI API
        if self.settings.OPENAI_API_KEY:
            try:
                from openai import AsyncOpenAI
                self.openai_client = AsyncOpenAI(api_key=self.settings.OPENAI_API_KEY)
            except Exception as e:
                logger.error(f"Failed to configure OpenAI: {e}")
                self.openai_client = None
        else:
            self.openai_client = None

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

    def _dereference_schema(self, schema: dict) -> dict:
        """Inlines all $ref references from $defs into the schema itself for Gemini compatibility."""
        if not isinstance(schema, dict):
            return schema
        
        defs = schema.get("$defs", {})
        
        def resolve(item):
            if isinstance(item, dict):
                if "$ref" in item:
                    ref_path = item["$ref"]
                    ref_name = ref_path.split("/")[-1]
                    if ref_name in defs:
                        resolved_item = resolve(defs[ref_name])
                        if "description" in item:
                            resolved_item = resolved_item.copy()
                            resolved_item["description"] = item["description"]
                        return resolved_item
                return {k: resolve(v) for k, v in item.items() if k != "$defs"}
            elif isinstance(item, list):
                return [resolve(i) for i in item]
            return item

        return resolve(schema)


    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """Asynchronously requests plain-text generation from the selected LLM provider."""
        # 1. Route to OpenAI if selected
        if self.provider == "openai" and self.openai_client:
            try:
                logger.info(f"Routing text generation to OpenAI using model: {self.settings.DEFAULT_MODEL or 'gpt-4o'}")
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})
                
                response = await self.openai_client.chat.completions.create(
                    model=self.settings.DEFAULT_MODEL or "gpt-4o",
                    messages=messages
                )
                return response.choices[0].message.content
            except Exception as e:
                logger.warning(f"OpenAI text generation failed: {e}. Falling back to Gemini.")

        # 2. Default route to Gemini
        try:
            logger.info(f"Routing text generation to Gemini using model: {self.settings.DEFAULT_MODEL}")
            import google.generativeai as genai
            model = genai.GenerativeModel(
                model_name=self.settings.DEFAULT_MODEL,
                system_instruction=system_instruction
            )
            loop = asyncio.get_running_loop()
            func = partial(model.generate_content, prompt)
            response = await loop.run_in_executor(None, func)
            return response.text
        except Exception as e:
            logger.error(f"LLM generation failed: {e}")
            raise e

    async def generate_json(self, prompt: str, schema: Type[BaseModel], system_instruction: Optional[str] = None) -> BaseModel:
        """Asynchronously requests structured JSON output parsed into a Pydantic model."""
        # 1. Route to OpenAI if selected
        if self.provider == "openai" and self.openai_client:
            try:
                logger.info(f"Routing JSON generation to OpenAI with schema: {schema.__name__}")
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})
                
                response = await self.openai_client.beta.chat.completions.parse(
                    model=self.settings.DEFAULT_MODEL or "gpt-4o",
                    messages=messages,
                    response_format=schema
                )
                return response.choices[0].message.parsed
            except Exception as e:
                logger.warning(f"OpenAI JSON generation failed: {e}. Falling back to Gemini.")

        # 2. Default route to Gemini
        try:
            logger.info(f"Routing JSON generation to Gemini with schema: {schema.__name__}")
            import google.generativeai as genai
            model = genai.GenerativeModel(
                model_name=self.settings.DEFAULT_MODEL,
                system_instruction=system_instruction
            )
            
            # Clean and dereference schema properties to bypass Gemini SDK validation errors
            raw_schema = schema.model_json_schema()
            deref_schema = self._dereference_schema(raw_schema)
            cleaned_schema = self._clean_schema(deref_schema)
            
            generation_config = genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=cleaned_schema
            )
            
            loop = asyncio.get_running_loop()
            func = partial(model.generate_content, prompt, generation_config=generation_config)
            response = await loop.run_in_executor(None, func)
            return schema.model_validate_json(response.text)
        except Exception as e:
            logger.error(f"LLM JSON generation failed: {e}")
            raise e
