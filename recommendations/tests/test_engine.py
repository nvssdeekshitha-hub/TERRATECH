import pytest
from recommendations.engine import get_recommendation
from recommendations.schemas import PredictionRequest, RecommendationResponse


def test_recommendation_success_full():
    # Build a realistic PredictionRequest containing all required data.
    req = PredictionRequest(
        project_id="P001",
        risk_score=82,
        delay_probability=0.84,
        estimated_delay_days=45,
        risk_category="CRITICAL",
        affected_families=120,
        project_importance=5,
        prediction_factors={
            "legal_dispute": 1,
            "compensation_pending": 1,
            "approval_pending": 1,
        },
        features={},
    )

    result = get_recommendation(req)

    # Engine returns a Pydantic model (RecommendationResponse).
    assert isinstance(result, RecommendationResponse)

    # Verify core fields are echoed from the request.
    assert result.risk_score == 82
    assert result.risk_category == "CRITICAL"
    assert result.delay_probability == 0.84
    assert result.estimated_delay_days == 45

    # Top factors should be derived from the provided prediction_factors.
    factor_names = {f.factor for f in result.top_factors}
    expected_factors = {"legal_dispute", "compensation_pending", "approval_pending"}
    assert expected_factors.issubset(factor_names)
    for f in result.top_factors:
        # All flags are 1 → high impact, direction increase.
        assert f.impact == "high"
        assert f.direction == "increase"

    # Recommendations for each active factor must be present.
    rec_issues = {r.issue for r in result.recommendations}
    assert "Legal dispute" in rec_issues
    assert "Compensation pending" in rec_issues
    assert "Approval pending" in rec_issues

    # Each recommendation includes required fields.
    for rec in result.recommendations:
        assert isinstance(rec.severity, str)
        assert isinstance(rec.responsible_department, str)
        assert isinstance(rec.suggested_deadline_days, int)
        assert isinstance(rec.recommended_action, str)

    # Alerts should include risk category, delay probability, and factor‑based triggers.
    alert_triggers = {a.trigger for a in result.alerts}
    assert "risk_category" in alert_triggers
    assert "delay_probability" in alert_triggers
    assert "legal_dispute" in alert_triggers
    assert "compensation_pending" in alert_triggers
    assert "approval_pending" in alert_triggers

    # Priority should be a float (prototype calculation).
    assert isinstance(result.priority, float)

def test_missing_model_no_error():
    # When no model is present and features are empty, engine should still work using factors.
    req = PredictionRequest(
        project_id="P002",
        risk_score=55,
        delay_probability=0.2,
        estimated_delay_days=10,
        prediction_factors={"documentation_incomplete": 1},
        features={},
    )
    result = get_recommendation(req)
    assert isinstance(result, RecommendationResponse)
    # Ensure at least one recommendation is produced from the factor.
    assert len(result.recommendations) == 1
    assert result.recommendations[0].issue == "Documentation incomplete"
