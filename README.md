# Personal Workout Planner

A cross-platform desktop application for generating personalized weekly workout plans based on user input. Built with an Electron (TypeScript) frontend and a FastAPI backend, using SQLite for persistent data storage.

## Features

- Custom workout plans based on goals, equipment, injuries, and experience level
- Electron-based GUI with real-time communication to backend via HTTPS
- FastAPI backend with SQLite database for storage
- Optional ML logic to adapt plans dynamically
- Fully Dockerized and CI/CD ready

## Tech Stack

- Electron + TypeScript (frontend)
- FastAPI + Python 3.11 (backend)
- SQLite (database)
- Docker (containerization)
- GitHub Actions (CI/CD)

## Project Structure
```text
personal-workout-planner/ 
  ├── backend/ 
  │ ├── main.py 
  │ ├── models.py 
  │ ├── database.py 
  │ └── requirements.txt 
  ├── workout-planner/ (Electron frontend) 
  │ └── [Electron Forge scaffolded files] 
  ├── .github/workflows/ 
  │ └── ci.yml 
  ├── Dockerfile 
  └── README.md
```
## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000 --ssl-keyfile=key.pem --ssl-certfile=cert.pem
```

### Frontend

cd workout-planner
npm install
npm start

## Build Full App

TODO: Add packaging script to bundle backend and frontend
