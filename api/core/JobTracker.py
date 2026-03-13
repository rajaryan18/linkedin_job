from typing import Dict, Any, Optional, List
import uuid
from datetime import datetime
from .factory.Database import DatabaseInterface, DatabaseFactory

class JobTracker:
    """
    Manages the lifecycle of job applications.
    """
    def __init__(self, db: Optional[DatabaseInterface] = None):
        self.db = db if db else DatabaseFactory.get_database()

    def add_job(self, job_id: str, title: str, company: str, location: str, link: str, status: str = "Saved", source: str = "linkedin"):
        """Adds a new job to track."""
        job_data = {
            "job_id": job_id,
            "title": title,
            "company": company,
            "location": location,
            "link": link,
            "status": status,
            "source": source,
            "last_followup": None,
            "notes": [],
            "created_at": datetime.now().isoformat()
        }
        return self.db.save_job(job_data)

    def update_status(self, job_id: str, status: str):
        """Updates the status of a job (e.g., 'Applied', 'Interviewing')."""
        updates = {"status": status}
        return self.db.update_job(job_id, updates)

    def add_referral(self, job_id: str, person: str, date: Optional[str] = None):
        """Adds a new referral to a separate collection."""
        job = self.db.get_job(job_id)
        if not job:
            return False
        
        referral_date = date if date else datetime.now().strftime("%Y-%m-%d")
        ref_id = f"ref_{uuid.uuid4().hex[:8]}"
        
        new_referral = {
            "id": ref_id,
            "job_id": job_id,
            "person": person,
            "date": referral_date,
            "last_followup": referral_date
        }
        
        success = self.db.save_referral(new_referral)
        if success:
            self.db.update_job(job_id, {"status": "Referral Requested"})
        return success

    def follow_up_referral(self, job_id: str, referral_id: str):
        """Updates the follow-up date for a specific referral."""
        updates = {"last_followup": datetime.now().strftime("%Y-%m-%d")}
        return self.db.update_referral(referral_id, updates)

    def add_custom_job(self, title: str, company: str, location: str, url: str = ""):
        """Adds a manually entered job with an optional URL."""
        job_id = f"custom_{uuid.uuid4().hex[:8]}"
        return self.add_job(
            job_id=job_id,
            title=title,
            company=company,
            location=location,
            link=url,
            status="Applied",
            source="manual"
        )

    def add_followup(self, job_id: str, note: str):
        """Adds a follow-up note and updates the last follow-up timestamp."""
        job = self.db.get_job(job_id)
        if not job:
            return False
        
        notes = job.get("notes", [])
        notes.append({
            "date": datetime.now().isoformat(),
            "note": note
        })
        
        updates = {
            "last_followup": datetime.now().isoformat(),
            "notes": notes
        }
        return self.db.update_job(job_id, updates)

    def get_job_details(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves details of a specific job including its referrals."""
        job = self.db.get_job(job_id)
        if job:
            job["referrals"] = self.db.list_referrals(job_id)
        return job

    def list_tracked_jobs(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """Lists all tracked jobs, optionally filtered by status, and includes referrals."""
        filters = {"status": status} if status else None
        jobs = self.db.list_jobs(filters=filters)
        for job in jobs:
            job["referrals"] = self.db.list_referrals(job.get("job_id") or job.get("id"))
        return jobs

    def delete_job(self, job_id: str) -> bool:
        """Removes a job and its associated referrals."""
        self.db.delete_referrals(job_id)
        return self.db.delete_job(job_id)
