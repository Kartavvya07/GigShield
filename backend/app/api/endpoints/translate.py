from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from deep_translator import GoogleTranslator

router = APIRouter()

class TranslationPayload(BaseModel):
    text: str
    target_lang: str = "hi"  # Default to Hindi ('hi', 'kn', 'ta', 'te', 'mr', etc.)

@router.post("/translate")
async def translate_text(payload: TranslationPayload):
    try:
        translated = GoogleTranslator(source="auto", target=payload.target_lang).translate(payload.text)
        return {
            "original_text": payload.text,
            "translated_text": translated,
            "target_lang": payload.target_lang
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")