#!/bin/bash

# Color codes for formatting
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Community Connect Setup ===${NC}"
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    echo "PORT=5000" > .env
    echo "MONGODB_URI=mongodb://localhost:27017/community-connect" >> .env
    echo "JWT_SECRET=your_jwt_secret_key_change_in_production" >> .env
    echo -e "${GREEN}Created .env file${NC}"
else
    echo -e "${YELLOW}.env file already exists, skipping...${NC}"
fi

echo -e "${GREEN}Setup complete!${NC}"
echo -e "${YELLOW}To start the application in development mode:${NC}"
echo -e "${BLUE}npm run dev${NC}"
echo -e "${YELLOW}To start the application in production mode:${NC}"
echo -e "${BLUE}npm start${NC}" 