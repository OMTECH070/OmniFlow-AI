from typing import Dict
from memory.conversation_memory import ConversationMemory

class SessionManager:
    """Tracks and manages active conversation memory states mapped to session IDs."""

    def __init__(self):
        self.sessions: Dict[str, ConversationMemory] = {}

    def create_session(self, session_id: str) -> ConversationMemory:
        """Creates and indexes a new session memory."""
        memory = ConversationMemory()
        self.sessions[session_id] = memory
        return memory

    def get_session(self, session_id: str) -> ConversationMemory:
        """Retrieves an existing session memory, initializing a new one if not found."""
        if session_id not in self.sessions:
            return self.create_session(session_id)
        return self.sessions[session_id]

    def end_session(self, session_id: str):
        """Terminates a session and removes its history from memory."""
        if session_id in self.sessions:
            del self.sessions[session_id]