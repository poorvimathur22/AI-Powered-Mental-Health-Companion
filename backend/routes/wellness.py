from flask import Blueprint, request, jsonify
import os
import datetime
from models.db import assessments, breathing_logs
from routes.mood import token_required

wellness_bp = Blueprint('wellness', __name__)

@wellness_bp.route('/assessment', methods=['POST'])
@token_required
def save_assessment(current_user_id):
    data = request.get_json()
    score = data.get('score')
    # Simple classification logic
    severity = "Low"
    if score > 15: severity = "High"
    elif score > 8: severity = "Moderate"

    assessment = {
        "user_id": current_user_id,
        "score": score,
        "severity": severity,
        "recommendations": "Practice mindfulness and regular breathing exercises.",
        "timestamp": datetime.datetime.utcnow()
    }
    assessments.insert_one(assessment)
    assessment['_id'] = str(assessment['_id'])
    return jsonify(assessment), 201

@wellness_bp.route('/assessment/latest', methods=['GET'])
@token_required
def get_latest_assessment(current_user_id):
    assessment = assessments.find_one({"user_id": current_user_id}, sort=[("timestamp", -1)])
    if not assessment:
        return jsonify({"score": 0}), 200
    
    assessment['_id'] = str(assessment['_id'])
    return jsonify(assessment), 200

@wellness_bp.route('/breathing', methods=['POST'])
@token_required
def log_breathing(current_user_id):
    data = request.get_json()
    log = {
        "user_id": current_user_id,
        "duration": data.get('duration'), # in seconds
        "timestamp": datetime.datetime.utcnow()
    }
    breathing_logs.insert_one(log)
    log['_id'] = str(log['_id'])
    return jsonify(log), 201
