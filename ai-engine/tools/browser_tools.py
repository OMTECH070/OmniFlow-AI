import sys
import asyncio
from playwright.async_api import async_playwright
from utils.logger import logger

class BrowserTools:
    """Automates browser interactions using Playwright."""

    def __init__(self):
        self.playwright = None
        self.browser = None
        self.context = None
        self.page = None

    async def open_browser(self, url: str = "about:blank") -> str:
        """Launches Chromium and loads the specified URL."""
        logger.info(f"Tool Action: Opening browser and navigating to {url}")
        
        # Ensure event loop policy supports subprocess on Windows
        if sys.platform == "win32":
            try:
                asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
            except Exception:
                pass
                
        try:
            self.playwright = await async_playwright().start()
            self.browser = await self.playwright.chromium.launch(headless=True)
            self.context = await self.browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
            self.page = await self.context.new_page()
            await self.page.goto(url, wait_until="load", timeout=15000)
            return f"Success: Browser opened and navigated to {url}"
        except Exception as e:
            logger.error(f"Failed to open browser: {e}")
            await self.close_browser()
            return f"Error: Could not launch browser or navigate to {url}. Details: {e}"

    async def click_element(self, selector: str) -> str:
        """Clicks an element matching the selector."""
        logger.info(f"Tool Action: Clicking element '{selector}'")
        if not self.page:
            return "Error: Browser is not open. Call open_browser first."
        try:
            await self.page.click(selector, timeout=5000)
            return f"Success: Clicked element '{selector}'"
        except Exception as e:
            logger.error(f"Click failed: {e}")
            return f"Error: Failed to click element '{selector}'. Details: {e}"

    async def type_text(self, selector: str, text: str) -> str:
        """Fills an input element with text."""
        logger.info(f"Tool Action: Typing '{text}' into '{selector}'")
        if not self.page:
            return "Error: Browser is not open. Call open_browser first."
        try:
            await self.page.fill(selector, text, timeout=5000)
            return f"Success: Filled element '{selector}' with text"
        except Exception as e:
            logger.error(f"Type text failed: {e}")
            return f"Error: Failed typing into element '{selector}'. Details: {e}"

    async def close_browser(self) -> str:
        """Terminates active browser context."""
        logger.info("Tool Action: Closing browser")
        try:
            if self.page:
                await self.page.close()
            if self.context:
                await self.context.close()
            if self.browser:
                await self.browser.close()
            if self.playwright:
                await self.playwright.stop()
            return "Success: Browser session closed"
        except Exception as e:
            logger.error(f"Failed to close browser session: {e}")
            return f"Error during browser teardown: {e}"
        finally:
            self.page = None
            self.context = None
            self.browser = None
            self.playwright = None