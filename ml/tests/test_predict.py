import pytest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.src.predict import DelayPredictor, determine_risk_category


def test_determine_risk_category():
    assert determine_risk_category(15) == "LOW"
    assert determine_risk_category(45) == "MEDIUM"
    assert determine_risk_category(75) == "HIGH"
    assert determine_risk_category(90) == "CRITICAL"


def test_predict_single():
    predictor = DelayPredictor()
    sample_input = {
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

    result = predictor.predict_single(sample_input)

    assert "delay_probability" in result
    assert 0.0 <= result["delay_probability"] <= 1.0
    assert "risk_score" in result
    assert 0 <= result["risk_score"] <= 100
    assert result["risk_category"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    assert "estimated_delay_days" in result
    assert result["estimated_delay_days"] >= 0
    assert "delay_factors" in result
    assert "corrective_recommendations" in result
    assert isinstance(result["corrective_recommendations"], list)
