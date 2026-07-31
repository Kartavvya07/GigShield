# GigShield - API Contract & Schema Specification

**Version:** 1.0.0  
**Target Backend Framework:** Python (FastAPI)  
**Target Frontend:** React + Vite + TypeScript  
**Communication Format:** REST APIs (`application/json` & `multipart/form-data`)

---

## 1. Health Check
- **Endpoint:** `GET /api/health`
- **Description:** Verifies backend service health.
- **Response (200 OK):**
  ```json
  {
    "status": "ok",
    "timestamp": "2026-07-31T10:50:00Z"
  }
  ```

---

## 2. Job Logging APIs
### 2.1 Get All Jobs
- **Endpoint:** `GET /api/jobs`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "job_001",
        "platform": "Uber",
        "title": "Downtown Ride Batch",
        "date": "2026-07-30",
        "basePay": 45.50,
        "tips": 12.00,
        "totalEarnings": 57.50,
        "hoursWorked": 3.5,
        "distanceMiles": 28.4,
        "location": "Central Metro Area",
        "isFair": true,
        "createdAt": "2026-07-30T18:30:00Z"
      }
    ]
  }
  ```

### 2.2 Create Manual Job
- **Endpoint:** `POST /api/jobs`
- **Method:** `POST`
- **Request Body (`application/json`):**
  ```json
  {
    "platform": "DoorDash",
    "title": "Evening Delivery Run",
    "date": "2026-07-31",
    "basePay": 32.00,
    "tips": 8.50,
    "hoursWorked": 2.0,
    "distanceMiles": 14.2,
    "location": "North Suburbs",
    "notes": "Traffic heavy near main street"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Job logged successfully",
    "data": {
      "id": "job_002",
      "platform": "DoorDash",
      "title": "Evening Delivery Run",
      "date": "2026-07-31",
      "basePay": 32.00,
      "tips": 8.50,
      "totalEarnings": 40.50,
      "hoursWorked": 2.0,
      "distanceMiles": 14.2,
      "location": "North Suburbs",
      "isFair": true,
      "createdAt": "2026-07-31T10:45:00Z"
    }
  }
  ```

---

## 3. Screenshot OCR Extraction
- **Endpoint:** `POST /api/ocr/analyze`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Request Parameters:**
  - `file`: Image binary file (`.png`, `.jpg`, `.jpeg`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "platform": "DoorDash",
      "detectedPay": 24.50,
      "detectedTips": 5.00,
      "detectedTotal": 29.50,
      "detectedHours": 1.5,
      "detectedDate": "2026-07-31",
      "confidenceScore": 0.94,
      "rawText": "Delivery Summary Total: $29.50 Base Pay: $24.50 Tip: $5.00 Duration: 1h 30m"
    }
  }
  ```

---

## 4. Fairness Check API
- **Endpoint:** `POST /api/fairness/check`
- **Method:** `POST`
- **Request Body (`application/json`):**
  ```json
  {
    "basePay": 24.50,
    "tips": 5.00,
    "hoursWorked": 2.0,
    "distanceMiles": 15.0,
    "platform": "Uber"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "hourlyRate": 14.75,
      "regionalMinimumWage": 16.50,
      "marketAverageHourlyRate": 21.00,
      "fairnessScore": 58,
      "status": "UNDERPAID",
      "breakdown": {
        "basePayRatio": 0.83,
        "tipDependencyPercentage": 16.9,
        "estimatedGasExpense": 4.50,
        "netHourlyPay": 12.50
      },
      "warnings": [
        "Net hourly earnings are below regional minimum wage ($16.50/hr).",
        "Vehicle gas expenses reduced profitability by $4.50."
      ]
    }
  }
  ```

---

## 5. AI Chatbot API
- **Endpoint:** `POST /api/chatbot/message`
- **Method:** `POST`
- **Request Body (`application/json`):**
  ```json
  {
    "message": "Which platform gave me the best pay per hour this week?",
    "userContext": {
      "totalWeeklyEarnings": 420.50,
      "primaryPlatform": "Uber"
    }
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "reply": "Based on your logs, Uber offered your highest effective pay rate at $24.20/hr, whereas DoorDash averaged $17.80/hr.",
      "suggestedActions": [
        "Focus on Uber Friday evening peak hours",
        "Review DoorDash trip gas expenses"
      ],
      "confidenceScore": 0.96,
      "timestamp": "2026-07-31T10:52:00Z"
    }
  }
  ```

---

## 6. Weekly Dashboard Summary
- **Endpoint:** `GET /api/dashboard/summary`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "periodStart": "2026-07-25",
      "periodEnd": "2026-07-31",
      "totalEarnings": 645.80,
      "totalHoursWorked": 28.5,
      "overallHourlyRate": 22.66,
      "totalJobsCount": 18,
      "fairJobsCount": 15,
      "underpaidJobsCount": 3,
      "platformBreakdown": [
        {
          "platform": "Uber",
          "totalAmount": 380.00,
          "jobCount": 10,
          "hoursWorked": 16.0
        },
        {
          "platform": "DoorDash",
          "totalAmount": 265.80,
          "jobCount": 8,
          "hoursWorked": 12.5
        }
      ],
      "dailyEarningsTrend": [
        { "day": "Mon", "earnings": 85.00, "hours": 4.0 },
        { "day": "Tue", "earnings": 110.50, "hours": 5.0 },
        { "day": "Wed", "earnings": 95.00, "hours": 4.5 },
        { "day": "Thu", "earnings": 140.30, "hours": 6.0 },
        { "day": "Fri", "earnings": 215.00, "hours": 9.0 }
      ]
    }
  }
  ```

---

## 7. AI Weekly Insights Summary
- **Endpoint:** `GET /api/weekly-insights`
- **Method:** `GET`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "insight_w31",
      "weekEndingDate": "2026-07-31",
      "headlineSummary": "Strong earnings week driven by Uber weekend surges, but DoorDash Thursday trips showed high gas wear.",
      "topPlatform": "Uber",
      "fairnessRating": "83% Fair Pay",
      "highlights": [
        "Total earnings increased by 14% compared to previous week.",
        "Average hourly rate exceeded local benchmark by $3.20/hr."
      ],
      "anomaliesOrRisks": [
        "3 trips logged base pay under local minimum wage threshold before tips."
      ],
      "recommendations": [
        "Prioritize Uber shifts during 5 PM - 9 PM surge windows.",
        "Consider logging gas mileage for DoorDash tax deductions."
      ],
      "projectedMonthlyEarnings": 2580.00
    }
  }
  ```

---

## Standardized Error Responses

### HTTP 400 Bad Request / 422 Unprocessable Entity
```json
{
  "success": false,
  "message": "Invalid request payload format",
  "errorCode": "VALIDATION_ERROR",
  "details": {
    "hoursWorked": "Field must be greater than 0"
  }
}
```

### HTTP 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error during OCR processing",
  "errorCode": "INTERNAL_SERVER_ERROR"
}
```
