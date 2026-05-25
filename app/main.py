from fastapi import FastAPI
from app.api.routes import auth

app = FastAPI(
    title="Skincare Analysis & Recommendation System",
    version="1.0.0"
)

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Skincare API is running"}