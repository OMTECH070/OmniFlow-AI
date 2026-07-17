import os
import logging
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    gemini_api_key: str = Field(default="YOUR_GEMINI_API_KEY_HERE", validation_alias="GEMINI_API_KEY")
    playwright_headless: bool = Field(default=True, validation_alias="PLAYWRIGHT_HEADLESS")
    log_level: str = Field(default="INFO", validation_alias="LOG_LEVEL")
    port: int = Field(default=8000, validation_alias="PORT")
    host: str = Field(default="127.0.0.1", validation_alias="HOST")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

# Try initializing settings, fallback to defaults if .env is missing or incorrect
try:
    settings = Settings()
except Exception as e:
    logging.warning(f"Failed to load settings via Pydantic: {e}. Falling back to default settings.")
    settings = Settings(
        gemini_api_key=os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE"),
        playwright_headless=os.getenv("PLAYWRIGHT_HEADLESS", "True").lower() == "true",
        log_level=os.getenv("LOG_LEVEL", "INFO"),
        port=int(os.getenv("PORT", "8000")),
        host=os.getenv("HOST", "127.0.0.1")
    )
