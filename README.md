# Community Connect

A community events platform where users can create, discover, and join local events.

## Features

- User authentication (register, login, logout)
- Create and manage events/posts
- Search events by keywords
- Filter events by categories
- RSVP to events
- Comment on events
- Responsive design

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT tokens

## Setup

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/community-connect.git
   cd community-connect
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup PostgreSQL**

   Make sure PostgreSQL is installed and running on your system.

   ```bash
   # Create database and user
   sudo -u postgres psql -c "CREATE DATABASE nodeapp;"
   sudo -u postgres psql -c "CREATE USER nodeappuser WITH ENCRYPTED PASSWORD 'nodeapppassword';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE nodeapp TO nodeappuser;"
   sudo -u postgres psql -d nodeapp -c "GRANT ALL ON SCHEMA public TO nodeappuser;"
   ```

4. **Create .env file**

   Create a `.env` file in the root directory with the following content:

   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=nodeappuser
   DB_PASSWORD=nodeapppassword
   DB_NAME=nodeapp
   JWT_SECRET=your_secret_key
   ```

5. **Seed the database**

   ```bash
   node seed-data.js
   ```

6. **Start the application**

   ```bash
   npm start
   # Or use the start script
   ./start.sh
   ```

7. **Access the application**

   Open your browser and navigate to `http://localhost:5000`

### GitHub Codespaces Setup

When working with GitHub Codespaces, you'll need to set up the database differently:

1. **Create a dev container configuration**

   Create `.devcontainer/devcontainer.json` with the following content:

   ```json
   {
     "name": "Node.js & PostgreSQL",
     "dockerComposeFile": "docker-compose.yml",
     "service": "app",
     "workspaceFolder": "/workspace",
     "forwardPorts": [5000, 5432],
     "postCreateCommand": "npm install",
     "customizations": {
       "vscode": {
         "extensions": [
           "dbaeumer.vscode-eslint",
           "esbenp.prettier-vscode",
           "ms-azuretools.vscode-docker"
         ]
       }
     }
   }
   ```

2. **Create a Docker Compose file**

   Create `.devcontainer/docker-compose.yml` with the following content:

   ```yaml
   version: '3'
   services:
     app:
       build: 
         context: ..
         dockerfile: .devcontainer/Dockerfile
       volumes:
         - ..:/workspace:cached
       command: sleep infinity
       environment:
         - PORT=5000
         - DB_HOST=db
         - DB_PORT=5432
         - DB_USER=postgres
         - DB_PASSWORD=postgres
         - DB_NAME=nodeapp
       depends_on:
         - db
     
     db:
       image: postgres:latest
       restart: unless-stopped
       volumes:
         - postgres-data:/var/lib/postgresql/data
       environment:
         - POSTGRES_PASSWORD=postgres
         - POSTGRES_USER=postgres
         - POSTGRES_DB=nodeapp
   
   volumes:
     postgres-data:
   ```

3. **Create a Dockerfile**

   Create `.devcontainer/Dockerfile` with the following content:

   ```dockerfile
   FROM mcr.microsoft.com/devcontainers/javascript-node:18

   # Install additional tools
   RUN apt-get update && apt-get install -y postgresql-client

   WORKDIR /workspace
   ```

4. **Initialize the database in Codespaces**

   After the Codespace starts, run:

   ```bash
   # Seed the database
   node seed-data.js

   # Start the app
   npm start
   ```

### Alternative: Using External Database Service

For a more production-like setup, you can use an external database service:

1. **Create a PostgreSQL database**
   - Use a service like ElephantSQL, Heroku Postgres, or Railway
   - Get the connection URI

2. **Update your .env file**
   ```
   PORT=5000
   DATABASE_URL=postgres://username:password@host:port/database
   JWT_SECRET=your_secret_key
   ```

3. **Update the db.js file**
   
   ```javascript
   // Use DATABASE_URL if available
   const sequelize = process.env.DATABASE_URL 
     ? new Sequelize(process.env.DATABASE_URL, { 
         dialect: 'postgres',
         dialectOptions: {
           ssl: {
             require: true,
             rejectUnauthorized: false
           }
         }
       })
     : new Sequelize({
         dialect: 'postgres',
         host: process.env.DB_HOST || 'localhost',
         port: process.env.DB_PORT || 5432,
         username: process.env.DB_USER || 'postgres',
         password: process.env.DB_PASSWORD || 'postgres',
         database: process.env.DB_NAME || 'nodeapp',
         logging: false,
       });
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Posts (Events)
- `GET /api/posts` - Get all posts (with optional search and category filters)
- `GET /api/posts/:id` - Get a single post
- `POST /api/posts` - Create a new post (requires authentication)
- `PUT /api/posts/:id` - Update a post (requires authentication)
- `DELETE /api/posts/:id` - Delete a post (requires authentication)
- `POST /api/posts/:id/rsvp` - RSVP to an event (requires authentication)

### Comments
- `GET /api/comments/:postId` - Get all comments for a post
- `POST /api/comments/:postId` - Create a comment on a post (requires authentication)
- `DELETE /api/comments/:id` - Delete a comment (requires authentication)

## License

MIT
