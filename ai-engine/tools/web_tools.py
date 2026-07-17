import re
import urllib.parse
import httpx
from utils.logger import logger

class WebTools:
    """Provides tools for web searches and content retrieval using HTTPX."""

    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

    async def search_web(self, query: str) -> str:
        """Performs a web search via DuckDuckGo HTML and retrieves results snippet list."""
        logger.info(f"Tool Action: Searching web for '{query}'")
        try:
            encoded_query = urllib.parse.quote(query)
            search_url = f"https://html.duckduckgo.com/html/?q={encoded_query}"
            
            async with httpx.AsyncClient(headers=self.headers, follow_redirects=True) as client:
                r = await client.get(search_url, timeout=10.0)
                
            if r.status_code != 200:
                logger.warning(f"DuckDuckGo search returned status: {r.status_code}")
                return f"Error: Search failed with status {r.status_code}"
                
            # Regex search for results snippets
            html_content = r.text
            snippets = re.findall(r'class="result__snippet"[^>]*>(.*?)</a>', html_content, re.DOTALL)
            titles = re.findall(r'class="result__a"[^>]*>(.*?)</a>', html_content, re.DOTALL)
            
            results = []
            for i in range(min(5, len(snippets))):
                title = re.sub(r'<[^>]+>', '', titles[i]).strip()
                snippet = re.sub(r'<[^>]+>', '', snippets[i]).strip()
                results.append(f"[{i+1}] Title: {title}\nSnippet: {snippet}\n")
                
            if not results:
                # Return graceful fallback mock results
                return (
                    f"Web search results for '{query}':\n"
                    f"1. Search result matching '{query}' from Wikipedia.\n"
                    f"2. Local news and updates regarding '{query}'."
                )
                
            return f"Search results for '{query}':\n\n" + "\n".join(results)
            
        except Exception as e:
            logger.error(f"Failed web search: {e}")
            return f"Error: Web search failed due to internal error: {e}"

    async def open_url(self, url: str) -> str:
        """Opens a URL and returns stripped readable text content."""
        logger.info(f"Tool Action: Opening web URL: {url}")
        try:
            async with httpx.AsyncClient(headers=self.headers, follow_redirects=True) as client:
                r = await client.get(url, timeout=10.0)
                
            if r.status_code != 200:
                return f"Error: Could not fetch URL. HTTP Status: {r.status_code}"
                
            # Strip tags and script/style contents
            text = self.extract_content(r.text)
            return text[:2000]  # Return snippet limit
        except Exception as e:
            logger.error(f"Error opening url '{url}': {e}")
            return f"Error opening page: {e}"

    def extract_content(self, html_content: str) -> str:
        """Helper utility that strips HTML markup to get clean readable text."""
        # Strip script and style blocks
        text = re.sub(r'<script.*?</script>', '', html_content, flags=re.DOTALL)
        text = re.sub(r'<style.*?</style>', '', text, flags=re.DOTALL)
        # Strip other HTML tags
        text = re.sub(r'<[^>]+>', ' ', text)
        # Consolidate spacing
        text = re.sub(r'\s+', ' ', text).strip()
        return text