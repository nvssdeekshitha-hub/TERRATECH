import pytest
from fastapi.testclient import TestClient
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.src.api import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "model_version" in data


def test_model_info_endpoint():
    response = client.get("/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "supported_project_types" in data
    assert "supported_state_district_mapping" in data


def test_predict_endpoint_valid():
    sample_payload = {
        "project_type": "Highways",
        "state": "Maharashtra",
        "district": "Pune",
        "land_area_acres": 100.0,
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

    response = client.post("/predict", json=sample_payload)
    assert response.status_code == 200
    data = response.json()
    assert "delay_probability" in data
    assert "risk_score" in data
    assert "risk_category" in data
    assert "estimated_delay_days" in data
    assert "delay_factors" in data
    assert "corrective_recommendations" in data


def test_predict_endpoint_invalid_payload():
    invalid_payload = {
        "project_type": "Highways",
        "state": "Maharashtra",
        # Missing required fields
    }
    response = client.post("/predict", json=invalid_payload)
    assert response.status_code == 422  # Unprocessable Entity (Validation Error)
