import os
import json
import re
from google import genai
from google.genai import types

# Set your Gemini API key here or in environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def get_client():
    return genai.Client(api_key=GEMINI_API_KEY)

def extract_job_from_image(file_bytes: bytes, content_type: str) -> dict:
    """Uses Gemini Vision to read gig app screenshot and return structured job data."""
    try:
        client = get_client()
        prompt = """
        Analyze this gig app delivery/ride screenshot (Uber, Swiggy, Zomato, Rapido, etc.).
        Extract the following fields in JSON format:
        {
            "platform": "Platform Name",
            "fare": 85.0,
            "distance_km": 6.5,
            "duration_mins": 25.0
        }
        Return ONLY valid raw JSON. No markdown backticks.
        """
        
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=[
                types.Part.from_bytes(data=file_bytes, mime_type=content_type),
                prompt
            ]
        )
        clean_text = re.sub(r'```json|```', '', response.text).strip()
        return json.loads(clean_text)
    except Exception as e:
        # Fallback default if image extraction fails or unreadable
        return {"platform": "Unknown", "fare": 50.0, "distance_km": 5.0, "duration_mins": 20.0, "error": str(e)}

def generate_chat_response(message: str, context: dict = None) -> str:
    """Answers driver questions regarding rights, fares, and safety."""
    try:
        client = get_client()
        prompt = f"""
        You are GigShield AI, an authoritative, helpful advocate for gig workers and drivers in India.
        Answer this worker's question clearly and concisely (under 100 words):
        
        User Question: "{message}"
        Context: {context if context else 'General inquiry'}
        """
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        return "I am unable to process your query right now. Please check standard platform guidelines for fare disputes."