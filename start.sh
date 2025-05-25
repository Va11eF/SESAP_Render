#!/bin/bash
set -e

echo "Starting combined Capstone app..."

# 1. Build and start the .NET backend in the background
echo "Building backend..."
dotnet build

echo "Starting backend on port 5084..."
dotnet run --no-launch-profile --urls=http://0.0.0.0:5084 &

BACKEND_PID=$!

# 2. Install Node.js dependencies
echo "Installing frontend dependencies..."
npm install

# 3. Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# 4. Start the Express server to serve frontend and proxy APIs
echo "Starting Express server on port $PORT..."
PORT=${PORT:-5000} node server.js

# Wait for backend to exit if Express exits
wait $BACKEND_PID
