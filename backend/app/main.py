import sys
import asyncio
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Set WindowsProactorEventLoopPolicy on Windows systems for Playwright compatibility
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from app.api.routes import api_router
from app.utils.config import settings
from app.utils.logger import logger

# Initialize FastAPI Application
app = FastAPI(
    title="OmniFlow AI",
    description="AI Agent backend API capable of web browser automation via natural language.",
    version="1.0.0"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Endpoint Routes
app.include_router(api_router)

@app.on_event("startup")
async def startup_event():
    logger.info("OmniFlow AI Backend server is starting up...")
    logger.info(f"Settings loaded: Host={settings.host}, Port={settings.port}, Playwright Headless={settings.playwright_headless}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("OmniFlow AI Backend server is shutting down...")

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=False
    )
