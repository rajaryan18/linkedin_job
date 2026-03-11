from flask import Blueprint, request, jsonify
from core.LinkedInJobChecker import LinkedInJobChecker
from core.JobTracker import JobTracker

job_bp = Blueprint('job', __name__)
checker = LinkedInJobChecker()
tracker = JobTracker()

@job_bp.route('/search', methods=['GET'])
def search_jobs():
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
def track_job():
    data = request.json
    success = tracker.add_job(
        job_id=data['job_id'],
        title=data['title'],
        company=data['company'],
        location=data['location'],
        link=data['link']
    )
    return jsonify({"success": success})

@job_bp.route('/tracked', methods=['GET'])
def get_tracked_jobs():
    jobs = tracker.list_tracked_jobs()
    return jsonify(jobs)

@job_bp.route('/tracked/<job_id>', methods=['PATCH'])
def update_tracked_job(job_id):
    data = request.json
    if 'status' in data:
        tracker.update_status(job_id, data['status'])
    if 'note' in data:
        tracker.add_followup(job_id, data['note'])
    
    return jsonify({"success": True})

@job_bp.route('/tracked/<job_id>/referral', methods=['POST'])
def add_referral(job_id):
    data = request.json
    success = tracker.add_referral(job_id, data['person'], data.get('date'))
    return jsonify({"success": success})

@job_bp.route('/tracked/<job_id>/referral/<referral_id>/followup', methods=['POST'])
def follow_up_referral(job_id, referral_id):
    success = tracker.follow_up_referral(job_id, referral_id)
    return jsonify({"success": success})

@job_bp.route('/custom', methods=['POST'])
def add_custom_job():
    data = request.json
    success = tracker.add_custom_job(
        title=data['title'],
        company=data['company'],
        location=data['location'],
        url=data.get('url', '')
    )
    return jsonify({"success": success})
