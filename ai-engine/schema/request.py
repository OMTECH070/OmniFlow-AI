from pydantic import BaseModel

class AIRequest(BaseModel):
    session_id: str
    user_input: str
    timestamp: str