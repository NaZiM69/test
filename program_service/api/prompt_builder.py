from typing import List, Optional
from pydantic import BaseModel

class UserProfile(BaseModel):
    user_id: Optional[int] = None
    name: str
    age: int
    weight_kg: float
    height_cm: float
    goal: str
    level: str
    days_available: int
    equipment: str

def build_prompt(profile: UserProfile) -> str:
    return f"""You are a professional sports coach and nutritionist.
Generate a complete personalized fitness and diet program
based on the user profile below.

IMPORTANT: respond ONLY with valid JSON, no explanation,
no markdown, no extra text. Just the raw JSON object.

User profile:
- Name: {profile.name}
- Age: {profile.age} years
- Weight: {profile.weight_kg} kg
- Height: {profile.height_cm} cm
- Goal: {profile.goal}
- Level: {profile.level}
- Available days per week: {profile.days_available}
- Equipment: {profile.equipment}

Return exactly this JSON structure:
{{
  "summary": "one sentence describing the program",
  "duration_weeks": 12,
  "daily_calories": 2500,
  "macros": {{
    "proteins_grams": 218,
    "carbs_grams": 250,
    "fats_grams": 69
  }},
  "sport_program": [
    {{
      "day": "Monday",
      "target_muscles": "Chest / Triceps",
      "exercises": [
        {{
          "name": "Bench Press",
          "sets": 4,
          "reps": "8-12",
          "rest_seconds": 90,
          "tip": "Keep elbows at 45 degrees"
        }}
      ]
    }}
  ]
}}"""
