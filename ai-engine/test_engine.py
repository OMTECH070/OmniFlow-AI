import asyncio
import sys
from workflows.workflow import AIWorkflow

async def run_tests():
    print("Starting AI Engine Integration Verification...")
    workflow = AIWorkflow()
    session_id = "test_memory_session"
    
    # 1. First request
    q1 = "Hello, I am a software engineer studying browser automation agents."
    print(f"\nRequest 1: '{q1}'")
    r1 = await workflow.run(q1, session_id=session_id)
    print(f"Status: {r1.success}, Action: {r1.action}")
    assert r1.success is True
    
    # 2. Second request referencing the first request context to verify memory works
    q2 = "What did I say my profession was?"
    print(f"\nRequest 2: '{q2}'")
    r2 = await workflow.run(q2, session_id=session_id)
    print(f"Status: {r2.success}, Action: {r2.action}")
    print(f"Assistant response: {r2.response}")
    
    assert r2.success is True
    # If the API key is set, the assistant should be able to answer correctly because of memory.
    
    print("\nVerifying session memory context storage...")
    memory = workflow.session_manager.get_session(session_id)
    history = memory.load()
    print(f"Total messages in history: {len(history)}")
    assert len(history) >= 4  # (User, Assist, User, Assist)
    
    print("\nAI Engine integration tests PASSED successfully!\n")

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    asyncio.run(run_tests())
