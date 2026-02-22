from typing import Dict, Optional
from .WebSearchEngine import WebSearchEngine
from .Engines.GoogleSearchEngine import GoogleSearchEngine

class SearchEngineFactory:
    """
    Factory class to get search engine instances.
    Uses a Singleton pattern to reuse instances.
    """
    _instances: Dict[str, WebSearchEngine] = {}

    @staticmethod
    def get_search_engine(engine_type: str = "google") -> WebSearchEngine:
        engine_type = engine_type.lower()
        
        if engine_type not in SearchEngineFactory._instances:
            if engine_type == "google":
                SearchEngineFactory._instances[engine_type] = GoogleSearchEngine()
            else:
                raise ValueError(f"Unsupported search engine type: {engine_type}")
        
        return SearchEngineFactory._instances[engine_type]
