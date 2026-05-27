import httpx
from app.core.config import settings

async def get_weather(lat: float, lon: float):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={settings.OPENWEATHERMAP_API_KEY}&units=metric"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()
    
    return {
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "weather_condition": data["weather"][0]["description"],
        "city": data["name"]
    }

async def get_uv_index(lat: float, lon: float):
    url = f"https://api.openuv.io/api/v1/uv?lat={lat}&lng={lon}"
    headers = {"x-access-token": settings.OPENUV_API_KEY}
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        data = response.json()
    
    return {
        "uv_index": data["result"]["uv"],
        "uv_max": data["result"]["uv_max"]
    }

async def get_full_weather(lat: float, lon: float):
    weather = await get_weather(lat, lon)
    uv = await get_uv_index(lat, lon)
    
    return {
        **weather,
        **uv
    }