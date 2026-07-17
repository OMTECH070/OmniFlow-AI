def validate_input(user_input: str) -> bool:
    """Validates that user input is non-empty and contains printable characters."""
    if not user_input:
        return False
    return len(user_input.strip()) > 0

def format_response(response_text: str) -> str:
    """Ensures responses are clean and stripped of unnecessary leading/trailing spaces."""
    if not response_text:
        return ""
    return response_text.strip()