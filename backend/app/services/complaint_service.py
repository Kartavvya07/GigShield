import os
import google.generativeai as genai

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_complaint_draft(
    platform: str,
    issue_type: str,
    details: str,
    distance_km: float = None,
    payout_received: float = None,
    expected_payout: float = None,
    worker_name: str = "Gig Worker"
) -> str:
    """
    Generates a formal, firm, and professional grievance email/letter for platform support.
    """
    model = genai.GenerativeModel("gemini-3.5-flash")

    prompt = f"""
    You are an expert labor advocate writing a formal grievance complaint on behalf of a gig delivery/ride-hailing worker.

    WORKER DETAILS & ISSUE:
    - Platform: {platform}
    - Worker Name: {worker_name}
    - Primary Issue: {issue_type}
    - Description/Details: {details}
    - Distance Traveled: {f"{distance_km} km" if distance_km else "N/A"}
    - Payout Received: {f"₹{payout_received}" if payout_received else "N/A"}
    - Expected Fair Payout: {f"₹{expected_payout}" if expected_payout else "N/A"}

    INSTRUCTIONS:
    1. Write a formal, concise, and structured complaint email/ticket description.
    2. Include a clear Subject Line at the top.
    3. Clearly state why the payout/action is unfair based on distance, time, traffic, or policy violation.
    4. Reference platform policies, fair wages, or fuel/operating costs where appropriate.
    5. Maintain a firm yet polite professional tone.
    6. Include placeholder fields like [Order/Ride ID], [Date], and [Time] for the user to quickly fill in.

    Output ONLY the complaint draft text.
    """

    response = model.generate_content(prompt)
    return response.text