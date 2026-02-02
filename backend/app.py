from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from routes.auth import auth_bp
from routes.mood import mood_bp
from routes.chat import chat_bp
from routes.habits import habits_bp
from routes.wellness import wellness_bp
from routes.profile import profile_bp
from routes.emergency import emergency_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(mood_bp, url_prefix='/api/mood')
app.register_blueprint(chat_bp, url_prefix='/api/chat')
app.register_blueprint(habits_bp, url_prefix='/api/habits')
app.register_blueprint(wellness_bp, url_prefix='/api/wellness')
app.register_blueprint(profile_bp, url_prefix='/api/profile')
app.register_blueprint(emergency_bp, url_prefix='/api/emergency')

@app.route('/')
def home():
    return jsonify({"message": "Mental Health Companion API is running!"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
