from pydantic import BaseModel, Field
from typing import List, Optional

class FlightResult(BaseModel):
    """Pydantic model representing a flight option in the API response."""
    airline: str = Field(..., description="Airline name")
    price: str = Field(..., description="Flight ticket price")
    website: str = Field(..., description="Website or booking platform")

class ExtractedEntities(BaseModel):
    """Extracted parameters from the user's natural language request."""
    from_location: Optional[str] = Field(
        default=None, 
        alias="from", 
        serialization_alias="from", 
        description="Departure location"
    )
    to_location: Optional[str] = Field(
        default=None, 
        alias="to", 
        serialization_alias="to", 
        description="Arrival destination"
    )
    date: Optional[str] = Field(default=None, description="Requested travel date")
    budget: Optional[str] = Field(default=None, description="Budget constraint if specified")

    class Config:
        populate_by_name = True

class ChatResponse(BaseModel):
    """Response schema for the POST /chat API endpoint."""
    intent: str = Field(..., description="Classified intent of the request")
    entities: ExtractedEntities = Field(..., description="Extracted entities from the prompt")
    results: List[FlightResult] = Field(..., description="Scraped or fallback flight search results")
    summary: str = Field(..., description="AI-generated summary of search results")
    email: str = Field(..., description="AI-drafted email content")

    class Config:
        populate_by_name = True
