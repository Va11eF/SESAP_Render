#!/bin/bash
set -e

echo "Starting combined Capstone app..."

# 1. Start the .NET backend from the correct subdirectory
echo "Starting backend on port 5084..."
dotnet ./dotnet/CapstoneController.dll --urls=http://0.0.0.0:5084 &

BACKEND_PID=$!

# 2. Start the Express server to serve frontend and proxy APIs
echo "Starting Express server on port $PORT..."
PORT=${PORT:-5000} node server.js

# Wait for backend to exit if Express exits
wait $BACKEND_PID