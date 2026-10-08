from __future__ import annotations

import logging
from typing import Any, Dict, List

from recommendations.schemas import (
    PredictionRequest,
    FactorExplanation,
    RecommendationItem,
    AlertItem,
    RecommendationResponse,
)
from xai.explainer import explain, get_model

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Helper: recommendation rules based on prediction_factors flags
# ---------------------------------------------------------------------------
_RECOMMENDATION_RULES = {
    "legal_dispute": {
        "issue": "Legal dispute",
        "severity": "HIGH",
        "recommended_action": "Assign the case to the legal resolution team and track the next hearing/action date.",
        "responsible_department": "Legal Resolution Team",
        "suggested_deadline_days": 7,
    },
    "compensation_pending": {
        "issue": "Compensation pending",
        "severity": "HIGH",
        "recommended_action": "Prioritize compensation verification and initiate pending payment processing.",
        "responsible_department": "Compensation Cell",
        "suggested_deadline_days": 7,
    },
    "documentation_incomplete": {
        "issue": "Documentation incomplete",
        "severity": "MEDIUM",
        "recommended_action": "Trigger document verification and identify missing ownership records.",
        "responsible_department": "Documentation Team",
        "suggested_deadline_days": 5,
    },
    "approval_pending": {
        "issue": "Approval pending",
        "severity": "MEDIUM",
        "recommended_action": "Escalate the approval to the responsible department and monitor the approval SLA.",
        "responsible_department": "Approval Office",
        "suggested_deadline_days": 5,
    },
    "rehabilitation_low": {
        "issue": "Rehabilitation progress low",
        "severity": "LOW",
        "recommended_action": "Review affected‑family rehabilitation status and assign an R&R officer.",
        "responsible_department": "Rehabilitation Unit",
        "suggested_deadline_days": 10,
    },
}

# ---------------------------------------------------------------------------
# Helper: alert generation
# ---------------------------------------------------------------------------
def _generate_alerts(req: PredictionRequest) -> List[AlertItem]:
    alerts: List[AlertItem] = []
    # risk based
    if req.risk_category in {"HIGH", "CRITICAL"}:
        alerts.append(
            AlertItem(
                project_id=req.project_id,
                severity=req.risk_category,
                message=f"Risk level {req.risk_category} detected.",
                trigger="risk_category",
                created_at="now",
                status="UNREAD",
            )
        )
    # delay probability
    if req.delay_probability > 0.75:
        alerts.append(
            AlertItem(
                project_id=req.project_id,
                severity="HIGH",
                message="High probability of project delay (>75%).",
                trigger="delay_probability",
                created_at="now",
                status="UNREAD",
            )
        )
    # excessive estimated delay (>30 days)
    if req.estimated_delay_days > 30:
        alerts.append(
            AlertItem(
                project_id=req.project_id,
                severity="MEDIUM",
                message="Estimated delay exceeds 30 days.",
                trigger="estimated_delay_days",
                created_at="now",
                status="UNREAD",
            )
        )
    # factor‑based alerts
    factors = req.prediction_factors or {}
    if factors.get("approval_pending"):
        alerts.append(
            AlertItem(
                project_id=req.project_id,
                severity="HIGH",
                message="Approval is still pending.",
                trigger="approval_pending",
                created_at="now",
                status="UNREAD",
            )
        )
    if factors.get("compensation_pending"):
        alerts.append(
            AlertItem(
                project_id=req.project_id,
                severity="HIGH",
                message="Compensation remains pending.",
                trigger="compensation_pending",
                created_at="now",
                status="UNREAD",
            )
        )
    if factors.get("legal_dispute"):
        alerts.append(
            AlertItem(
                project_id=req.project_id,
                severity="CRITICAL",
                message="Legal dispute is active.",
                trigger="legal_dispute",
                created_at="now",
                status="UNREAD",
            )
        )
    return alerts

# ---------------------------------------------------------------------------
# Helper: recommendation generation from prediction_factors
# ---------------------------------------------------------------------------
def _generate_recommendations(req: PredictionRequest) -> List[RecommendationItem]:
    recs: List[RecommendationItem] = []
    factors = req.prediction_factors or {}
    for factor, flag in factors.items():
        if flag and factor in _RECOMMENDATION_RULES:
            rule = _RECOMMENDATION_RULES[factor]
            recs.append(
                RecommendationItem(
                    issue=rule["issue"],
                    severity=rule["severity"],
                    recommended_action=rule["recommended_action"],
                    responsible_department=rule["responsible_department"],
                    suggested_deadline_days=rule["suggested_deadline_days"],
                )
            )
    return recs

# ---------------------------------------------------------------------------
# Helper: priority calculation (prototype)
# ---------------------------------------------------------------------------
def _calculate_priority(req: PredictionRequest) -> float:
    # Normalise components to 0‑1 range where appropriate.
    score = req.risk_score / 100.0
    prob = req.delay_probability
    days_norm = min(req.estimated_delay_days / 100.0, 1.0)
    families_norm = (req.affected_families or 0) / 1000.0
    importance_norm = (req.project_importance or 1) / 5.0
    priority = (
        0.4 * score + 0.3 * prob + 0.1 * days_norm + 0.1 * families_norm + 0.1 * importance_norm
    )
    return round(priority * 100, 2)

# ---------------------------------------------------------------------------
# Main entry point used by the API
# ---------------------------------------------------------------------------
def get_recommendation(request: PredictionRequest) -> RecommendationResponse:
    """Compose the full recommendation response.

    * If ``request.features`` is supplied **and** a model file is available, SHAP
      explanations are returned.
    * Otherwise we fall back to the ``prediction_factors`` supplied by the ML
      service and mark them as ``top_factors``.
    """
    # 1️⃣ XAI – attempt SHAP first
    top_factors: List[FactorExplanation] = []
    if request.features:
        try:
            xai_res = explain(request.features)
            for f in xai_res.get("top_factors", []):
                top_factors.append(
                    FactorExplanation(
                        factor=f["factor"],
                        impact=f["impact"],
                        direction=f["direction"],
                    )
                )
        except Exception as exc:  # pragma: no cover – model absent in CI
            logger.info("SHAP explanation unavailable: %s", exc)
    # Fallback to prediction_factors if still empty
    if not top_factors and request.prediction_factors:
        for factor, flag in request.prediction_factors.items():
            if flag:
                impact = "high" if flag == 1 else "low"
                direction = "increase" if flag == 1 else "decrease"
                top_factors.append(
                    FactorExplanation(
                        factor=factor,
                        impact=impact,
                        direction=direction,
                    )
                )

    # 2️⃣ Recommendations
    recommendations = _generate_recommendations(request)

    # 3️⃣ Alerts
    alerts = _generate_alerts(request)

    # 4️⃣ Priority score
    priority = _calculate_priority(request)

    # 5️⃣ Assemble response
    return RecommendationResponse(
        project_id=request.project_id,
        risk_score=request.risk_score,
        risk_category=request.risk_category or "UNKNOWN",
        delay_probability=request.delay_probability,
        estimated_delay_days=request.estimated_delay_days,
        top_factors=top_factors,
        recommendations=recommendations,
        alerts=alerts,
        priority=priority,
    )
