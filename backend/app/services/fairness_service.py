def calculate_fairness(fare: float, distance_km: float, duration_mins: float) -> dict:
    """Core mathematical fairness calculation for Indian gig ecosystem baseline."""
    BASE_FARE = 25.0        # ₹ Base pickup rate
    PER_KM_RATE = 12.0      # ₹ Per kilometer rate
    PER_MIN_RATE = 1.5      # ₹ Per minute rate
    
    expected_fare = BASE_FARE + (distance_km * PER_KM_RATE) + (duration_mins * PER_MIN_RATE)
    ratio = fare / expected_fare if expected_fare > 0 else 1.0
    
    is_underpaid = ratio < 0.85
    shortfall = max(0.0, round(expected_fare - fare, 2))
    score = min(100, max(0, int(ratio * 100)))
    
    return {
        "actual_fare": fare,
        "expected_fare": round(expected_fare, 2),
        "shortfall": shortfall,
        "is_underpaid": is_underpaid,
        "fairness_score": score
    }