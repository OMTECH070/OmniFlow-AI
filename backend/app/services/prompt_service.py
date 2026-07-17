import os
from app.utils.logger import logger

class PromptService:
    """Service to load, cache, and format prompt templates from the prompts directory."""

    def __init__(self):
        # Locate the prompts directory relative to this service file
        self.prompts_dir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "..", "prompts")
        )
        self._cache = {}

    def get_prompt(self, name: str) -> str:
        """Retrieves raw content of a prompt file by name, caching the result."""
        if name in self._cache:
            return self._cache[name]

        # Standardize filenames
        filename = name if name.endswith(".txt") else f"{name}.txt"
        filepath = os.path.join(self.prompts_dir, filename)

        try:
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
                self._cache[name] = content
                return content
        except FileNotFoundError:
            logger.error(f"Prompt template not found at: {filepath}")
            raise FileNotFoundError(f"Prompt template '{filename}' not found.")
        except Exception as e:
            logger.error(f"Error reading prompt template '{filename}': {e}")
            raise e

    def format_prompt(self, name: str, **kwargs) -> str:
        """Loads a prompt template and formats it with variables."""
        template = self.get_prompt(name)
        try:
            return template.format(**kwargs)
        except KeyError as ke:
            logger.error(f"Missing format key {ke} for prompt '{name}'")
            raise ke
