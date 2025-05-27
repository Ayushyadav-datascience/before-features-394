#!/bin/bash

# PostgreSQL connection details
export PORT=5000
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=nodeappuser
export DB_PASSWORD=nodeapppassword
export DB_NAME=nodeapp
export JWT_SECRET=mysecrettoken123

# Start the application
node index.js 