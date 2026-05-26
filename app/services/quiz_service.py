from sqlalchemy.orm import Session
from app.models.skin_profile import SkinProfile
from app.schemas.quiz import QuizSubmit

def get_skin_profile(db: Session, user_id: int):
    return db.query(SkinProfile).filter(SkinProfile.user_id == user_id).first()

def create_skin_profile(db: Session, user_id: int, quiz_data: QuizSubmit):
    skin_profile = SkinProfile(
        user_id=user_id,
        age_range=quiz_data.age_range,
        gender=quiz_data.gender,
        skin_type=quiz_data.skin_type,
        products_used_before=quiz_data.products_used_before,
        sensitivity=quiz_data.sensitivity,
        sun_exposure=quiz_data.sun_exposure,
        concern_one=quiz_data.concern_one,
        concern_two=quiz_data.concern_two,
        skin_goal=quiz_data.skin_goal
    )
    db.add(skin_profile)
    db.commit()
    db.refresh(skin_profile)
    return skin_profile

def update_skin_profile(db: Session, user_id: int, quiz_data: QuizSubmit):
    skin_profile = get_skin_profile(db, user_id)
    if not skin_profile:
        return create_skin_profile(db, user_id, quiz_data)
    
    skin_profile.age_range = quiz_data.age_range
    skin_profile.gender = quiz_data.gender
    skin_profile.skin_type = quiz_data.skin_type
    skin_profile.products_used_before = quiz_data.products_used_before
    skin_profile.sensitivity = quiz_data.sensitivity
    skin_profile.sun_exposure = quiz_data.sun_exposure
    skin_profile.concern_one = quiz_data.concern_one
    skin_profile.concern_two = quiz_data.concern_two
    skin_profile.skin_goal = quiz_data.skin_goal
    
    db.commit()
    db.refresh(skin_profile)
    return skin_profile