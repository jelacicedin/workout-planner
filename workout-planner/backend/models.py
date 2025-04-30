from sqlalchemy import Column, Integer, String
from database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer)
    weight = Column(Integer)
    height = Column(Integer)
    sex = Column(String)
    goal = Column(String)
    experience = Column(String)
    constraints = Column(String)
    equipment = Column(String)
