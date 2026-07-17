from playwright.async_api import async_playwright, Browser, BrowserContext, Page
from app.utils.config import settings
from app.utils.logger import logger

class PlaywrightBrowserManager:
    """Manages Playwright browser instance lifecycles."""

    def __init__(self):
        self.playwright = None
        self.browser = None
        self.context = None

    async def start(self) -> Page:
        """Launches a chromium browser and returns a configured Page object."""
        logger.info("Starting Playwright browser...")
        try:
            self.playwright = await async_playwright().start()
            self.browser = await self.playwright.chromium.launch(
                headless=settings.playwright_headless
            )
            
            # Setup a realistic User-Agent and viewport to minimize bot-detection
            self.context = await self.browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                viewport={"width": 1280, "height": 800}
            )
            
            page = await self.context.new_page()
            logger.info("Playwright browser started successfully.")
            return page
        except Exception as e:
            logger.error(f"Failed to start Playwright browser: {e}")
            await self.stop()
            raise e

    async def stop(self):
        """Closes browser instances and stops Playwright engine."""
        logger.info("Stopping Playwright browser...")
        try:
            if self.context:
                await self.context.close()
            if self.browser:
                await self.browser.close()
            if self.playwright:
                await self.playwright.stop()
            logger.info("Playwright browser stopped successfully.")
        except Exception as e:
            logger.error(f"Error during Playwright browser cleanup: {e}")
        finally:
            self.context = None
            self.browser = None
            self.playwright = None
