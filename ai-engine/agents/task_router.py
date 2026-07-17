from schema.intent import Intent
from tools.app_tools import AppTools
from tools.browser_tools import BrowserTools
from tools.web_tools import WebTools
from utils.logger import logger

class TaskRouter:
    """Routes task intents to their corresponding functional toolsets."""

    def __init__(self):
        self.app_tools = AppTools()
        self.browser_tools = BrowserTools()
        self.web_tools = WebTools()

    def route(self, intent: Intent):
        """Returns the appropriate tools instance for a specific intent."""
        logger.info(f"TaskRouter: Routing intent '{intent}' to toolsets.")
        
        if intent == Intent.SEARCH:
            return self.web_tools
        elif intent == Intent.AUTOMATION:
            return self.browser_tools
        elif intent in (Intent.CODE, Intent.UNKNOWN):
            return self.app_tools
        else:
            # CHAT requires no tools execution, handled directly by generator
            return None