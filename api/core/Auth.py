import jwt
import bcrypt
import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from .factory.Database import DatabaseFactory

class Auth:
    def __init__(self):
        self.db = DatabaseFactory.get_database()
        self.secret_key = os.getenv("JWT_SECRET", "secret")

    def hash_password(self, password: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password: str, hashed: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

    def generate_token(self, user_id: str) -> str:
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        return jwt.encode(payload, self.secret_key, algorithm='HS256')

    def decode_token(self, token: str) -> Optional[Dict[str, Any]]:
        try:
            return jwt.decode(token, self.secret_key, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    def signup(self, email: str, password: str, name: str) -> Dict[str, Any]:
        # Implementation depends on database interface supporting users
        # For now, we'll use a generic approach or extend the interface
        password_hash = self.hash_password(password)
        user_data = {
            "email": email,
            "password_hash": password_hash,
            "name": name,
            "created_at": datetime.utcnow().isoformat()
        }
        # We need a save_user method in the interface
        # For simplicity in this iteration, we'll use a generic collection/file
        # but ideally the interface should have save_user
        if hasattr(self.db, "save_user"):
             return {"success": self.db.save_user(user_data)}
        
        # Fallback to a generic storage if interface isn't updated yet
        # (This is just for demonstration, in a real app we'd update the interface)
        return {"success": False, "message": "Database interface not ready for users"}

    def login(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        # Again, depends on get_user_by_email
        if hasattr(self.db, "get_user_by_email"):
            user = self.db.get_user_by_email(email)
            if user and self.check_password(password, user['password_hash']):
                token = self.generate_token(str(user.get('_id', user.get('email'))))
                return {"token": token, "user": {"name": user['name'], "email": user['email']}}
        return None
