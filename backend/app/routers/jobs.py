from fastapi import APIRouter, UploadFile, File
from app.schemas.gig import JobCreate, ChatRequest
from app.services.fairness_service import calculate_fairness
from app.services.ai_service import extract_job_from_image, generate_chat_response

router = APIRouter(prefix="/api", tags=["GigShield Contract"])

# In-memory storage for active session
MOCK_JOBS = [
    {"id": 1, "platform": "Uber", "fare": 120.0, "distance_km": 8.5, "duration_mins": 30.0, "is_underpaid": False},
    {"id": 2, "platform": "Zomato", "fare": 35.0, "distance_km": 6.0, "duration_mins": 25.0, "is_underpaid": True}
]

@router.post("/jobs")
def create_job(job: JobCreate):
    fairness = calculate_fairness(job.fare, job.distance_km, job.duration_mins)
    new_job = {
        "id": len(MOCK_JOBS) + 1,
        **job.model_dump(),
        "is_underpaid": fairness["is_underpaid"]
    }
    MOCK_JOBS.append(new_job)
    return {"status": "success", "job": new_job, "fairness": fairness}

@router.post("/ocr")
async def scan_ocr(file: UploadFile = File(...)):
    contents = await file.read()
    extracted = extract_job_from_image(contents, file.content_type or "image/jpeg")
    
    fare = float(extracted.get("fare", 0))
    dist = float(extracted.get("distance_km", 0))
    dur = float(extracted.get("duration_mins", 0))
    
    fairness = calculate_fairness(fare, dist, dur)
    
    return {
        "status": "success",
        "extracted": extracted,
        "fairness": fairness
    }

@router.post("/fairness")
def check_fairness(job: JobCreate):
    return calculate_fairness(job.fare, job.distance_km, job.duration_mins)

@router.post("/chat")
def ai_chat(req: ChatRequest):
    reply = generate_chat_response(req.message, req.context)
    return {"response": reply}

@router.get("/dashboard")
def get_dashboard():
    total_earnings = sum(j["fare"] for j in MOCK_JOBS)
    underpaid_count = sum(1 for j in MOCK_JOBS if j.get("is_underpaid"))
    return {
        "total_earnings": round(total_earnings, 2),
        "total_jobs": len(MOCK_JOBS),
        "underpaid_flagged": underpaid_count,
        "recent_jobs": MOCK_JOBS
    }

@router.get("/weekly-insights")
def get_weekly_insights():
    underpaid_jobs = [j for j in MOCK_JOBS if j.get("is_underpaid")]
    return {
        "summary": f"Analyzed {len(MOCK_JOBS)} recent trips. {len(underpaid_jobs)} trips fell below fair-wage benchmarks.",
        "top_underpaying_platform": "Zomato" if underpaid_jobs else "None",
        "recommended_action": "Avoid short delivery orders under 3 km late at night where base pay drops."
    }