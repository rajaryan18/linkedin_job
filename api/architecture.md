## System Architecture - LinkedIn Job Tracker

## Overview
The LinkedIn Job Tracker is a web application designed to help users manage their job search process. It consists of a React frontend and a Python (Flask/FastAPI) backend.

## Backend Architecture
The backend follows a clean architecture pattern, separating concerns into controllers, services, and core logic.

### Core Components
- **JobTracker**: The central coordinator for managing job application lifecycles.
- **Database Factory**: Implements the Strategy pattern to allow switching between different database implementations (JSON or MongoDB).
- **Authentication**: Manages user registration, login, and JWT-based session handling.
- **LinkedIn Scraper/Checker**: Responsible for fetching job data from LinkedIn.

### Data Schema

#### Jobs Collection
Stores information about job opportunities.
- `job_id`: Unique identifier.
- `user_id`: Foreign key referencing the User who added the job.
- `title`, `company`, `location`, `link`, `status`, `source`, `created_at`.

#### Referrals Collection
- `id`, `job_id`, `person`, `date`, `last_followup`.

#### Users Collection
- `id`: Unique identifier.
- `email`: User's login email.
- `password_hash`: Bcrypt hashed password.
- `name`: User's full name.

### Authentication & Authorization
- **JWT (JSON Web Tokens)**: Used for stateless authentication.
- **Middleware**: A decorator on protected routes validates the JWT token in the `Authorization` header.

### Database Integration
- **MongoDB Atlas**: Primary persistent storage.
- **Connection**: Managed via `pymongo` with credentials stored in `.env`.

## Design Patterns
- **Strategy Pattern (Database)**: Enables switching between JSON (local) and MongoDB.
- **Factory Pattern**: Used for creating database and search engine instances.
- **Decorator Pattern (Auth)**: Used for securing API endpoints.
