from pydantic import BaseModel, Field

class AIRequest(BaseModel):
    """Structured request payload model for the AI Engine."""
    session_id: str = Field(..., description="Unique identifier tracking the user session and conversation memory")
    user_input: str = Field(..., description="The user's query or command text")
    timestamp: str = Field(..., description="ISO 8601 string when the request was initiated")