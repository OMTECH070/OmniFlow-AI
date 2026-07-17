from agents.planner import Planner
from agents.intent_classifier import IntentClassifier
from agents.task_router import TaskRouter
from agents.executor import ToolExecutor
from agents.response_generator import ResponseGenerator
from memory.session_manager import SessionManager
from utils.llm_client import LLMClient
from utils.logger import logger
from schema.response import AIResponse

class AIWorkflow:
    """Orchestrates the entire AI Engine pipeline sequentially from user input to AIResponse."""

    def __init__(self):
        self.llm_client = LLMClient()
        self.planner = Planner(self.llm_client)
        self.intent_classifier = IntentClassifier(self.llm_client)
        self.task_router = TaskRouter()
        self.executor = ToolExecutor(self.llm_client)
        self.response_generator = ResponseGenerator(self.llm_client)
        self.session_manager = SessionManager()

    async def run(self, user_input: str, session_id: str = "default_session") -> AIResponse:
        """
        Executes the pipeline:
        1. Access memory session
        2. Detect intent
        3. Create execution plan
        4. Route tasks and execute tool calls
        5. Generate response and update memory
        """
        logger.info(f"AIWorkflow: Initiating run. Session: '{session_id}', Query: '{user_input}'")

        # 1. Access memory session
        memory = self.session_manager.get_session(session_id)
        
        # Include history log context to LLM queries implicitly through prompt loading if needed,
        # here we save the current prompt to session memory.
        memory.save("user", user_input)

        try:
            # 2. Detect overall intent
            intent = await self.intent_classifier.classify(user_input)

            # 3. Create execution plan
            plan = await self.planner.create_plan(user_input)

            # 4. Route tasks and execute tool calls
            tool_results = []
            for task in plan:
                logger.info(f"AIWorkflow: Processing subtask '{task.task_id}' (intent: {task.intent})")
                
                # Retrieve the routed tool library instance
                tools = self.task_router.route(task.intent)
                
                # Execute mapped action
                result = await self.executor.execute(task, tools)
                tool_results.append(result)

            # 5. Generate final compiled response
            response_text = await self.response_generator.generate(
                user_input=user_input,
                plan=plan,
                tool_results=tool_results
            )

            # Save assistant answer to context
            memory.save("assistant", response_text)

            plan_steps = [task.description for task in plan]

            logger.info("AIWorkflow: Pipeline executed successfully.")
            return AIResponse(
                success=True,
                response=response_text,
                action=str(intent.value),
                plan=plan_steps,
                tool_results=tool_results
            )

        except Exception as e:
            logger.error(f"AIWorkflow: Fatal pipeline execution error: {e}")
            return AIResponse(
                success=False,
                response=f"Workflow execution failed: {e}",
                action="unknown",
                plan=[],
                tool_results=[]
            )