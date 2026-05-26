from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.quiz import QuizSubmit, SkinProfileResponse
from app.services.quiz_service import (
    get_skin_profile,
    create_skin_profile,
    update_skin_profile
)
from app.models.user import User

router = APIRouter(prefix="/quiz", tags=["Quiz & Skin Profile"])

@router.post("/submit", response_model=SkinProfileResponse)
def submit_quiz(
    quiz_data: QuizSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = get_skin_profile(db, current_user.id)
    if existing:
        return update_skin_profile(db, current_user.id, quiz_data)
    return create_skin_profile(db, current_user.id, quiz_data)

@router.get("/profile", response_model=SkinProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = get_skin_profile(db, current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skin profile not found. Please complete the quiz first."
        )
    return profile