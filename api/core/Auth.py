import jwt
import bcrypt
import os
from functools import wraps
from flask import request, jsonify
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from .factory.Database import DatabaseFactory

class Auth:
    def __init__(self):
        self.db = DatabaseFactory.get_database()
        self.secret_key = os.getenv("JWT_SECRET", "secret")

    @staticmethod
    def token_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                if auth_header.startswith('Bearer '):
                    token = auth_header.split(" ")[1]
            
            if not token:
                return jsonify({'message': 'Token is missing!'}), 401
            
            try:
                # We need an instance to get the secret_key, or just use getenv here
                secret = os.getenv("JWT_SECRET", "secret")
                data = jwt.decode(token, secret, algorithms=['HS256'])
                current_user_id = data['user_id']
            except Exception as e:
                return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401
            
            return f(current_user_id, *args, **kwargs)
        
        return decorated

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
        password_hash = self.hash_password(password)
        user_data = {
            "email": email,
            "password_hash": password_hash,
            "name": name,
            "created_at": datetime.utcnow().isoformat()
        }
        if hasattr(self.db, "save_user"):
             return {"success": self.db.save_user(user_data)}
        
        return {"success": False, "message": "Database interface not ready for users"}

    def login(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        if hasattr(self.db, "get_user_by_email"):
            user = self.db.get_user_by_email(email)
            if user and self.check_password(password, user['password_hash']):
                token = self.generate_token(str(user.get('_id', user.get('email'))))
                return {"token": token, "user": {"name": user['name'], "email": user['email']}}
        return None
