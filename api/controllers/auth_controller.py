from flask import Blueprint, request, jsonify
from core.Auth import Auth

auth_bp = Blueprint('auth', __name__)
auth_service = Auth()

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    result = auth_service.signup(data['email'], data['password'], data['name'])
    return jsonify(result)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    result = auth_service.login(data['email'], data['password'])
    if result:
        return jsonify(result)
    return jsonify({"error": "Invalid credentials"}), 401
