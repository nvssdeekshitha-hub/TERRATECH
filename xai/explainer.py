"""
Explainer module for TerraTech XAI.
It loads a pre-trained ML model and a SHAP explainer.
The `explain` function returns a risk score and top contributing factors.
"""
import os
import joblib
import shap
from typing import Dict, List

# Load the model – assumed to be a sklearn‑compatible estimator saved as a joblib file.
_MODEL_PATH = os.getenv("MEANING_MODEL_PATH", "model.pkl")

try:
    _model = joblib.load(_MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load model from {_MODEL_PATH}: {e}")

# Create a SHAP explainer. For tree‑based models we use TreeExplainer, otherwise KernelExplainer.
if hasattr(_model, "predict_proba") and "tree" in _model.__class__.__module__:
    _explainer = shap.TreeExplainer(_model)
else:
    # Fallback – we need a background dataset; here we use a small dummy sample.
    background = shap.sample(_model._X if hasattr(_model, "_X") else [[0] * _model.n_features_in_], 10)
    _explainer = shap.KernelExplainer(_model.predict_proba, background)

def explain(features: Dict) -> Dict:
    """Return a risk explanation for a single project.

    Args:
        features: Mapping of feature names to values (as expected by the model).

    Returns:
        A dict with ``risk_score`` (0‑100) and a list of the top contributing factors.
        Each factor dictionary contains ``factor`` (feature name), ``impact`` (high/medium/low),
        and ``direction`` (increases_risk / decreases_risk).
    """
    # Convert dict to ordered list matching model input order.
    if hasattr(_model, "feature_names_in_"):
        ordered = [features.get(name, 0) for name in _model.feature_names_in_]
    else:
        ordered = list(features.values())

    # Model prediction – we assume the positive class is the risk score (0‑1).
    prob = _model.predict_proba([ordered])[0][1]
    risk_score = int(round(prob * 100))

    # SHAP values for the instance.
    shap_vals = _explainer.shap_values([ordered])
    # shap_vals can be list (for binary classification) – pick the appropriate class.
    if isinstance(shap_vals, list):
        shap_vals = shap_vals[1]  # class‑1 (risk)
    shap_vals = shap_vals[0]

    # Pair values with feature names.
    if hasattr(_model, "feature_names_in_"):
        names = list(_model.feature_names_in_)
    else:
        names = list(features.keys())

    contributions = list(zip(names, shap_vals))
    # Sort by absolute magnitude descending.
    contributions.sort(key=lambda x: abs(x[1]), reverse=True)
    top = contributions[:5]

    def _impact(value: float) -> str:
        mag = abs(value)
        if mag >= 0.2:
            return "high"
        elif mag >= 0.1:
            return "medium"
        else:
            return "low"

    top_factors = []
    for name, val in top:
        top_factors.append({
            "factor": name,
            "impact": _impact(val),
            "direction": "increases_risk" if val > 0 else "decreases_risk",
        })

    return {"risk_score": risk_score, "top_factors": top_factors}
