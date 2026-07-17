import logging
import sys
from app.utils.config import settings

def setup_logger():
    """Sets up a structured logger for the application."""
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Configure root logger
    logging.basicConfig(
        level=settings.log_level.upper(),
        format=log_format,
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Create module logger
    logger = logging.getLogger("OmniFlow-Backend")
    logger.setLevel(settings.log_level.upper())
    return logger

# Global logger instance
logger = setup_logger()
