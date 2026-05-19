#!/bin/bash

echo "Stopping all microservices..."

# Ports used by the microservices
PORTS=(3000 5001 5002 5003)

for port in "${PORTS[@]}"; do
    # Finds the process ID (PID) using the specified port
    PID=$(lsof -t -i:$port)

    if [ -n "$PID" ]; then
        echo "Stopping process on port $port (PID: $PID)..."
        kill -9 $PID
    else
        echo "No process found on port $port."
    fi
done

echo "Microservices stopped."
	