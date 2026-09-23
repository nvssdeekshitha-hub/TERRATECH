import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from typing import Dict, Any, List, Union
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.src.config import (
    CLASSIFIER_MODEL_PATH,
    REGRESSOR_MODEL_PATH,
    PREPROCESSOR_PATH,
    METADATA_PATH,
    ALL_FEATURES,
    RISK_LEVELS,
    MODEL_VERSION
)
from ml.src.preprocess import DataPreprocessor
from ml.src.explainability import ExplainabilityEngine


def determine_risk_category(risk_score: int) -> str:
    """Categorizes risk score into LOW, MEDIUM, HIGH, or CRITICAL."""
    if risk_score < 30:
        return "LOW"
    elif risk_score < 60:
        return "MEDIUM"
    elif risk_score < 85:
        return "HIGH"
    else:
        return "CRITICAL"


class DelayPredictor:
    """
    Inference service for TerraTech land acquisition delay predictions.
    Integrates classifier, regressor, preprocessor, and SHAP explainability.
    """

    def __init__(
        self,
        classifier_path: Path = CLASSIFIER_MODEL_PATH,
        regressor_path: Path = REGRESSOR_MODEL_PATH,
        preprocessor_path: Path = PREPROCESSOR_PATH
    ):
        self.classifier_path = classifier_path
        self.regressor_path = regressor_path
        self.preprocessor_path = preprocessor_path

        self.classifier = None
        self.regressor = None
        self.preprocessor: DataPreprocessor = None
        self.explainability_engine: ExplainabilityEngine = None
        
        self.load_artifacts()

    def load_artifacts(self):
        """Loads fitted model artifacts and initializes SHAP explainability engine."""
        if not self.classifier_path.exists() or not self.regressor_path.exists() or not self.preprocessor_path.exists():
            raise FileNotFoundError("Model artifacts missing. Please train the models first using `python ml/src/train.py`.")

        self.classifier = joblib.load(self.classifier_path)
        self.regressor = joblib.load(self.regressor_path)
        self.preprocessor = DataPreprocessor.load(self.preprocessor_path)

        self.explainability_engine = ExplainabilityEngine(
            model=self.classifier,
            preprocessor_feature_names=self.preprocessor.feature_names_out
        )

    def predict_single(self, raw_input: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes real-time delay prediction for a single land parcel / project.
        """
        # Validate input dictionary keys
        missing_keys = [feat for feat in ALL_FEATURES if feat not in raw_input]
        if missing_keys:
            raise ValueError(f"Missing required features in input payload: {missing_keys}")

        df_input = pd.DataFrame([raw_input])
        transformed_input = self.preprocessor.transform(df_input)

        # Predict delay probability (class 1)
        prob_array = self.classifier.predict_proba(transformed_input)
        delay_prob = float(prob_array[0, 1])

        # Compute risk score (0 to 100)
        risk_score = int(np.clip(round(delay_prob * 100), 0, 100))

        # Determine risk category
        risk_category = determine_risk_category(risk_score)

        # Predict estimated delay duration in days
        reg_pred = self.regressor.predict(transformed_input)
        estimated_delay_days = int(np.maximum(0, round(float(reg_pred[0]))))
        
        # If risk category is LOW and prob < 0.25, zero out delay days for consistency
        if delay_prob < 0.20:
            estimated_delay_days = 0

        # SHAP Explainability & Recommendations
        explanation = self.explainability_engine.explain_instance(transformed_input, df_input)

        return {
            "delay_probability": round(delay_prob, 4),
            "risk_score": risk_score,
            "risk_category": risk_category,
            "estimated_delay_days": estimated_delay_days,
            "delay_factors": explanation["delay_factors"],
            "corrective_recommendations": explanation["corrective_recommendations"],
            "model_version": MODEL_VERSION
        }

    def predict_batch(self, raw_inputs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Executes batch predictions."""
        return [self.predict_single(inp) for inp in raw_inputs]
