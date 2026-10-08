"""api.main

FastAPI entry point exposing the recommendation service.
"""
from fastapi import FastAPI, HTTPException
from recommendations.engine import get_recommendation
from recommendations.schemas import PredictionRequest, RecommendationResponse

app = FastAPI(title="TerraTech Recommendation Service")

@app.post("/recommend", response_model=RecommendationResponse)
async def recommend(request: PredictionRequest):
    try:
        result = get_recommendation(request)
        return result
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
