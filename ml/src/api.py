import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from pathlib import Path
import sys

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.src.config import (
    MODEL_VERSION,
    METRICS_PATH,
    METADATA_PATH,
    PROJECT_TYPES,
    STATE_DISTRICT_MAP
)
from ml.src.predict import DelayPredictor
from ml.src.train import train_models

app = FastAPI(
    title="TerraTech ML Prediction Service",
    description="AI-powered predictive analytics service for land acquisition delay probability, risk score, and duration estimation.",
    version=MODEL_VERSION
)

# Enable CORS for backend/frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Predictor Instance
predictor_instance: Optional[DelayPredictor] = None


@app.on_event("startup")
def startup_event():
    """Initializes and loads trained ML models on FastAPI server startup."""
    global predictor_instance
    try:
        predictor_instance = DelayPredictor()
        print("ML Models successfully loaded into FastAPI memory.")
    except Exception as e:
        print(f"Warning on startup: {e}. Attempting auto-training...")
        try:
            train_models()
            predictor_instance = DelayPredictor()
            print("Auto-training completed and models loaded successfully.")
        except Exception as train_err:
            print(f"Error during auto-training: {train_err}")


# --- Pydantic Schemas ---

from pydantic import Field

class PredictionRequest(BaseModel):
    project_type: str = Field(..., examples=["Highways"], description="Type of infrastructure or development project")
    state: str = Field(..., examples=["Maharashtra"], description="State location of the land parcel")
    district: str = Field(..., examples=["Pune"], description="District location of the land parcel")
    land_area_acres: float = Field(..., gt=0, examples=[100.0], description="Land area in acres")
    affected_families: int = Field(..., ge=0, examples=[50], description="Number of affected families/landowners")
    ownership_complexity: float = Field(..., ge=0.0, le=1.0, examples=[0.6], description="Complexity index (0.0 to 1.0)")
    documentation_completeness: float = Field(..., ge=0.0, le=1.0, examples=[0.7], description="Completeness index (0.0 to 1.0)")
    legal_dispute: int = Field(..., ge=0, le=1, examples=[1], description="Binary flag (0 = No Dispute, 1 = Active Dispute)")
    compensation_status: float = Field(..., ge=0.0, le=1.0, examples=[0.5], description="Disbursement completion (0.0 to 1.0)")
    approval_status: float = Field(..., ge=0.0, le=1.0, examples=[0.4], description="Statutory clearance completion (0.0 to 1.0)")
    rehabilitation_status: float = Field(..., ge=0.0, le=1.0, examples=[0.5], description="R&R progress (0.0 to 1.0)")
    possession_status: float = Field(..., ge=0.0, le=1.0, examples=[0.2], description="Physical possession completion (0.0 to 1.0)")
    stakeholder_responsiveness: float = Field(..., ge=0.0, le=1.0, examples=[0.6], description="Stakeholder response index (0.0 to 1.0)")
    administrative_processing_days: int = Field(..., ge=0, examples=[180], description="Administrative processing elapsed time (days)")
    historical_delay_rate: float = Field(..., ge=0.0, le=1.0, examples=[0.3], description="Historical delay rate of region/type (0.0 to 1.0)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "project_type": "Highways",
                "state": "Maharashtra",
                "district": "Pune",
                "land_area_acres": 100,
                "affected_families": 50,
                "ownership_complexity": 0.6,
                "documentation_completeness": 0.7,
                "legal_dispute": 1,
                "compensation_status": 0.5,
                "approval_status": 0.4,
                "rehabilitation_status": 0.5,
                "possession_status": 0.2,
                "stakeholder_responsiveness": 0.6,
                "administrative_processing_days": 180,
                "historical_delay_rate": 0.3
            }
        }
    }


class DelayFactor(BaseModel):
    feature: str
    transformed_feature: str
    impact_score: float
    current_value: str
    description: str


class PredictionResponse(BaseModel):
    delay_probability: float
    risk_score: int
    risk_category: str
    estimated_delay_days: int
    delay_factors: List[DelayFactor] = []
    corrective_recommendations: List[str] = []
    model_version: str


class RetrainRequest(BaseModel):
    sample_count: int = Field(default=3000, ge=500, le=20000, description="Number of synthetic samples for retraining")
    force_retrain: bool = Field(default=True, description="Force retrain and overwrite existing models")


class RetrainResponse(BaseModel):
    message: str
    model_version: str
    timestamp: str
    metrics: Dict[str, Any]


# --- Endpoints ---

@app.get("/health", summary="Health Check")
def health_check():
    """Returns operational status of the ML prediction service."""
    return {
        "status": "ok",
        "service": "TerraTech ML Engine",
        "model_version": MODEL_VERSION,
        "models_loaded": predictor_instance is not None,
        "timestamp": datetime.now().isoformat()
    }


@app.post("/predict", response_model=PredictionResponse, summary="Predict Land Acquisition Delay & Risk")
def predict_delay(payload: PredictionRequest):
    """
    Predicts delay probability, risk score, risk category, estimated delay days,
    and returns SHAP feature explanations with corrective recommendations.
    """
    global predictor_instance
    if predictor_instance is None:
        try:
            predictor_instance = DelayPredictor()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Model service uninitialized. Please train model or run /retrain. Details: {e}"
            )

    try:
        input_dict = payload.model_dump()
        result = predictor_instance.predict_single(input_dict)
        return result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Prediction error: {e}")


@app.post("/retrain", response_model=RetrainResponse, summary="Retrain ML Models")
def retrain_model(payload: RetrainRequest = RetrainRequest()):
    """
    Triggers model retraining pipeline with new/updated dataset.
    Updates model artifacts, metadata, and reloads predictor in memory.
    """
    global predictor_instance
    try:
        print(f"Triggering model retrain with {payload.sample_count} samples...")
        metrics, metadata = train_models()
        predictor_instance = DelayPredictor()
        return {
            "message": "Model retrained and reloaded successfully.",
            "model_version": MODEL_VERSION,
            "timestamp": datetime.now().isoformat(),
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Retraining failed: {e}")


@app.get("/metrics", summary="Get Model Evaluation Metrics")
def get_metrics():
    """Returns baseline Random Forest vs XGBoost comparison metrics."""
    if not METRICS_PATH.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Metrics file not found. Train model first.")
    with open(METRICS_PATH, "r") as f:
        return json.load(f)


@app.get("/model-info", summary="Get Model Schema & Metadata")
def get_model_info():
    """Returns model metadata, supported states/districts, and features schema."""
    metadata = {}
    if METADATA_PATH.exists():
        with open(METADATA_PATH, "r") as f:
            metadata = json.load(f)

    return {
        "service": "TerraTech AI Model",
        "model_version": MODEL_VERSION,
        "supported_project_types": PROJECT_TYPES,
        "supported_state_district_mapping": STATE_DISTRICT_MAP,
        "metadata": metadata
    }
