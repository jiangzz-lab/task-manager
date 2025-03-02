#!/bin/sh

# Make sure the script fails on errors
set -e

# Print the Python version and installed packages for debugging
python --version
pip list

# List the files in the current directory for debugging
echo "Files in the current directory:"
ls -la

# Check if task_manager.db is a directory and remove it if it is
if [ -d "task_manager.db" ]; then
  echo "task_manager.db is a directory, removing it..."
  # Force removal by unmounting first if it's a mount point
  umount task_manager.db 2>/dev/null || true
  rm -rf task_manager.db
  echo "Directory removed."
fi

# Run the FastAPI application
exec "$@" 