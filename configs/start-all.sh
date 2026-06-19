#!/bin/bash

echo "Starting all microservices..."

# Goes into each microservice directory and starts it
(cd ../backend/gateway && npm run dev) &
(cd ../backend/ms-user && npm run dev) &
(cd ../backend/ms-client && npm run dev) &
(cd ../backend/ms-item && npm run dev) &

echo "Microservices started."
