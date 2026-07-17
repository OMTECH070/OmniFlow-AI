from pydantic import BaseModel, Field
from typing import Optional

class Flight(BaseModel):
    """Data model representing flight information."""
    airline: str = Field(..., description="Name of the airline, e.g., IndiGo")
    price: str = Field(..., description="Ticket price, e.g., ₹5200")
    website: str = Field(default="Google Flights", description="Booking website or platform source")
    departure_time: Optional[str] = Field(default=None, description="Time of flight departure")
    arrival_time: Optional[str] = Field(default=None, description="Time of flight arrival")
    duration: Optional[str] = Field(default=None, description="Total duration of the flight")
