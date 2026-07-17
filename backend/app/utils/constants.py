# Supported Intents
INTENT_FLIGHT_SEARCH = "flight_search"
INTENT_SHOPPING = "shopping"
INTENT_EMAIL = "email"
INTENT_CALENDAR = "calendar"
INTENT_RESEARCH = "research"

SUPPORTED_INTENTS = [
    INTENT_FLIGHT_SEARCH,
    INTENT_SHOPPING,
    INTENT_EMAIL,
    INTENT_CALENDAR,
    INTENT_RESEARCH
]

# Default LLM configurations
DEFAULT_GEMINI_MODEL = "gemini-1.5-flash"

# Fallback/Mock Flight Data for testing and resilient degradation
MOCK_FLIGHTS = [
    {
        "airline": "IndiGo",
        "price": "₹5,200",
        "website": "Google Flights",
        "departure_time": "06:00",
        "arrival_time": "08:15",
        "duration": "2h 15m"
    },
    {
        "airline": "Air India",
        "price": "₹6,150",
        "website": "Google Flights",
        "departure_time": "08:00",
        "arrival_time": "10:10",
        "duration": "2h 10m"
    },
    {
        "airline": "Vistara",
        "price": "₹6,800",
        "website": "Google Flights",
        "departure_time": "10:20",
        "arrival_time": "12:35",
        "duration": "2h 15m"
    },
    {
        "airline": "SpiceJet",
        "price": "₹4,950",
        "website": "Google Flights",
        "departure_time": "18:40",
        "arrival_time": "21:00",
        "duration": "2h 20m"
    },
    {
        "airline": "Akasa Air",
        "price": "₹5,100",
        "website": "Google Flights",
        "departure_time": "20:30",
        "arrival_time": "22:45",
        "duration": "2h 15m"
    }
]
