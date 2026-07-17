import asyncio
import sys
from workflows.workflow import AIWorkflow

async def main():
    print("OmniFlow AI Engine: Initializing system components...")
    
    # Configure loop policy on Windows for subprocess execution compatibility
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
        
    workflow = AIWorkflow()
    print("OmniFlow AI Engine: System initialized successfully.")
    
    # Test query to trigger intent routing, planning, and web search tool actions
    test_query = "Search the web for current AI browser control trends."
    print(f"\nExecuting trial workflow query: '{test_query}'...")
    
    response = await workflow.run(test_query, session_id="dev_session_01")
    
    print("\n================== WORKFLOW OUTPUT ==================")
    print(f"Execution Success  : {response.success}")
    print(f"Primary Intent     : {response.action}")
    print(f"Planner Steps      : {response.plan}")
    print(f"Tool Logs          : {response.tool_results}")
    print(f"Assistant Response : {response.response}")
    print("=====================================================")

if __name__ == "__main__":
    asyncio.run(main())