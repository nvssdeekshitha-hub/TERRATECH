"""
Explainer module for TerraTech XAI.
Provides lazy model loading and SHAP explanations when a model is available.
If no model is present, `explain` returns a neutral result so the recommendation
engine can fall back to using prediction factors.
"""

import os
import logging
from typing import Any, Dict, List

# Optional heavy dependencies – imported lazily to avoid import errors when they
# are not installed in the test environment.
try:
    import joblib  # type: ignore
    import shap  # type: ignore
except Exception:  # pragma: no cover
    joblib = None  # type: ignore
    shap = None  # type: ignore

_logger = logging.getLogger(__name__)

# Path to a serialized model; can be overridden via environment variable.
_MODEL_PATH = os.getenv("MEANING_MODEL_PATH", "model.pkl")

# Cached objects – initially None, populated lazily.
_model: Any = None
_explainer: Any = None


def _load_assets() -> None:
    """Load the ML model and initialise a SHAP explainer if possible.

    The function is tolerant to missing files or missing optional libraries.
    If loading fails, both ``_model`` and ``_explainer`` remain ``None`` so that
    callers can gracefully fall back.
    """
    global _model, _explainer
    # If we have already attempted loading, do not repeat work.
    if _model is not None or _explainer is not None:
        return

    if joblib is None or shap is None:
        _logger.debug("joblib or shap not available – skipping model load.")
        _model = None
        _explainer = None
        return

    # Attempt to load the model file.
    try:
        _model = joblib.load(_MODEL_PATH)
    except Exception as exc:  # pragma: no cover – model file may be absent.
        _logger.warning("Failed to load model from %s: %s", _MODEL_PATH, exc)
        _model = None
        _explainer = None
        return

    # Create a SHAP explainer appropriate for the loaded model.
    try:
        if hasattr(_model, "predict_proba") and "tree" in _model.__class__.__module__:
            _explainer = shap.TreeExplainer(_model)
        else:
            # KernelExplainer needs a background dataset.
            background = getattr(_model, "_X", None)
            if background is None:
                raise RuntimeError(
                    "KernelExplainer requires a background dataset; provide ``model._X``."
                )
            # Sample a small background for efficiency.
            background = shap.sample(background, 10)
            _explainer = shap.KernelExplainer(_model.predict_proba, background)
    except Exception as exc:  # pragma: no cover – fallback to no explainer.
        _logger.warning("Failed to create SHAP explainer: %s", exc)
        _explainer = None


def get_model() -> Any:
    """Return the loaded model, loading it lazily if necessary.

    Returns ``None`` when no model could be loaded.
    """
    _load_assets()
    return _model


def explain(features: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a risk score and top factors for the supplied feature set.

    If a model and SHAP explainer are available, returns a dict containing a
    ``risk_score`` (0‑100) and a ``top_factors`` list derived from SHAP values.
    When no model is present, returns ``{"risk_score": 0, "top_factors": []}``
    to allow callers to use alternative explanation sources.
    """
    _load_assets()

    if _model is None or _explainer is None:
        # No model/SHAP available – provide a safe fallback.
        return {"risk_score": 0, "top_factors": []}

    # Order features according to the model's expected input shape.
    if hasattr(_model, "feature_names_in_"):
        ordered: List[Any] = [features.get(name, 0) for name in _model.feature_names_in_]
    else:
        ordered = list(features.values())

    # Predict probability for the positive class.
    prob = _model.predict_proba([ordered])[0][1]
    risk_score = int(round(prob * 100))

    # Compute SHAP values.
    shap_vals = _explainer.shap_values([ordered])
    if isinstance(shap_vals, list):
        # For classifiers SHAP may return a list per class; use the positive class.
        shap_vals = shap_vals[1]
    shap_vals = shap_vals[0]

    # Pair SHAP values with feature names.
    if hasattr(_model, "feature_names_in_"):
        names = list(_model.feature_names_in_)
    else:
        names = list(features.keys())
    contributions = list(zip(names, shap_vals))
    contributions.sort(key=lambda x: abs(x[1]), reverse=True)
    top = contributions[:5]

    def _impact(value: float) -> str:
        magnitude = abs(value)
        if magnitude >= 0.2:
            return "high"
        if magnitude >= 0.1:
            return "medium"
        return "low"

    top_factors: List[Dict[str, str]] = [
        {
            "factor": name,
            "impact": _impact(val),
            "direction": "increase" if val > 0 else "decrease",
        }
        for name, val in top
    ]

    return {"risk_score": risk_score, "top_factors": top_factors}
