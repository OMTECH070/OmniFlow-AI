from fastapi import APIRouter
from app.api import chat, health

api_router = APIRouter()

# Include Chat and Health routers
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(health.router, prefix="/health", tags=["Health"])
