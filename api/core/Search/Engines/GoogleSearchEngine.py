import os
import requests
from typing import List, Dict, Optional
from ..WebSearchEngine import WebSearchEngine
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class GoogleSearchEngine(WebSearchEngine):
    """
    Google Search implementation using official Custom Search API.
    Requires GOOGLE_API_KEY and GOOGLE_CX in .env.
    """
    def __init__(self, api_key: Optional[str] = None, cx: Optional[str] = None):
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        self.cx = cx or os.getenv("GOOGLE_CX")
        self.base_url = "https://www.googleapis.com/customsearch/v1"

    def search(self, query: str, pages: int = 1) -> List[Dict[str, str]]:
        if not self.api_key or not self.cx:
            print("Error: Google API Key or CX not found in environment.")
            return []

        results = []
        for page in range(pages):
            start_index = (page * 10) + 1
            params = {
                "key": self.api_key,
                "cx": self.cx,
                "q": query,
                "start": start_index
            }
            
            try:
                response = requests.get(self.base_url, params=params, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if "items" in data:
                        for item in data["items"]:
                            results.append({
                                "url": item.get("link", ""),
                                "name": item.get("title", "")
                            })
                else:
                    print(f"Google API call failed: {response.status_code} - {response.text}")
                    break
            except Exception as e:
                print(f"Error during Google API search: {e}")
                break
                
        return results
