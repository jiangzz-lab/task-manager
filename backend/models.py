from sqlalchemy import Boolean, Column, Integer, String, Text
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String)  # Can be 'measurement', 'simulation', or 'analysis'
    details = Column(Text, nullable=True)
    completed = Column(Boolean, default=False) 