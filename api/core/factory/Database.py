from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
import json
import os

try:
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure
    MONGO_AVAILABLE = True
except ImportError:
    MONGO_AVAILABLE = False

class DatabaseInterface(ABC):
    """
    Abstract base class for Database implementations (Strategy Pattern).
    """
    @abstractmethod
    def save_job(self, job_data: Dict[str, Any], user_id: str) -> bool:
        pass

    @abstractmethod
    def get_job(self, job_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def update_job(self, job_id: str, user_id: str, updates: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    def list_jobs(self, user_id: str, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def save_referral(self, referral_data: Dict[str, Any], user_id: str) -> bool:
        pass

    @abstractmethod
    def list_referrals(self, user_id: str, job_id: Optional[str] = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def delete_job(self, job_id: str, user_id: str) -> bool:
        pass

    @abstractmethod
    def delete_referrals(self, job_id: str, user_id: str) -> bool:
        pass

    @abstractmethod
    def save_user(self, user_data: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        pass

class JsonDatabase(DatabaseInterface):
    """
    Local JSON file implementation of the DatabaseInterface.
    """
    def __init__(self, filename: str = "jobs_tracker.json"):
        self.filename = filename
        if not os.path.exists(self.filename):
            with open(self.filename, 'w') as f:
                json.dump({"jobs": {}, "referrals": {}, "users": {}}, f)

    def _read_db(self) -> Dict[str, Any]:
        with open(self.filename, 'r') as f:
            data = json.load(f)
            if "jobs" not in data:
                data = {"jobs": data, "referrals": {}, "users": {}}
            if "users" not in data:
                data["users"] = {}
            if "referrals" not in data:
                data["referrals"] = {}
            return data

    def save_user(self, user_data: Dict[str, Any]) -> bool:
        db = self._read_db()
        email = user_data.get("email")
        db["users"][email] = user_data
        self._write_db(db)
        return True

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        db = self._read_db()
        return db["users"].get(email)

    def _write_db(self, data: Dict[str, Any]):
        with open(self.filename, 'w') as f:
            json.dump(data, f, indent=4)

    def _get_job_key(self, user_id: str, job_id: str) -> str:
        return f"{user_id}_{job_id}"

    def save_job(self, job_data: Dict[str, Any], user_id: str) -> bool:
        db = self._read_db()
        job_id = job_data.get("job_id")
        if not job_id:
            return False
        key = self._get_job_key(user_id, job_id)
        job_data["user_id"] = user_id
        db["jobs"][key] = job_data
        self._write_db(db)
        return True

    def get_job(self, job_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        db = self._read_db()
        key = self._get_job_key(user_id, job_id)
        return db["jobs"].get(key)

    def update_job(self, job_id: str, user_id: str, updates: Dict[str, Any]) -> bool:
        db = self._read_db()
        key = self._get_job_key(user_id, job_id)
        if key not in db["jobs"]:
            return False
        db["jobs"][key].update(updates)
        self._write_db(db)
        return True

    def list_jobs(self, user_id: str, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        db = self._read_db()
        user_jobs = [job for job in db["jobs"].values() if job.get("user_id") == user_id]
        if filters:
            filtered_jobs = []
            for job in user_jobs:
                if all(job.get(k) == v for k, v in filters.items()):
                    filtered_jobs.append(job)
            return filtered_jobs
        return user_jobs

    def save_referral(self, referral_data: Dict[str, Any], user_id: str) -> bool:
        db = self._read_db()
        ref_id = referral_data.get("id")
        if not ref_id:
            return False
        referral_data["user_id"] = user_id
        db["referrals"][ref_id] = referral_data
        self._write_db(db)
        return True

    def list_referrals(self, user_id: str, job_id: Optional[str] = None) -> List[Dict[str, Any]]:
        db = self._read_db()
        referrals = [r for r in db["referrals"].values() if r.get("user_id") == user_id]
        if job_id:
            return [r for r in referrals if r.get("job_id") == job_id]
        return referrals

    def update_referral(self, referral_id: str, updates: Dict[str, Any]) -> bool:
        db = self._read_db()
        if referral_id not in db["referrals"]:
            return False
        db["referrals"][referral_id].update(updates)
        self._write_db(db)
        return True

    def delete_job(self, job_id: str, user_id: str) -> bool:
        db = self._read_db()
        key = self._get_job_key(user_id, job_id)
        if key not in db["jobs"]:
            return False
        del db["jobs"][key]
        self._write_db(db)
        return True

    def delete_referrals(self, job_id: str, user_id: str) -> bool:
        db = self._read_db()
        referral_ids_to_delete = [rid for rid, r in db["referrals"].items() 
                                if r.get("job_id") == job_id and r.get("user_id") == user_id]
        for rid in referral_ids_to_delete:
            del db["referrals"][rid]
        self._write_db(db)
        return True

class MongoDatabase(DatabaseInterface):
    """
    MongoDB implementation of the DatabaseInterface.
    """
    def __init__(self, connection_string: str, db_name: str = "linkedin_jobs"):
        if not MONGO_AVAILABLE:
            raise ImportError("pymongo is not installed.")
        self.client = MongoClient(connection_string)
        self.db = self.client[db_name]
        self.jobs_coll = self.db["jobs"]
        self.refs_coll = self.db["referrals"]
        self.users_coll = self.db["users"]

    def save_job(self, job_data: Dict[str, Any], user_id: str) -> bool:
        try:
            job_data["user_id"] = user_id
            self.jobs_coll.replace_one({"job_id": job_data["job_id"], "user_id": user_id}, job_data, upsert=True)
            return True
        except Exception as e:
            print(f"MongoDB save job error: {e}")
            return False

    def get_job(self, job_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        return self.jobs_coll.find_one({"job_id": job_id, "user_id": user_id}, {"_id": 0})

    def update_job(self, job_id: str, user_id: str, updates: Dict[str, Any]) -> bool:
        try:
            result = self.jobs_coll.update_one({"job_id": job_id, "user_id": user_id}, {"$set": updates})
            return result.matched_count > 0
        except Exception as e:
            print(f"MongoDB update job error: {e}")
            return False

    def list_jobs(self, user_id: str, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        query = {"user_id": user_id}
        if filters:
            query.update(filters)
        return list(self.jobs_coll.find(query, {"_id": 0}))

    def save_referral(self, referral_data: Dict[str, Any], user_id: str) -> bool:
        try:
            referral_data["user_id"] = user_id
            self.refs_coll.replace_one({"id": referral_data["id"], "user_id": user_id}, referral_data, upsert=True)
            return True
        except Exception as e:
            print(f"MongoDB save referral error: {e}")
            return False

    def list_referrals(self, user_id: str, job_id: Optional[str] = None) -> List[Dict[str, Any]]:
        query = {"user_id": user_id}
        if job_id:
            query["job_id"] = job_id
        return list(self.refs_coll.find(query, {"_id": 0}))

    def update_referral(self, referral_id: str, updates: Dict[str, Any]) -> bool:
        try:
            result = self.refs_coll.update_one({"id": referral_id}, {"$set": updates})
            return result.modified_count > 0
        except Exception as e:
            print(f"MongoDB update referral error: {e}")
            return False

    def delete_job(self, job_id: str, user_id: str) -> bool:
        try:
            self.jobs_coll.delete_one({"job_id": job_id, "user_id": user_id})
            return True
        except Exception as e:
            print(f"MongoDB delete job error: {e}")
            return False

    def delete_referrals(self, job_id: str, user_id: str) -> bool:
        try:
            self.refs_coll.delete_many({"job_id": job_id, "user_id": user_id})
            return True
        except Exception as e:
            print(f"MongoDB delete referrals error: {e}")
            return False

    def save_user(self, user_data: Dict[str, Any]) -> bool:
        try:
            self.users_coll.replace_one({"email": user_data["email"]}, user_data, upsert=True)
            return True
        except Exception as e:
            print(f"MongoDB save user error: {e}")
            return False

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        return self.users_coll.find_one({"email": email}, {"_id": 0})

class DatabaseFactory:
    """
    Factory for creating Database instances.
    """
    @staticmethod
    def get_database(db_type: Optional[str] = None, **kwargs) -> DatabaseInterface:
        # Check environment variables for MongoDB
        mongodb_user = os.getenv("MONGODB_USERNAME")
        mongodb_pass = os.getenv("MONGODB_PASSWORD")
        mongodb_host = os.getenv("MONGODB_HOST")
        mongodb_db = os.getenv("MONGODB_DBNAME", "jobs")

        if (mongodb_user and mongodb_pass and mongodb_host) or db_type == "mongodb":
            conn_str = f"mongodb+srv://{mongodb_user}:{mongodb_pass}@{mongodb_host}/?retryWrites=true&w=majority"
            return MongoDatabase(conn_str, mongodb_db)
            
        return JsonDatabase(kwargs.get("filename", "jobs_tracker.json"))
