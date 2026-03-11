# LinkedIn Job Accelerator 🚀

A full-stack application to automate and track your LinkedIn job search, optimize your resume with AI, and manage your application lifecycle.

## Features

- **Job Search**: Scrape LinkedIn for jobs directly from the dashboard.
- **AI Resume Analysis**: Upload your resume and paste a JD to get tailored suggestions, match ratings, and ATS keywords.
- **Application Tracking**: Track referrals, follow-ups, and status updates for every job.
- **Flexible Database**: Supports JSON for local use and MongoDB for scaling.

## How to Run

### 1. Backend (Flask)
```bash
# Navigate to the root directory
# (Optional) Activate your environment
# .\linkedin\Scripts\Activate.ps1

# Run the Flask server
python -m api.app
```

### 2. Frontend (React + Vite)
```bash
# Navigate to the app directory
cd app

# Install dependencies if not already done
npm install

# Run the dev server
npm run dev
```

The frontend will be available at `http://localhost:5173`.
The backend will run on `http://localhost:5000`.

## Project Structure

- `api/`: Flask backend logic.
  - `core/`: Business logic (Scraper, AI Provider, Database).
  - `controllers/`: API endpoints.
- `app/`: React frontend (Vite).
