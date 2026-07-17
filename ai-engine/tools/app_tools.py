import subprocess
from utils.logger import logger

class AppTools:
    """Manages local application processes and interface interactions."""

    def __init__(self):
        self.active_processes = {}

    def launch_application(self, app_name: str, arguments: str = "") -> str:
        """Launches a local system application process asynchronously."""
        logger.info(f"Tool Action: Launching application '{app_name}'")
        try:
            # Execute subprocess
            args_list = [app_name]
            if arguments:
                args_list.extend(arguments.split())
                
            proc = subprocess.Popen(
                args_list, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE,
                text=True
            )
            self.active_processes[app_name] = proc
            return f"Success: Started application '{app_name}' (PID: {proc.pid})"
        except Exception as e:
            logger.error(f"App launch failed: {e}")
            return f"Error: Failed to launch application '{app_name}'. Details: {e}"

    def close_application(self, app_name: str) -> str:
        """Terminates an application process started during this session."""
        logger.info(f"Tool Action: Terminating application '{app_name}'")
        if app_name in self.active_processes:
            try:
                proc = self.active_processes[app_name]
                proc.terminate()
                proc.wait(timeout=2)
                del self.active_processes[app_name]
                return f"Success: Terminated process for '{app_name}'"
            except Exception as e:
                logger.error(f"Error terminating process '{app_name}': {e}")
                return f"Error: Could not cleanly terminate '{app_name}'. Details: {e}"
        return f"Warning: Application '{app_name}' is not currently managed as an active process."

    def interact(self, action: str, details: str = "") -> str:
        """Simulates UI interaction with local application coordinates or keypresses."""
        logger.info(f"Tool Action: Simulating OS interaction '{action}' with details: '{details}'")
        return f"Success: Simulated interaction '{action}' successfully"