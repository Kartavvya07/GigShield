from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.complaint_service import generate_complaint_draft

router = APIRouter()

class ComplaintRequest(BaseModel):
    platform: str  # e.g. "Zomato", "Swiggy", "Uber"
    issue_type: str  # e.g. "Unfair Payout", "Wrong Penalty", "Fuel/Distance Miscalculation"
    details: str
    distance_km: Optional[float] = None
    payout_received: Optional[float] = None
    expected_payout: Optional[float] = None
    worker_name: Optional[str] = "Partner"

@router.post("/complaint/draft")
async def draft_complaint_endpoint(payload: ComplaintRequest):
    try:
        draft = generate_complaint_draft(
            platform=payload.platform,
            issue_type=payload.issue_type,
            details=payload.details,
            distance_km=payload.distance_km,
            payout_received=payload.payout_received,
            expected_payout=payload.expected_payout,
            worker_name=payload.worker_name
        )
        return {
            "status": "success",
            "complaint_draft": draft
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate complaint draft: {str(e)}")