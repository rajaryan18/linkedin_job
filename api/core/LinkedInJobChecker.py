from bs4 import BeautifulSoup
import requests
import pandas as pd
import time
from datetime import datetime
from typing import Optional, List, Dict

class LinkedInJobChecker:
    def __init__(self, job_role: str = "", location: str = ""):
        self.job_role = job_role
        self.location = location
        self.last_scrape_timestamp = 0
        self.job_map = []

    def _url_encode(self, text: str) -> str:
        return text.replace(" ", "%20")

    def get_jobs(self, job_role: Optional[str] = None, location: Optional[str] = None, timespan: int = 86400, pages: int = 1) -> List:
        """
        Scrapes LinkedIn for job postings.
        """
        role = self._url_encode(job_role if job_role else self.job_role)
        loc = self._url_encode(location if location else self.location)
        
        self.job_map = []
        for page in range(pages):
            # rate limiting logic
            current_time = int(pd.Timestamp.now().timestamp())
            if current_time - self.last_scrape_timestamp < 2:
                time.sleep(2)
            
            url = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={role}&location={loc}&start={page*25}&f_TPR=r{timespan}"
            
            try:
                response = requests.get(url, timeout=10)
                self.last_scrape_timestamp = int(pd.Timestamp.now().timestamp())
                
                if response.status_code != 200:
                    print(f"Failed to fetch page {page}: Status {response.status_code}")
                    continue
                
                soup = BeautifulSoup(response.text, "html.parser")
                jobs = soup.find_all("div", class_="base-search-card__info")
                
                for job in jobs:
                    try:
                        title = job.find("h3").text.strip()
                        company_tag = job.find("a", class_="hidden-nested-link")
                        company = company_tag.text.strip() if company_tag else "N/A"
                        
                        location_tag = job.find("span", class_="job-search-card__location")
                        job_location = location_tag.text.strip() if location_tag else "N/A"
                        
                        parent = job.parent
                        if parent and 'data-entity-urn' in parent.attrs:
                            posting_id = parent['data-entity-urn'].split(":")[-1]
                            job_link = f"https://www.linkedin.com/jobs/view/{posting_id}"
                            self.job_map.append([posting_id, title, company, job_location, job_link])
                    except Exception as e:
                        print(f"Error parsing job card: {e}")
            except Exception as e:
                print(f"Request error: {e}")
                
        return self.job_map

    def search_with_filters(self, filters: Optional[Dict], pages: int = 1) -> List:
        """
        Performs search using a dictionary of filters.
        Example filters: {'f_E': '1,2', 'f_JT': 'F,P'}
        """
        role = self._url_encode(self.job_role)
        loc = self._url_encode(self.location)
        
        filter_query = ""
        if filters:
            for key, value in filters.items():
                filter_query += f"&{key}={value}"
        
        self.job_map = []
        for page in range(pages):
            current_time = int(pd.Timestamp.now().timestamp())
            if current_time - self.last_scrape_timestamp < 2:
                time.sleep(2)
                
            url = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={role}&location={loc}&start={page*25}{filter_query}"
            
            try:
                response = requests.get(url, timeout=10)
                self.last_scrape_timestamp = int(pd.Timestamp.now().timestamp())
                
                if response.status_code != 200:
                    continue
                    
                soup = BeautifulSoup(response.text, "html.parser")
                jobs = soup.find_all("div", class_="base-search-card__info")
                
                for job in jobs:
                    try:
                        title = job.find("h3").text.strip()
                        comp = job.find("a", class_="hidden-nested-link")
                        company = comp.text.strip() if comp else "N/A"
                        l_tag = job.find("span", class_="job-search-card__location")
                        loc_text = l_tag.text.strip() if l_tag else "N/A"
                        
                        parent = job.parent
                        if parent and 'data-entity-urn' in parent.attrs:
                            pid = parent['data-entity-urn'].split(":")[-1]
                            self.job_map.append([pid, title, company, loc_text, f"https://www.linkedin.com/jobs/view/{pid}"])
                    except:
                        continue
            except:
                continue
                
        return self.job_map

    def convert_to_excel(self, job_map: Optional[List] = None, filename: str = "jobs.xlsx") -> None:
        data = job_map if job_map is not None else self.job_map
        columns = ["job_id", "title", "company", "location", "link"]
        df = pd.DataFrame(data, columns=columns)
        df.to_excel(filename, index=False)
        print(f"Saved {len(data)} jobs to {filename}")

    def start_periodic_check(self, interval_seconds: int = 3600, pages: int = 1, filters: Optional[Dict] = None):
        """
        Runs the job checker indefinitely at the specified interval.
        """
        print(f"Starting periodic check every {interval_seconds} seconds...")
        while True:
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Checking for jobs...")
            if filters:
                jobs = self.search_with_filters(filters, pages=pages)
            else:
                jobs = self.get_jobs(pages=pages)
            
            if jobs:
                self.convert_to_excel(jobs, f"jobs_{int(time.time())}.xlsx")
            
            print(f"Sleeping for {interval_seconds} seconds...")
            time.sleep(interval_seconds)

if __name__ == "__main__":
    # Example usage
    checker = LinkedInJobChecker(job_role="Software Engineer", location="Remote")
    # To run once:
    # checker.get_jobs(pages=1)
    # checker.convert_to_excel()
    
    # To run periodically:
    # checker.start_periodic_check(interval_seconds=3600)
