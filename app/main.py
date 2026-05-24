from fastapi import FastAPI

app = FastAPI(
    title="Skincare Analysis & Recommendation System",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Skincare API is running"}