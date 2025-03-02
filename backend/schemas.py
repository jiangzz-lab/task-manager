from pydantic import BaseModel, Field
from typing import Optional, Literal

# Base Task schema with common attributes
class TaskBase(BaseModel):
    name: str
    category: Literal["measurement", "simulation", "analysis", "software", "hardware"] = Field(
        description="Category of the task (measurement, simulation, analysis, software, or hardware)"
    )
    details: Optional[str] = None

# Schema for creating a new task
class TaskCreate(TaskBase):
    pass

# Schema for updating an existing task
class TaskUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[Literal["measurement", "simulation", "analysis", "software", "hardware"]] = None
    details: Optional[str] = None
    completed: Optional[bool] = None

# Schema for task responses (includes id and completed status)
class Task(TaskBase):
    id: int
    completed: bool = False

    class Config:
        orm_mode = True
        from_attributes = True 