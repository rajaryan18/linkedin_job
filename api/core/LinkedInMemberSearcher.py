from typing import List, Optional, Dict
from .Search.SearchEngineFactory import SearchEngineFactory
from .Search.WebSearchEngine import WebSearchEngine

class LinkedInMemberSearcher:
    """
    Class to search for LinkedIn members associated with a specific company.
    Now search engine agnostic and uses SearchEngineFactory.
    """
    def __init__(self, search_strategy: Optional[WebSearchEngine] = None):
        self.search_strategy = search_strategy or SearchEngineFactory.get_search_engine("google")

    def set_search_strategy(self, strategy: WebSearchEngine):
        """
        Sets a new search strategy at runtime.
        """
        self.search_strategy = strategy

    def identify_members(self, search_results: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """
        Processes search engine results to identify LinkedIn profiles and extract names.
        """
        members = []
        for res in search_results:
            url = res.get("url", "")
            title = res.get("name", "")
            
            # Clean URL and check if it's a LinkedIn profile
            if "linkedin.com/in/" in url and "/dir/" not in url:
                clean_url = url.split("?")[0]
                if clean_url.endswith("/"):
                    clean_url = clean_url[:-1]
                
                # Extract and clean name from title
                name = self._clean_name(title)
                
                members.append({
                    "url": clean_url,
                    "name": name
                })
        return members

    def _clean_name(self, text: str) -> str:
        """
        Cleans the name from the search result title.
        Example: "John Doe - LinkedIn" -> "John Doe"
        """
        for separator in [" - LinkedIn", " | LinkedIn", " - India | LinkedIn", " - Profile | LinkedIn"]:
            if separator in text:
                text = text.split(separator)[0]
        return text.strip()

    def get_members(self, company_name: str, pages: int = 1) -> List[Dict[str, str]]:
        """
        Searches for LinkedIn profiles and identifies members from the results.
        """
        query = f"site:linkedin.com/in {company_name}"
        raw_results = self.search_strategy.search(query, pages=pages)
        return self.identify_members(raw_results)

if __name__ == "__main__":
    # Test with GoogleSearchEngine by default
    searcher = LinkedInMemberSearcher()
    company = "Google"
    print(f"Searching for members of {company}...")
    results = searcher.get_members(company)
    print(f"Found {len(results)} profiles:")
    for res in sorted(results, key=lambda x: x['name'])[:10]:
        print(f"{res['name']}: {res['url']}")
