from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.exceptions import RequestValidationError

from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from database import SessionLocal, engine
from models import *
from pydantic import BaseModel
from typing import List, Optional
from fastapi.exception_handlers import request_validation_exception_handler


app = FastAPI()

# CORS for Electron local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# SCHEMAS

class UserProfileCreate(BaseModel):
    name: str
    height_cm: float
    weight_kg: float
    body_fat_percent: float
    photo_path: Optional[str] = None
    sex: str
    goal: str
    experience: str
    constraints: str
    equipment: str

class BodyStatEntryCreate(BaseModel):
    user_id: int
    height_cm: Optional[float]
    weight_kg: Optional[float]
    body_fat_percent: Optional[float]


class WorkoutSessionCreate(BaseModel):
    user_id: int
    date: datetime
    source: str = "manual"


class WorkoutSetCreate(BaseModel):
    session_id: int
    workout_id: int
    set_number: int
    reps: Optional[int]
    duration_seconds: Optional[int]
    weight_kg: Optional[float]


class SuggestionCreate(BaseModel):
    user_id: int
    goal_text: str
    suggestion_text: str
    explanation_text: str


# ROUTES

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(">>> 422 Validation Error:", exc.errors())
    return await request_validation_exception_handler(request, exc)

@app.post("/users/")
async def create_user(profile: UserProfileCreate, request: Request, db: Session = Depends(get_db)):
    
    body = await request.json()
    print(">>> Raw request body:", body)
    print(">>> Parsed Pydantic model:", profile.dict())
    
    db_profile = UserProfile(**profile.dict())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/bodystats/")
def log_body_stat(entry: BodyStatEntryCreate, db: Session = Depends(get_db)):
    stat = BodyStatEntry(
        user_id=entry.user_id,
        timestamp=datetime.utcnow(),
        height_cm=entry.height_cm,
        weight_kg=entry.weight_kg,
        body_fat_percent=entry.body_fat_percent,
    )
    db.add(stat)
    db.commit()
    db.refresh(stat)
    return stat


@app.get("/bodystats/{user_id}")
def get_body_stats(user_id: int, db: Session = Depends(get_db)):
    return (
        db.query(BodyStatEntry)
        .filter(BodyStatEntry.user_id == user_id)
        .order_by(BodyStatEntry.timestamp)
        .all()
    )


@app.post("/workout-session/")
def create_session(session: WorkoutSessionCreate, db: Session = Depends(get_db)):
    ws = WorkoutSession(**session.dict())
    db.add(ws)
    db.commit()
    db.refresh(ws)
    return ws


@app.get("/workout-session/{user_id}")
def get_sessions(user_id: int, db: Session = Depends(get_db)):
    return (
        db.query(WorkoutSession)
        .filter(WorkoutSession.user_id == user_id)
        .order_by(WorkoutSession.date)
        .all()
    )


@app.post("/workout-set/")
def create_set(set_data: WorkoutSetCreate, db: Session = Depends(get_db)):
    wset = WorkoutSet(**set_data.dict())
    db.add(wset)
    db.commit()
    db.refresh(wset)
    return wset


@app.post("/suggestion/")
def save_suggestion(s: SuggestionCreate, db: Session = Depends(get_db)):
    suggestion = WorkoutSuggestion(**s.dict(), generated_at=datetime.utcnow())
    db.add(suggestion)
    db.commit()
    db.refresh(suggestion)
    return suggestion


@app.get("/suggestion/{user_id}")
def get_suggestions(user_id: int, db: Session = Depends(get_db)):
    return (
        db.query(WorkoutSuggestion)
        .filter(WorkoutSuggestion.user_id == user_id)
        .order_by(WorkoutSuggestion.generated_at.desc())
        .all()
    )


@app.get("/ping")
def ping():
    return {"message": "pong"}
