from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import models
from models import WorkoutSession, WorkoutSet, WorkoutDay, Workout, UserProfile
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
import logging
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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

# Schemas

class WorkoutSetOut(BaseModel):
    id: int
    set_number: int
    reps: Optional[int]
    duration_seconds: Optional[int]
    weight_kg: Optional[float]

    class Config:
        orm_mode = True

class WorkoutOut(BaseModel):
    id: int
    name: str
    workout_type: str
    input_mode: str
    description: Optional[str]
    notes: Optional[str]

    class Config:
        orm_mode = True

class WorkoutWithSets(BaseModel):
    workout: WorkoutOut
    sets: List[WorkoutSetOut]

    class Config:
        orm_mode = True

class WorkoutSessionSchema(BaseModel):
    id: int
    user_id: int
    date: date
    workouts: List[WorkoutWithSets]

    class Config:
        orm_mode = True

class WorkoutDayCreate(BaseModel):
    user_id: int
    date: date

class WorkoutDayOut(BaseModel):
    id: int
    user_id: int
    date: date

    class Config:
        orm_mode = True

class UserProfileCreate(BaseModel):
    name: str
    height_cm: Optional[float]
    weight_kg: Optional[float]
    body_fat_percent: Optional[float]
    sex: Optional[str]
    goal: Optional[str]
    experience: Optional[str]
    constraints: Optional[str]
    equipment: Optional[str]

class UserProfileOut(UserProfileCreate):
    id: int

    class Config:
        orm_mode = True

class WorkoutSessionCreate(BaseModel):
    user_id: int
    date: date
    name:str
    source: Optional[str] = "manual"

# Endpoints

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error at {request.url}:\n{exc.errors()}\nBody: {await request.body()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body}
    )

@app.get("/workout-days/", response_model=List[WorkoutDayOut])
def list_workout_days(user_id: int, db: Session = Depends(get_db)):
    return db.query(WorkoutDay).filter(WorkoutDay.user_id == user_id).all()

@app.post("/workout-days/", response_model=WorkoutDayOut)
def create_workout_day(day: WorkoutDayCreate, db: Session = Depends(get_db)):
    entry = WorkoutDay(**day.dict())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@app.get("/session/full/{user_id}/{session_date}", response_model=List[WorkoutSessionSchema])
def get_full_sessions(user_id: int, session_date: date, db: Session = Depends(get_db)):
    sessions = db.query(WorkoutSession).filter(
        WorkoutSession.user_id == user_id,
        WorkoutSession.date == session_date
    ).all()

    result = []
    for session in sessions:
        workouts_data = []
        for workout_set in session.sets:
            w = workout_set.workout
            entry = next((item for item in workouts_data if item['workout'].id == w.id), None)
            set_data = {
                "id": workout_set.id,
                "set_number": workout_set.set_number,
                "reps": workout_set.reps,
                "duration_seconds": workout_set.duration_seconds,
                "weight_kg": workout_set.weight_kg
            }
            if entry:
                entry["sets"].append(set_data)
            else:
                workouts_data.append({
                    "workout": {
                        "id": w.id,
                        "name": w.name,
                        "workout_type": w.workout_type,
                        "input_mode": w.input_mode,
                        "description": w.description,
                        "notes": w.notes
                    },
                    "sets": [set_data]
                })

        result.append({
    "id": session.id,
    "user_id": session.user_id,
    "date": session.date,
    "name": session.name,  # <- include this
    "workouts": workouts_data
})

    return result

@app.post("/users/", response_model=UserProfileOut)
def create_user(profile: UserProfileCreate, db: Session = Depends(get_db)):
    user = UserProfile(**profile.dict())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.get("/users/{user_id}", response_model=UserProfileOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.get("/session/{user_id}/{date}")
def get_or_create_session(user_id: int, date: date, db: Session = Depends(get_db)):
    session = db.query(WorkoutSession).filter(
        WorkoutSession.user_id == user_id, WorkoutSession.date == date
    ).first()
    return session or {}

@app.post("/session/")
def create_session(data: WorkoutSessionCreate, db: Session = Depends(get_db)):
    session = WorkoutSession(
        user_id=data.user_id,
        date=data.date,
        source=data.source,
        name=data.name
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@app.get("/workouts/", response_model=List[WorkoutOut])
def get_all_workouts(db: Session = Depends(get_db)):
    return db.query(Workout).all()

@app.post("/workouts/", response_model=WorkoutOut)
def create_workout(data: WorkoutOut, db: Session = Depends(get_db)):
    workout = Workout(**data.dict())
    db.add(workout)
    db.commit()
    db.refresh(workout)
    return workout