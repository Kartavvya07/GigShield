from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import jobs
from app.api.endpoints.translate import router as translate_router
from app.api.endpoints.complaint import router as complaint_router
from app.api.endpoints.ocr import router as ocr_router
from app.api.endpoints.fairness import router as fairness_router

app = FastAPI(title="GigShield API")

# Essential for cross-origin calls from React/Vite/Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(translate_router, prefix="/api", tags=["Translation"])
app.include_router(complaint_router, prefix="/api", tags=["Grievances & Complaints"])
app.include_router(ocr_router, prefix="/api", tags=["OCR & Document Processing"])
app.include_router(fairness_router, prefix="/api", tags=["Fairness Calculator"])
app.include_router(jobs.router)

@app.get("/")
def root():
    return {"status": "live", "message": "GigShield API server running."}