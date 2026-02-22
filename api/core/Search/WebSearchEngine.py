from typing import List, Dict
from abc import ABC, abstractmethod

class WebSearchEngine(ABC):
    """
    Interface for search engine strategies.
    Implementations of this class define specific ways to perform web searches.
    """
    @abstractmethod
    def search(self, query: str, pages: int = 1) -> List[Dict[str, str]]:
        """
        Performs a web search and returns results.
        Returns a list of dictionaries with raw engine results (e.g., 'link', 'title').
        """
        pass
