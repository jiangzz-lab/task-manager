# Task Manager

A simple, clean task management application for personal use. This application provides a minimalist interface for managing tasks related to projects, with a focus on optimizing concentration without unnecessary visual elements.

## Features

- Add, edit, delete, and complete tasks
- Each task has a name, category (measurement, simulation, analysis, software, hardware), and optional details
- Option to display or hide task details (default is hidden)
- Clean, simple interface with easy-to-recognize icons and fonts
- Responsive design that adapts to different screen sizes

## Tech Stack

- **Frontend**: React with Vite, JavaScript, Material UI
- **Backend**: Python with FastAPI
- **Database**: SQLite
- **Deployment**: Docker for local deployment

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
- [Node.js](https://nodejs.org/) (for development)
- [Python](https://www.python.org/) (for development)

### Running with Docker

#### Option 1: Using Docker Compose CLI

1. Clone this repository
2. Navigate to the project directory
3. Run the application using Docker Compose:

```bash
docker-compose up
```

4. Access the application at http://localhost:5173

#### Option 2: Using Docker Desktop

1. Clone this repository
2. Open Docker Desktop
3. Navigate to the "Containers" tab
4. Click on "Add Container" or the equivalent option
5. Select "Use Docker Compose"
6. Browse to the location of your project directory containing the docker-compose.yml file
7. Click "Start" to run the containers
8. Access the application at http://localhost:5173

### Development Setup

#### Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
python -m venv taskmanagerenv
# On Windows
.\taskmanagerenv\Scripts\activate
# On macOS/Linux
source taskmanagerenv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the backend server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

## API Documentation

Once the backend is running, you can access the API documentation at http://localhost:8000/docs

## Technical Documentation

### System Architecture

The Task Manager application follows a client-server architecture with the following components:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │◄────►│  FastAPI Backend│◄────►│  SQLite Database│
│  (Port 5173)    │      │  (Port 8000)    │      │                 │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Frontend Architecture

The frontend is built with React and uses the following key components:

- **App.jsx**: Main application component that manages the overall layout and state
- **TaskList.jsx**: Displays the list of tasks and handles task interactions
- **TaskForm.jsx**: Provides the form for adding new tasks
- **TaskEditDialog.jsx**: Modal dialog for editing existing tasks

The frontend communicates with the backend through RESTful API calls using the Fetch API.

### Backend Architecture

The backend is built with FastAPI and follows a layered architecture:

- **main.py**: Entry point that defines API routes and handlers
- **models.py**: Defines the database models using SQLAlchemy ORM
- **schemas.py**: Defines Pydantic schemas for request/response validation
- **database.py**: Handles database connection and session management

### Database Schema

The application uses a simple SQLite database with a single `tasks` table:

```
┌─────────────────────────────────────┐
│ tasks                               │
├─────────────────────────────────────┤
│ id: Integer (Primary Key)           │
│ name: String                        │
│ category: String                    │
│ details: String                     │
│ completed: Boolean                  │
└─────────────────────────────────────┘
```

### Docker Configuration

The application is containerized using Docker with two services:

1. **Frontend Container**: Serves the React application on port 5173
2. **Backend Container**: Runs the FastAPI server on port 8000

The containers are configured to communicate with each other through the Docker network, and volumes are used to persist the SQLite database.

### Technology Choices

- **React**: Chosen for its component-based architecture and efficient rendering through the virtual DOM
- **Material UI**: Provides a consistent and responsive UI with minimal configuration
- **FastAPI**: Selected for its high performance, automatic API documentation, and type checking
- **SQLite**: Used for its simplicity and zero-configuration setup, suitable for a personal task manager
- **Docker**: Ensures consistent deployment across different environments and simplifies setup

## License

This project is for personal use only. 