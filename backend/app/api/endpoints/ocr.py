from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.ocr_service import extract_job_from_image  # Adjust function name to match your service

router = APIRouter()

@router.post("/ocr/analyze")
async def analyze_screenshot(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")
    
    try:
        image_bytes = await file.read()
        extracted_data = extract_job_from_image(image_bytes, file.content_type)
        return {
            "status": "success",
            "data": extracted_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")