from abc import ABC, abstractmethod
from typing import Optional, Type
from pydantic import BaseModel

class BaseLLMService(ABC):
    """Abstract base class defining interface for LLM operations."""
    
    @abstractmethod
    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """Generates plain text response from the model."""
        pass

    @abstractmethod
    async def generate_json(self, prompt: str, schema: Type[BaseModel], system_instruction: Optional[str] = None) -> BaseModel:
        """Generates structured JSON response conforming to a Pydantic schema."""
        pass
