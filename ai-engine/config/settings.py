import os
from dotenv import load_dotenv

# Load workspace .env (which contains GEMINI_API_KEY / PLAYWRIGHT_HEADLESS)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", "..", "backend", ".env"))
load_dotenv()

class Settings:
    APP_NAME = "OmniFlow AI"
    VERSION = "1.0.0"
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    
    # Credentials
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # Provider selection: "gemini" (default) or "openai"
    DEFAULT_LLM_PROVIDER = os.getenv("DEFAULT_LLM_PROVIDER", "gemini")
    DEFAULT_MODEL = os.getenv("DEFAULT_MODEL", "gemini-1.5-flash")