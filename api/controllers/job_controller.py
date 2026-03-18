from flask import Blueprint, request, jsonify
from core.LinkedInJobChecker import LinkedInJobChecker
from core.JobTracker import JobTracker
from core.Auth import Auth

job_bp = Blueprint('job', __name__)
checker = LinkedInJobChecker()
tracker = JobTracker()

@job_bp.route('/search', methods=['GET'])
@Auth.token_required
def search_jobs(user_id):
    role = request.args.get('role', 'Software Engineer')
    location = request.args.get('location', 'Remote')
    pages = int(request.args.get('pages', 1))
    
    jobs = checker.get_jobs(job_role=role, location=location, pages=pages)
    # job_map returns: [posting_id, title, company, job_location, job_link]
    formatted_jobs = []
    for j in jobs:
        formatted_jobs.append({
            "job_id": j[0],
            "title": j[1],
            "company": j[2],
            "location": j[3],
            "link": j[4]
        })
    return jsonify(formatted_jobs)

@job_bp.route('/track', methods=['POST'])
@Auth.token_required
def track_job(user_id):
    data = request.json
    success = tracker.add_job(
        user_id=user_id,
        job_id=data['job_id'],
        title=data['title'],
        company=data['company'],
        location=data['location'],
        link=data['link']
    )
    return jsonify({"success": success})

@job_bp.route('/tracked', methods=['GET'])
@Auth.token_required
def get_tracked_jobs(user_id):
    jobs = tracker.list_tracked_jobs(user_id)
    return jsonify(jobs)

@job_bp.route('/tracked/<job_id>', methods=['PATCH', 'DELETE'])
@Auth.token_required
def handle_tracked_job(user_id, job_id):
    if request.method == 'DELETE':
        success = tracker.delete_job(user_id, job_id)
        return jsonify({"success": success})
    
    data = request.json
    if 'status' in data:
        tracker.update_status(user_id, job_id, data['status'])
    if 'note' in data:
        tracker.add_followup(user_id, job_id, data['note'])
    
    return jsonify({"success": True})

@job_bp.route('/tracked/<job_id>/referral', methods=['POST'])
@Auth.token_required
def add_referral(user_id, job_id):
    data = request.json
    success = tracker.add_referral(user_id, job_id, data['person'], data.get('date'))
    return jsonify({"success": success})

@job_bp.route('/tracked/<job_id>/referral/<referral_id>/followup', methods=['POST'])
@Auth.token_required
def follow_up_referral(user_id, job_id, referral_id):
    success = tracker.follow_up_referral(user_id, job_id, referral_id)
    return jsonify({"success": success})

@job_bp.route('/custom', methods=['POST'])
@Auth.token_required
def add_custom_job(user_id):
    data = request.json
    success = tracker.add_custom_job(
        user_id=user_id,
        title=data['title'],
        company=data['company'],
        location=data['location'],
        url=data.get('url', '')
    )
    return jsonify({"success": success})
