from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
import jwt
import datetime
import os
from models.db import users

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if users.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password,
        "created_at": datetime.datetime.utcnow()
    })

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users.find_one({"email": email})
    if user and bcrypt.check_password_hash(user['password'], password):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, JWT_SECRET, algorithm="HS256")

        return jsonify({
            "token": token,
            "user": {
                "id": str(user['_id']),
                "name": user['name'],
                "email": user['email']
            }
        }), 200

    return jsonify({"message": "Invalid credentials"}), 401
