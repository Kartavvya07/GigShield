# GigShield

Submission for the [SYNAPTRIX]

## Problem Statement Chosen
**Domain:** GigShield
**Problem Statement:** Gig workers face inconsistent earnings and lack the tools to quickly verify if their payout is fair based on distance, time, and operating costs, making dispute resolution difficult.

## Team
**Team Name:** [MIDNIGHT COMMITS]

## Our Solution
GigShield is an automated protection and safety net platform designed to advocate for gig workers in India. It empowers delivery and ride-hailing workers by providing tools to track, evaluate, and dispute their earnings. Workers can easily log shifts by uploading screenshots, which are processed via AI to extract payout details. The system calculates a fairness score, flags underpaid jobs, and features an AI advisor that can draft formal grievance emails and provide weekly strategic insights.

## AI Component

**What AI is used:** Google Generative AI (`gemini-3.5-flash`) via the `google-genai` SDK.

**What it does in your app:** * **OCR Screenshot Extraction:** Uses Gemini Vision to read gig app screenshots and extract structured JSON data (platform, fare, distance, duration).
* **GigShield AI Advisor:** Acts as a chatbot to answer worker questions regarding their rights, fares, and safety.
* **Automated Grievance Drafting:** Generates formal, firm, and professional grievance emails for workers to dispute unfair payouts.
* **Weekly Insights:** Generates executive summaries of the week's performance, identifying risks and suggesting optimized shifts.

**Why we chose this approach:** We chose Gemini 3.5 Flash because of its robust multimodal capabilities. It allows us to use a single, fast model to accurately parse non-standardized screenshots from various platforms (Uber, Zomato, Swiggy) while also powering context-aware natural language generation for the chatbot and complaint drafter. 

## Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, React Router, Lucide Icons
* **Backend:** Python, FastAPI, Uvicorn, Pydantic
* **AI/ML:** Google Generative AI (Gemini 3.5 Flash)
* **Database/Storage:** In-memory local storage (Mock Data structure implemented)
* **Other tools/APIs:** `deep-translator` (GoogleTranslator) for regional language support

## Features Implemented

**Core Requirements:**
* **Smart Shift Logging:** Users can manually log shifts or upload a receipt screenshot for automated data extraction.
* **The Fairness Calculator:** Evaluates payouts based on a baseline algorithm (`Expected Fare = ₹25 + (Distance * ₹12/km) + (Duration * ₹1.5/min)`) and flags jobs under an 85% payout ratio.
* **GigShield AI Advisor:** Context-aware 24/7 AI advocate for driver support.
* **Automated Grievance Drafting:** One-click generation of dispute emails for flagged jobs.
* **Earnings Dashboard & Weekly Insights:** Tracks active hours, daily earning trends, and AI-generated risk reports.

**Bonus Features Attempted:**
* **Multi-lingual Translation API:** Support for translating text into regional Indian languages (Hindi, Kannada, Tamil, Telugu, Marathi).
* **Mock Mode Toggle:** Configurable frontend environment to run the app using simulated data (`VITE_USE_MOCK=true`) without hitting the live backend.

---

## How to Run This Project

### Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Copy the example env file and fill in your own keys
cp .env.example .env

# Run the backend server
uvicorn app.main:app --reload --port 8000

```



###FRONTEND SETUP
```
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Copy the example env file
cp .env.example .env

# Run the frontend development server
npm run dev


```
### API Keys / Environment Variables
```
Do not hardcode API keys or upload them directly to GitHub.

Backend Requirements (backend/.env):

GEMINI_API_KEY: Your Google Gemini API Key required for the OCR, Chat, and Complaint Generation features.

Frontend Requirements (frontend/.env):

VITE_API_BASE_URL: Set to http://localhost:8000/api

VITE_USE_MOCK: Set to false to connect to the backend, or true to run the UI with sample mock data.

VITE_API_TIMEOUT: 15000
