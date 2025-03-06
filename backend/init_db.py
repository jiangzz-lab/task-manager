from sqlalchemy import create_engine, inspect, text
from database import SQLALCHEMY_DATABASE_URL, Base
import models

# Create engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)
inspector = inspect(engine)

# Check if tables exist
if not inspector.has_table('tasks'):
    print("Database tables don't exist. Creating them...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")
else:
    print("Database tables already exist. Skipping initialization.")
    
    # Check if priority column exists in tasks table
    columns = inspector.get_columns('tasks')
    column_names = [column['name'] for column in columns]
    
    # If priority column doesn't exist, add it
    if 'priority' not in column_names:
        print("Adding priority column to tasks table...")
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE tasks ADD COLUMN priority INTEGER DEFAULT 0"))
            conn.commit()
        print("Priority column added successfully!")
