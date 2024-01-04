
# Express JWT Authentication and Notes API

This is a simple Express.js API with JSON Web Token (JWT) authentication for managing user notes. It provides endpoints for CRUD operations on notes, sharing notes, and searching for users.

## Setup
### Clone the repository:
#### git clone <repository-url>
## Install dependencies:
#### npm install
## Set up environment variables:
#### Create a .env file:
#### example
PORT=4000
JWT_SECRET=yourSecretKey

## Set up database connection:
Configure the sequelize.ts file with your database credentials.
#### Install Docker (if using PostgreSQL):
Follow Docker installation instructions for your system.
#### Run PostgreSQL in a container (if applicable):
docker pull postgres
docker run --name postgres -e POSTGRES_USER=myuser -e POSTGRES_HOST=localhost -e POSTGRES_DB=mydb -e POSTGRES_PASSWORD=mypassword -p 5432:5432 --network postgres-network -d postgres
#### Run migrations:
sequelize init:migrations
#### Run the application:
npx ts-node src/index.ts

## API Endpoints
### 1. User Authentication
#### 1.1 Login
### Endpoint: 
POST /api/auth/login

### Description: 
Logs in a user and returns a JWT.

### Request Body:

JSON
{
  "email": "user@example.com",
  "password": "password123"
}

### Response:

JSON
{
  "token": "yourAccessToken"
}

### 2. User Notes
#### 2.1 Get All Notes
Endpoint: GET /api/notes
Description: Retrieves all notes for the authenticated user.
Authentication: Requires a valid JWT in the Authorization header.
#### 2.2 Get a Specific Note
### Endpoint: 
GET /api/notes/:id
### Description: 
Retrieves a specific note by its ID.
### Authentication: 
Requires a valid JWT.
### Parameters:
id: Note ID
#### 2.3 Create a New Note
### Endpoint:
POST /api/notes

### Description: 
Creates a new note.

### Authentication: 
Requires a valid JWT.

### Request Body:

JSON
{
  "title": "New Note",
  "content": "This is the content of the note."
}

### Response:

JSON
{
  "id": 1,
  "title": "New Note",
  "content": "This is the content of the note.",
  "userId": "authenticatedUserId"
}

## 2.4 Update a Note
### Endpoint:
PUT /api/notes/:id

### Description: 
Updates a specific note by its ID.

### Authentication: 
Requires a valid JWT.

### Parameters:
id: Note ID
### Request Body:

JSON
{
  "title": "Updated Note",
  "content": "This is the updated content of the note."
}

### Response: 
No content (204) if successful.

## 2.5 Delete a Note
### Endpoint: 
DELETE /api/notes/:id
### Description: 
Deletes a specific note by its ID.
### Authentication: 
Requires a valid JWT.
### Parameters:
id: Note ID
Response: No content (204) if successful.
# 3. Share Note
## 3.1 Share a Note
### Endpoint: 
POST /api/notes/:id/share
### Description: 
Shares
