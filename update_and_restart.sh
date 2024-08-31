#!/bin/bash

# Define the ports to check
PORTS=(3000 5173)

# Kill processes running on the specified ports
for PORT in "${PORTS[@]}"; do
  PID=$(lsof -t -i:$PORT)
  if [ ! -z "$PID" ]; then
    echo "Killing process $PID running on port $PORT..."
    kill -9 $PID
  fi
done

# Pull the latest changes from the Git repository
echo "Pulling the latest changes from the Git repository..."
git pull origin main

# Run your services (assuming you use npm for both)
echo "Starting services..."
cd client
nohup npm run dev &
cd ../backend
nohup npm run dev &
cd ..
ollama create phase_1 -f ./modelfiles/Modelfile_phase_1
ollama create phase_2 -f ./modelfiles/Modelfile_phase_2

echo "Update and restart process completed."
