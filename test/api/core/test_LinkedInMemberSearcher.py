import pytest
from unittest.mock import MagicMock
from api.core.LinkedInMemberSearcher import LinkedInMemberSearcher
from api.core.search_engines import GoogleSearchEngine

@pytest.fixture
def mock_engine():
    return MagicMock(spec=GoogleSearchEngine)

@pytest.fixture
def searcher(mock_engine):
    return LinkedInMemberSearcher(search_engine=mock_engine)

def test_initialization():
    searcher = LinkedInMemberSearcher()
    assert isinstance(searcher.search_engine, GoogleSearchEngine)

def test_get_members_calls_engine(searcher, mock_engine):
    mock_engine.search.return_value = [
        {"url": "https://www.linkedin.com/in/john-doe", "name": "John Doe"},
        {"url": "https://www.linkedin.com/in/jane-smith", "name": "Jane Smith"}
    ]
    
    results = searcher.get_members("Google")
    
    mock_engine.search.assert_called_once_with("site:linkedin.com/in Google", pages=1)
    assert len(results) == 2
    assert results[0]["name"] == "John Doe"
    assert results[1]["url"] == "https://www.linkedin.com/in/jane-smith"

def test_google_engine_cleaning():
    engine = GoogleSearchEngine()
    assert engine._clean_name("John Doe - LinkedIn") == "John Doe"
    assert engine._clean_name("Jane Smith | LinkedIn") == "Jane Smith"
    assert engine._clean_name("Bob Brown") == "Bob Brown"
