from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas
from database import engine, SessionLocal

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Manager API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API endpoints
@app.get("/")
def read_root():
    return {"message": "Welcome to Task Manager API"}

@app.get("/tasks", response_model=List[schemas.Task])
def get_tasks(db: Session = Depends(get_db)):
    # Get tasks ordered by priority
    tasks = db.query(models.Task).order_by(models.Task.priority).all()
    return tasks

@app.post("/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    # Get the highest priority value
    highest_priority = db.query(models.Task).order_by(models.Task.priority.desc()).first()
    
    # Set the new task's priority to be the highest + 1 (or 0 if no tasks exist)
    new_priority = (highest_priority.priority + 1) if highest_priority else 0
    
    # Create task with the calculated priority
    task_data = task.model_dump()
    task_data["priority"] = new_priority
    
    db_task = models.Task(**task_data)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks/{task_id}", response_model=schemas.Task)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.put("/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}

# New endpoint for updating task priorities
@app.post("/tasks/reorder")
def reorder_tasks(task_ids: List[int], db: Session = Depends(get_db)):
    # Validate that all task IDs exist
    for i, task_id in enumerate(task_ids):
        task = db.query(models.Task).filter(models.Task.id == task_id).first()
        if task is None:
            raise HTTPException(status_code=404, detail=f"Task with ID {task_id} not found")
        
        # Update the priority based on the order in the list
        task.priority = i
        db.add(task)
    
    db.commit()
    return {"message": "Tasks reordered successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 