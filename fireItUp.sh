#!/bin/bash

# Start the docker container with database 
(docker compose -f docker-compose.dev.yml up --build) &

# Start the code-editor-server
(cd code-editor-server && npm run dev) &

# Start the code-editor-client
(cd code-editor-client && npm run dev) &