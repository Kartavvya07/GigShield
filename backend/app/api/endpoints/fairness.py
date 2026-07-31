from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.fairness_service import calculate_fairness  # Adjust function name to match your service

router = APIRouter()

class PayoutCalculationRequest(BaseModel):
    platform: str
    distance_km: float
    duration_mins: float
    payout_received: float
    fuel_price: Optional[float] = None

@router.post("/fairness/calculate")
async def calculate_fairness_endpoint(payload: PayoutCalculationRequest):
    try:
        result = calculate_fairness(
            platform=payload.platform,
            distance_km=payload.distance_km,
            duration_mins=payload.duration_mins,
            payout_received=payload.payout_received,
            fuel_price=payload.fuel_price
        )
        return {
            "status": "success",
            "evaluation": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fairness calculation failed: {str(e)}")