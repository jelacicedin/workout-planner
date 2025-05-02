from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Date,
    Boolean,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    height_cm = Column(Float)
    weight_kg = Column(Float)
    body_fat_percent = Column(Float)
    photo_path = Column(String, nullable=True)
    sex = Column(String)
    goal = Column(String)
    experience = Column(String)
    constraints = Column(String)
    equipment = Column(String)

    body_stats = relationship("BodyStatEntry", back_populates="user")
    sessions = relationship("WorkoutSession", back_populates="user")
    suggestions = relationship("WorkoutSuggestion", back_populates="user")


class BodyStatEntry(Base):
    __tablename__ = "body_stat_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    body_fat_percent = Column(Float, nullable=True)

    user = relationship("UserProfile", back_populates="body_stats")


class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    is_bodyweight = Column(Boolean, default=False)

    sets = relationship("WorkoutSet", back_populates="workout")


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)
    date = Column(Date, nullable=False)
    source = Column(String, default="manual")
    workout_day_id = Column(Integer, ForeignKey("workout_days.id"))

    user = relationship("UserProfile", back_populates="sessions")
    sets = relationship("WorkoutSet", back_populates="session")
    day = relationship("WorkoutDay", back_populates="session", uselist=False)


class WorkoutSet(Base):
    __tablename__ = "workout_sets"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("workout_sessions.id"), nullable=False)
    workout_id = Column(Integer, ForeignKey("workouts.id"), nullable=False)
    set_number = Column(Integer)
    reps = Column(Integer, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    weight_kg = Column(Float, nullable=True)

    session = relationship("WorkoutSession", back_populates="sets")
    workout = relationship("Workout", back_populates="sets")


class WorkoutSuggestion(Base):
    __tablename__ = "workout_suggestions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)
    goal_text = Column(String, nullable=False)
    suggestion_text = Column(Text)
    explanation_text = Column(Text)

    user = relationship("UserProfile", back_populates="suggestions")

class WorkoutDay(Base):
    __tablename__ = "workout_days"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)

    session = relationship("WorkoutSession", back_populates="day", uselist=False)
