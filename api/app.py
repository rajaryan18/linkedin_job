import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from controllers.job_controller import job_bp
from controllers.ai_controller import ai_bp
from controllers.auth_controller import auth_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register Blueprints
    app.register_blueprint(job_bp, url_prefix='/api/jobs')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    @app.route('/api/health')
    def health_check():
        return {"status": "healthy"}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
