# GigShield API Contract

This document defines the API endpoints and data schemas shared between the frontend and backend.

## Endpoints

### 1. Health Check
- **URL:** `/api/health`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "status": "ok",
    "timestamp": "2026-07-31T10:41:00Z"
  }
  ```

### 2. User / Worker Profile
- **URL:** `/api/profile`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "id": "usr_123",
    "name": "Alex Worker",
    "role": "Gig Worker",
    "shieldStatus": "Active"
  }
  ```
