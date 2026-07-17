from app.agents.intent import IntentAgent
from app.agents.entity_extractor import EntityExtractorAgent
from app.agents.summarizer import SummarizerAgent
from app.agents.email_generator import EmailGeneratorAgent
from app.automation.flight_search import search_flights
from app.services.llm import BaseLLMService
from app.services.prompt_service import PromptService
from app.utils.logger import logger
from app.schemas.response import ChatResponse, ExtractedEntities, FlightResult

class PlannerAgent:
    """Central orchestrator agent that coordinates task planning, intent classification, entity extraction, flight search, summarization, and email generation."""

    def __init__(self, llm_service: BaseLLMService, prompt_service: PromptService):
        self.llm_service = llm_service
        self.prompt_service = prompt_service
        self.intent_agent = IntentAgent(llm_service, prompt_service)
        self.entity_extractor = EntityExtractorAgent(llm_service)
        self.summarizer = SummarizerAgent(llm_service, prompt_service)
        self.email_generator = EmailGeneratorAgent(llm_service, prompt_service)

    async def execute(self, query: str) -> ChatResponse:
        """Executes the planning pipeline for a user request."""
        logger.info(f"Planner starting execution for query: '{query}'")
        
        # 1. Classify intent
        intent = await self.intent_agent.classify(query)
        
        # 2. Extract entities
        entities = await self.entity_extractor.extract(query)
        
        # 3. Route task based on intent
        if intent == "flight_search":
            # Establish defaults if some entities are missing from the query
            from_loc = entities.from_location or "Mumbai"
            to_loc = entities.to_location or "Delhi"
            date_val = entities.date or "Next Friday"
            
            # Update values back into the response entities structure
            entities.from_location = from_loc
            entities.to_location = to_loc
            entities.date = date_val
            
            # Execute browser flight search automation
            flights = await search_flights(from_loc, to_loc, date_val)
            
            # Generate summary of flight listings
            summary = await self.summarizer.summarize(flights)
            
            # Generate a professional email draft
            email_draft = await self.email_generator.generate_email(summary, flights)
            
            # Map scraped flight models to schema results format
            results = [
                FlightResult(
                    airline=flight.airline, 
                    price=flight.price, 
                    website=flight.website
                ) 
                for flight in flights
            ]
        else:
            # Handle other intents gracefully since only flight search is in scope for the MVP
            logger.warning(f"Intent '{intent}' is outside flight_search scope. Skipping automation.")
            results = []
            summary = (
                f"Your request was identified with intent '{intent}'. "
                f"However, the OmniFlow AI flight automation assistant only supports flight search queries at this time."
            )
            email_draft = (
                f"Dear User,\n\n"
                f"Thank you for your request. We detected your intent is related to '{intent}'.\n"
                f"Currently, OmniFlow AI is in MVP stage and only automates flight searches.\n"
                f"We hope to add support for '{intent}' automation soon.\n\n"
                f"Sincerely,\n"
                f"OmniFlow AI Team"
            )
            
        # 4. Construct final response model
        response_entities = ExtractedEntities(
            from_location=entities.from_location,
            to_location=entities.to_location,
            date=entities.date,
            budget=entities.budget
        )
        
        logger.info("Planner execution completed successfully.")
        
        return ChatResponse(
            intent=intent,
            entities=response_entities,
            results=results,
            summary=summary,
            email=email_draft
        )
