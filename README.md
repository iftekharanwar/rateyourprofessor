# RateYourProfessor Backend

This is the backend for the RateYourProfessor application. It provides API endpoints for CRUD operations on professor ratings.

## Getting Started

To get the backend server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- Create a `.env` file in the root of the project and add the following:
  ```
  PORT=3001
  DATABASE_PATH=./ratings.db
  ```
  Replace the values as needed for your local environment.
- `node index.js` to start the local server

## Environment Variables

The following environment variables are required for the backend server to function correctly:

- `PORT` - The port number on which the backend server will run.
- `DATABASE_PATH` - The file path for the SQLite database.

These variables are to be defined in the `.env` file. The `.env` file is not tracked by git as it may contain sensitive information.

## API Documentation

Refer to `API_DOCS.md` for detailed information on the API endpoints provided by the backend server.
