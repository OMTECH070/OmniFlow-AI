from fastapi import APIRouter
from typing import Dict

router = APIRouter()

@router.get("", response_model=Dict[str, str])
async def health_check() -> Dict[str, str]:
    """Endpoint to check the health status of the API service."""
    return {
        "status": "healthy",
        "service": "OmniFlow AI Backend"
    }
