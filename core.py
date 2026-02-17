from bs4 import BeautifulSoup
import requests
import pandas as pd
import time
# from telegram import Update, ForceReply, InlineKeyboardMarkup, InlineKeyboardButton, ParseMode
# from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext, CallbackQueryHandler

# TELEGRAM_TOKEN = "8572783207:AAHwCYVG3xE1FcrNr2C6pIVs0tDJDQRJbhk"

LAST_LINKEDIN_SCRAPE_TIMESTAMP = 0

def url_encode(text: str) -> str:
    return text.replace(" ", "%20")

def get_jobs(job_role: str = "", location: str = "", timespan: int = 86400, pages: int = 1) -> list:
    job_role = url_encode(job_role)
    location = url_encode(location)
    job_map = []
    for page in range(pages):
        if int(pd.Timestamp.now().timestamp()) - LAST_LINKEDIN_SCRAPE_TIMESTAMP < 2000:
            # avoid being blocked by linkedin for making too many requests in a short period of time
            time.sleep(2)
        url = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={job_role}&location={location}&start={page*25}&f_TPR=r{timespan}"
        LAST_LINKEDIN_SCRAPE_TIMESTAMP = int(pd.Timestamp.now().timestamp())
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        jobs = soup.find_all("div", class_="base-search-card__info")
        for job in jobs:
            title = job.find("h3").text.strip()
            company = job.find("a", class_="hidden-nested-link").text.strip()
            location = job.find("span", class_="job-search-card__location").text.strip()
            posting_id = job.parent['data-entity-urn'].split(":")[-1]
            job_link = f"https://www.linkedin.com/jobs/view/{posting_id}"
            job_map.append([posting_id, title, company, location, job_link])
    return job_map

def convert_to_excel(job_map: list, filename: str="jobs.xlsx", columns: list[str] = ["job_id", "title", "company", "location", "link"]) -> None:
    df = pd.DataFrame(job_map, columns=columns)
    df.to_excel(filename, index=False)