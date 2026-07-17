from agents.planner import Planner
from agents.intent_classifier import IntentClassifier
from agents.task_router import TaskRouter
from agents.executor import ToolExecutor
from agents.response_generator import ResponseGenerator


class AIWorkflow:
    def __init__(self):
        self.planner = Planner()
        self.intent_classifier = IntentClassifier()
        self.task_router = TaskRouter()
        self.executor = ToolExecutor()
        self.response_generator = ResponseGenerator()

    def run(self, user_input):
         """
    Workflow:

    1. Create execution plan
    2. Detect intent
    3. Route task
    4. Execute tool
    5. Generate response
    """
    pass