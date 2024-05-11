# RateYourProfessor API Documentation

## Overview
This document outlines the API endpoints for the RateYourProfessor backend server, which handles CRUD operations for professor ratings.

## Base URL
The base URL for the API is: `https://professor-rating-app-2ujpnwmv.devinapps.com`

## Endpoints

### GET /api/ratings
- Description: Retrieve a list of all professor ratings.
- Request: `GET /api/ratings`
- Response:
  - Status: 200 OK
  - Body:
    ```json
    {
      "message": "Success",
      "data": [
        {
          "id": 1,
          "professorId": 1,
          "clarity": 5,
          "helpfulness": 5,
          "easiness": 5,
          "comment": "Great professor!"
        }
        // ... more ratings
      ]
    }
    ```

### POST /api/ratings
- Description: Create a new rating for a professor.
- Request: `POST /api/ratings`
  - Body:
    ```json
    {
      "professorId": 1,
      "clarity": 5,
      "helpfulness": 5,
      "easiness": 5,
      "comment": "Great professor!"
    }
    ```
- Response:
  - Status: 200 OK
  - Body:
    ```json
    {
      "message": "Success",
      "data": {
        "professorId": 1,
        "clarity": 5,
        "helpfulness": 5,
        "easiness": 5,
        "comment": "Great professor!"
      },
      "id": 1
    }
    ```

### PUT /api/ratings/:id
- Description: Update an existing rating by ID.
- Request: `PUT /api/ratings/:id`
  - Parameters:
    - `id`: The ID of the rating to update.
  - Body:
    ```json
    {
      "clarity": 4,
      "helpfulness": 4,
      "easiness": 4,
      "comment": "Good professor, but challenging course."
    }
    ```
- Response:
  - Status: 200 OK
  - Body:
    ```json
    {
      "message": "Success",
      "data": {
        "clarity": 4,
        "helpfulness": 4,
        "easiness": 4,
        "comment": "Good professor, but challenging course."
      },
      "changes": 1
    }
    ```

### DELETE /api/ratings/:id
- Description: Delete a rating by ID.
- Request: `DELETE /api/ratings/:id`
  - Parameters:
    - `id`: The ID of the rating to delete.
- Response:
  - Status: 200 OK
  - Body:
    ```json
    {
      "message": "Deleted successfully",
      "changes": 1
    }
    ```

## Error Handling
- All endpoints will return a status code of 400 for bad requests with a JSON body explaining the error.
- A status code of 500 is returned for internal server errors.
