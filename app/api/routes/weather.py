from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.weather_service import get_full_weather

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("/current")
async def get_current_weather(
    lat: float,
    lon: float,
    current_user: User = Depends(get_current_user)
):
    weather = await get_full_weather(lat, lon)
    return weather