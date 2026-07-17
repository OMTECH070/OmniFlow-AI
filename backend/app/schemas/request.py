from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    """Input payload schema for the chat endpoint."""
    message: str = Field(
        ...,
        description="The natural language query or command from the user.",
        examples=["Find the cheapest flight from Mumbai to Delhi next Friday and email me the best option."]
    )
