from flask import Blueprint, request, jsonify
import os
import datetime
from models.db import habits, tasks
from routes.mood import token_required

habits_bp = Blueprint('habits', __name__)

@habits_bp.route('/habits', methods=['POST'])
@token_required
def create_habit(current_user_id):
    data = request.get_json()
    habit = {
        "user_id": current_user_id,
        "name": data.get('name'),
        "streak": 0,
        "last_logged": None,
        "created_at": datetime.datetime.utcnow()
    }
    habits.insert_one(habit)
    habit['_id'] = str(habit['_id'])
    return jsonify(habit), 201

@habits_bp.route('/habits', methods=['GET'])
@token_required
def get_habits(current_user_id):
    user_habits = list(habits.find({"user_id": current_user_id}))
    for h in user_habits:
        h['_id'] = str(h['_id'])
    return jsonify(user_habits), 200

@habits_bp.route('/tasks', methods=['POST'])
@token_required
def create_task(current_user_id):
    data = request.get_json()
    task = {
        "user_id": current_user_id,
        "text": data.get('text'),
        "completed": False,
        "created_at": datetime.datetime.utcnow()
    }
    tasks.insert_one(task)
    task['_id'] = str(task['_id'])
    return jsonify(task), 201

@habits_bp.route('/tasks', methods=['GET'])
@token_required
def get_tasks(current_user_id):
    user_tasks = list(tasks.find({"user_id": current_user_id}))
    for t in user_tasks:
        t['_id'] = str(t['_id'])
    return jsonify(user_tasks), 200

@habits_bp.route('/tasks/<id>', methods=['PATCH'])
@token_required
def update_task(current_user_id, id):
    data = request.get_json()
    from bson.objectid import ObjectId
    tasks.update_one({"_id": ObjectId(id), "user_id": current_user_id}, {"$set": {"completed": data.get('completed')}})
    return jsonify({"message": "Task updated"}), 200
