from enum import Enum

class Intent(str, Enum):
    CHAT = "chat"
    SEARCH = "search"
    AUTOMATION = "automation"
    CODE = "code"
    UNKNOWN = "unknown"