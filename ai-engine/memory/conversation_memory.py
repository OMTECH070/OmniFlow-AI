from typing import List, Dict

class ConversationMemory:
    """Manages the history of conversational messages for a single session."""
    
    def __init__(self):
        self.history: List[Dict[str, str]] = []

    def save(self, role: str, content: str):
        """Saves a message. Roles should be 'user' or 'assistant'."""
        self.history.append({"role": role, "content": content})

    def load(self) -> List[Dict[str, str]]:
        """Returns the conversation history."""
        return self.history

    def get_formatted_history(self) -> str:
        """Formats the history as plain text for context injection in prompts."""
        formatted = []
        for msg in self.history:
            role_label = "User" if msg["role"] == "user" else "Assistant"
            formatted.append(f"{role_label}: {msg['content']}")
        return "\n".join(formatted)

    def clear(self):
        """Clears the session's conversation history."""
        self.history = []