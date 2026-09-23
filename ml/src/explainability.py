import shap
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.src.config import NUMERICAL_FEATURES, CATEGORICAL_FEATURES


# Mapping of risk factors to corrective recommendations
CORRECTIVE_RECOMMENDATIONS_MAP = {
    "legal_dispute": {
        "condition": lambda val: val == 1,
        "recommendation": "Active legal dispute detected: Deploy fast-track Lok Adalat arbitration and out-of-court settlement committee to expedite land dispute resolution."
    },
    "documentation_completeness": {
        "condition": lambda val: val < 0.7,
        "recommendation": "Low documentation completeness: Mobilize revenue officer taskforce for revenue record digitisation and clear title verification."
    },
    "ownership_complexity": {
        "condition": lambda val: val > 0.5,
        "recommendation": "High ownership complexity: Conduct multi-heir succession mapping and community consultation sessions to resolve co-ownership bottlenecks."
    },
    "compensation_status": {
        "condition": lambda val: val < 0.6,
        "recommendation": "Delayed compensation disbursement: Expedite Direct Bank Transfer (DBT) escrow account funding and set up compensation distribution camps."
    },
    "rehabilitation_status": {
        "condition": lambda val: val < 0.6,
        "recommendation": "Lagging R&R implementation: Accelerate resettlement colony infrastructure development and disburse R&R grants to affected families."
    },
    "possession_status": {
        "condition": lambda val: val < 0.5,
        "recommendation": "Low physical possession status: Issue advance notice to land owners and deploy district administrative possession teams for smooth handover."
    },
    "stakeholder_responsiveness": {
        "condition": lambda val: val < 0.6,
        "recommendation": "Low stakeholder responsiveness: Schedule high-level district collector stakeholder engagement workshops and address local community concerns."
    },
    "approval_status": {
        "condition": lambda val: val < 0.7,
        "recommendation": "Pending statutory approvals: Escalate forest, environmental, and inter-departmental clearances to state single-window approval committee."
    },
    "administrative_processing_days": {
        "condition": lambda val: val > 180,
        "recommendation": "Excessive administrative processing time: Streamline inter-departmental file routing and enforce strict SLA timelines under State Guarantee of Services Act."
    },
    "affected_families": {
        "condition": lambda val: val > 100,
        "recommendation": "Large number of affected families: Deploy dedicated social impact assessment (SIA) monitoring team to handle grievances and public hearings."
    }
}


class ExplainabilityEngine:
    """
    SHAP-based Explainable AI (XAI) engine for TerraTech land acquisition delay model.
    """

    def __init__(self, model: Any, preprocessor_feature_names: List[str]):
        self.model = model
        self.feature_names = preprocessor_feature_names
        # Try TreeExplainer, fallback to Explainer
        try:
            self.explainer = shap.TreeExplainer(self.model)
        except Exception:
            self.explainer = shap.Explainer(self.model)

    def explain_instance(self, transformed_input: np.ndarray, raw_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Computes SHAP values for a single prediction and returns:
        - top delay factors with SHAP contribution values
        - domain-specific corrective recommendations
        """
        shap_values = self.explainer(transformed_input)

        # Handle binary classification output shape (sample_idx, num_features, class_idx) or 2D
        if len(shap_values.values.shape) == 3:
            # SHAP values for positive class (delayed = 1)
            instance_shap = shap_values.values[0, :, 1]
        elif len(shap_values.values.shape) == 2:
            instance_shap = shap_values.values[0, :]
        else:
            instance_shap = shap_values.values

        # Pair feature names with SHAP values
        feature_shap_pairs = list(zip(self.feature_names, instance_shap))
        
        # Sort by SHAP value descending (highest contribution to delay)
        feature_shap_pairs.sort(key=lambda x: x[1], reverse=True)

        delay_factors = []
        raw_row = raw_df.iloc[0].to_dict()

        for fname, s_val in feature_shap_pairs[:5]:
            if s_val > 0.001:  # Positive contribution towards delay
                # Map engineered feature back to raw feature name if OneHotEncoded
                raw_feature = fname
                for raw_col in CATEGORICAL_FEATURES:
                    if fname.startswith(f"cat__{raw_col}_") or fname.startswith(f"{raw_col}_"):
                        raw_feature = raw_col
                        break

                val_str = str(raw_row.get(raw_feature, raw_row.get(fname, "N/A")))
                delay_factors.append({
                    "feature": raw_feature,
                    "transformed_feature": fname,
                    "impact_score": round(float(s_val), 4),
                    "current_value": val_str,
                    "description": f"Feature '{raw_feature}' (value: {val_str}) increases delay risk by +{round(float(s_val) * 100, 1)}%"
                })

        # Generate actionable corrective recommendations based on raw row metrics
        recommendations = []
        for feature_key, rule in CORRECTIVE_RECOMMENDATIONS_MAP.items():
            if feature_key in raw_row:
                val = raw_row[feature_key]
                try:
                    if rule["condition"](val):
                        recommendations.append(rule["recommendation"])
                except Exception:
                    pass

        # Fallback recommendation if clean
        if not recommendations:
            recommendations.append("Continue standard project monitoring and maintain milestone compliance.")

        return {
            "delay_factors": delay_factors,
            "corrective_recommendations": recommendations[:5]  # Limit to top 5 recommendations
        }
