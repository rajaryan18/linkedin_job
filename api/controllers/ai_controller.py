from flask import Blueprint, request, jsonify
from core.AIProvider import AIProvider
from core.ResumeParser import ResumeParser
import os
import tempfile

ai_bp = Blueprint('ai', __name__)
ai_provider = AIProvider()
parser = ResumeParser()

@ai_bp.route('/analyze', methods=['POST'])
def analyze_resume():
    # Handle both file upload and text input
    resume_text = ""
    if 'resume_file' in request.files:
        file = request.files['resume_file']
        if file.filename != '':
            # Save to temp file to parse
            temp_dir = tempfile.gettempdir()
            temp_path = os.path.join(temp_dir, file.filename)
            file.save(temp_path)
            try:
                resume_text = parser.extract_text(temp_path)
            finally:
                if os.path.exists(temp_path):
                    os.remove(temp_path)
    else:
        resume_text = request.form.get('resume_text', '')

    jd_text = request.form.get('jd_text', '')
    
    if not resume_text or not jd_text:
        return jsonify({"error": "Missing resume or JD text"}), 400
    
    analysis = ai_provider.analyze_resume(resume_text, jd_text)
    return jsonify(analysis)
