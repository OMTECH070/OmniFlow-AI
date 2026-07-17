from playwright.async_api import Page
from app.utils.logger import logger

async def handle_google_consent_popups(page: Page):
    """Detects and bypasses Google cookie consent popups if they appear."""
    try:
        # Common selectors for Google consent buttons in different regions
        consent_selectors = [
            "button:has-text('Accept all')",
            "button:has-text('I agree')",
            "button:has-text('Agree')",
            "button:has-text('Accept')",
            "button#L2AGLb"  # Specific ID for Google Accept All
        ]
        
        for selector in consent_selectors:
            button = page.locator(selector)
            # Give it a short wait to see if it becomes visible
            try:
                if await button.is_visible():
                    logger.info(f"Google consent/cookie popup detected. Clicking: {selector}")
                    await button.click()
                    await page.wait_for_load_state("load", timeout=3000)
                    return
            except Exception:
                continue
    except Exception as e:
        logger.debug(f"Error checking or bypassing Google consent popup: {e}")
