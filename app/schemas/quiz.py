from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class QuizSubmit(BaseModel):
    age_range: str
    gender: str
    skin_type: str
    products_used_before: str
    sensitivity: Optional[str] = None
    sun_exposure: str
    concern_one: str
    concern_two: Optional[str] = None
    skin_goal: str

class SkinProfileResponse(BaseModel):
    id: int
    user_id: int
    age_range: Optional[str]
    gender: Optional[str]
    skin_type: Optional[str]
    products_used_before: Optional[str]
    sensitivity: Optional[str]
    sun_exposure: Optional[str]
    concern_one: Optional[str]
    concern_two: Optional[str]
    skin_goal: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True