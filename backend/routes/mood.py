from flask import Blueprint, request, jsonify
import jwt
import os
import datetime
from models.db import mood_logs
from services.ai_service import ai_service
from functools import wraps

mood_bp = Blueprint('mood', __name__)
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretkey")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token.split(" ")[1], JWT_SECRET, algorithms=["HS256"])
            current_user_id = data['user_id']
        except Exception as e:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user_id, *args, **kwargs)
    return decorated

@mood_bp.route('/log', methods=['POST'])
@token_required
def log_mood(current_user_id):
    data = request.get_json()
    text = data.get('text')
    emoji = data.get('emoji')

    analysis = ai_service.analyze_mood(text)

    log_entry = {
        "user_id": current_user_id,
        "text": text,
        "emoji": emoji,
        "sentiment": analysis['sentiment'],
        "sentiment_score": analysis['sentiment_score'],
        "emotion": analysis['emotion'],
        "emotion_score": analysis['emotion_score'],
        "timestamp": datetime.datetime.utcnow()
    }

    mood_logs.insert_one(log_entry)
    log_entry['_id'] = str(log_entry['_id'])

    return jsonify({"message": "Mood logged successfully", "data": log_entry}), 201

@mood_bp.route('/history', methods=['GET'])
@token_required
def get_history(current_user_id):
    logs = list(mood_logs.find({"user_id": current_user_id}).sort("timestamp", -1))
    for log in logs:
        log['_id'] = str(log['_id'])
    return jsonify(logs), 200
