from __future__ import annotations

from typing import Dict, Mapping, Optional, List, Literal

from pydantic import BaseModel, Field, model_validator


class PredictionRequest(BaseModel):
    """Payload received from the external ML service.

    All fields are required except the optional ones marked below.
    """

    project_id: str = Field(..., description="Unique identifier of the project.")
    risk_score: int = Field(..., ge=0, le=100, description="Risk score 0‑100 produced by the ML model.")
    delay_probability: float = Field(..., ge=0.0, le=1.0, description="Probability that the project will be delayed.")
    estimated_delay_days: int = Field(..., ge=0, description="Estimated number of days of delay.")
    risk_category: Optional[str] = Field(
        default=None,
        description="Risk category (LOW, MEDIUM, HIGH, CRITICAL). If omitted it will be derived from risk_score.",
    )
    affected_families: Optional[int] = Field(default=None, description="Number of families impacted by the project.")
    project_importance: Optional[int] = Field(default=None, description="Importance rating of the project (e.g., 1‑5).")
    # Raw model features – optional, used for SHAP when a model is available.
    features: Optional[Mapping[str, float]] = Field(
        default=None,
        description="Raw feature values for SHAP explanation if a trained model is present.",
    )
    # Binary indicator factors supplied by the ML service for rule‑based XAI.
    prediction_factors: Optional[Mapping[str, int]] = Field(
        default=None,
        description="Indicator flags (0/1) for key risk drivers.",
    )
    meta: Optional[Dict[str, str]] = Field(default=None, description="Additional metadata from the ML service.")

    @model_validator(mode="after")
    def derive_category(cls, values: "PredictionRequest") -> "PredictionRequest":
        """Derive risk_category from risk_score when not provided."""
        if values.risk_category is None:
            score = values.risk_score
            if score <= 39:
                values.risk_category = "LOW"
            elif score <= 59:
                values.risk_category = "MEDIUM"
            elif score <= 79:
                values.risk_category = "HIGH"
            else:
                values.risk_category = "CRITICAL"
        return values


class FactorExplanation(BaseModel):
    factor: str
    impact: Literal["low", "medium", "high"]
    direction: Literal["increase", "decrease"]


class RecommendationItem(BaseModel):
    issue: str
    severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    recommended_action: str
    responsible_department: str
    suggested_deadline_days: int


class AlertItem(BaseModel):
    project_id: str
    severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    message: str
    trigger: str
    created_at: str
    status: Literal["UNREAD", "READ"] = "UNREAD"


class RecommendationResponse(BaseModel):
    project_id: str
    risk_score: int
    risk_category: str
    delay_probability: float
    estimated_delay_days: int
    top_factors: List[FactorExplanation]
    recommendations: List[RecommendationItem]
    alerts: List[AlertItem]
    priority: float


# Legacy schema – kept for backward compatibility (not used by new endpoint).
class LegacyRecommendationRequest(BaseModel):
    """Legacy schema for backward compatibility.

    It expects only a feature map.
    """

    features: Mapping[str, float] = Field(
        ..., description="Feature values required by the model. Keys must match the model's feature names."
    )
    meta: Optional[Dict[str, str]] = Field(default=None, description="Optional arbitrary metadata supplied by the client.")

    @model_validator(mode="after")
    def check_not_empty(cls, values: "LegacyRecommendationRequest") -> "LegacyRecommendationRequest":
        if not values.features:
            raise ValueError("'features' dictionary must contain at least one entry")
        return values
