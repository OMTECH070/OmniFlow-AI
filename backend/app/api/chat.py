from fastapi import APIRouter, HTTPException
from app.schemas.request import ChatRequest
from app.schemas.response import ChatResponse
from app.services.gemini_service import GeminiService
from app.services.prompt_service import PromptService
from app.agents.planner import PlannerAgent
from app.utils.logger import logger

router = APIRouter()

# Initialize LLM, Prompts, and the Planner Orchestrator
try:
    gemini_service = GeminiService()
    prompt_service = PromptService()
    planner_agent = PlannerAgent(gemini_service, prompt_service)
except Exception as e:
    logger.error(f"Error initializing services: {e}")
    planner_agent = None

@router.post("", response_model=ChatResponse, response_model_by_alias=True)
async def chat_endpoint(request: ChatRequest) -> ChatResponse:
    """
    POST /chat
    Processes the user's natural language command, runs agent planning, 
    executes browser automation if needed, and returns structured analysis.
    """
    if not planner_agent:
        raise HTTPException(
            status_code=503, 
            detail="AI backend services are not properly initialized. Check credentials and server configuration."
        )
        
    try:
        logger.info(f"Received user request: '{request.message}'")
        response = await planner_agent.execute(request.message)
        return response
    except Exception as e:
        logger.error(f"Failed to process chat: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"An error occurred while executing the agent pipeline: {str(e)}"
        )
