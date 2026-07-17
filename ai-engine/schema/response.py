from pydantic import BaseModel

class AIResponse(BaseModel):
    success: bool
    response: str
    action: str