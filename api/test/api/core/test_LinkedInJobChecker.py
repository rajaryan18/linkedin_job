import pytest
from unittest.mock import patch, MagicMock
from api.core.LinkedInJobChecker import LinkedInJobChecker

@pytest.fixture
def checker():
    """Fixture to provide a LinkedInJobChecker instance."""
    return LinkedInJobChecker(job_role="Software Engineer", location="London")

def test_initialization(checker):
    assert checker.job_role == "Software Engineer"
    assert checker.location == "London"
    assert checker.job_map == []

def test_url_encode(checker):
    encoded = checker._url_encode("Data Scientist Remote")
    assert encoded == "Data%20Scientist%20Remote"

@patch('requests.get')
def test_get_jobs_success(mock_get, checker):
    # Simulating the LinkedIn structure for the parser
    html_content = """
    <div class="job-container" data-entity-urn="urn:li:jobPostings:12345">
        <div class="base-search-card__info">
            <h3>Python Developer</h3>
            <a class="hidden-nested-link">Google</a>
            <span class="job-search-card__location">Remote</span>
        </div>
    </div>
    """
    
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.text = html_content
    mock_get.return_value = mock_response

    jobs = checker.get_jobs(pages=1)
    
    assert len(jobs) == 1
    assert jobs[0][1] == "Python Developer"
    assert jobs[0][2] == "Google"
    assert jobs[0][3] == "Remote"
    assert jobs[0][4] == "https://www.linkedin.com/jobs/view/12345"

@patch('requests.get')
def test_search_with_filters(mock_get, checker):
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.text = "<html></html>"
    mock_get.return_value = mock_response

    filters = {"f_E": "2", "f_JT": "F"}
    checker.search_with_filters(filters, pages=1)
    
    # Verify URL construction
    args, kwargs = mock_get.call_args
    url = args[0]
    assert "&f_E=2" in url
    assert "&f_JT=F" in url

