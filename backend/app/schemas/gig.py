from pydantic import BaseModel
from typing import Optional, List

class JobCreate(BaseModel):
    platform: str
    fare: float
    distance_km: float
    duration_mins: float

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None