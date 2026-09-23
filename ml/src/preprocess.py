import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from typing import Tuple, Dict, Any, List
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.src.config import (
    CATEGORICAL_FEATURES,
    NUMERICAL_FEATURES,
    ALL_FEATURES,
    PREPROCESSOR_PATH
)


class DataPreprocessor:
    """
    Data preprocessor pipeline for TerraTech ML features.
    Applies OneHotEncoding to categorical features and StandardScaler to numerical features.
    """

    def __init__(self):
        self.categorical_features = CATEGORICAL_FEATURES
        self.numerical_features = NUMERICAL_FEATURES
        self.pipeline: ColumnTransformer = None
        self.feature_names_out: List[str] = []

    def fit_transform(self, df: pd.DataFrame) -> Tuple[np.ndarray, List[str]]:
        """
        Fits the ColumnTransformer pipeline on input DataFrame and transforms it.
        Returns transformed numpy array and feature names list.
        """
        # Ensure input has all expected raw features
        for feature in ALL_FEATURES:
            if feature not in df.columns:
                raise ValueError(f"Missing required input feature: {feature}")

        X = df[ALL_FEATURES]

        categorical_transformer = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
        numerical_transformer = StandardScaler()

        self.pipeline = ColumnTransformer(
            transformers=[
                ("cat", categorical_transformer, self.categorical_features),
                ("num", numerical_transformer, self.numerical_features)
            ],
            remainder="drop"
        )

        transformed_data = self.pipeline.fit_transform(X)

        # Retrieve feature names after OneHotEncoding
        cat_encoder = self.pipeline.named_transformers_["cat"]
        cat_feature_names = list(cat_encoder.get_feature_names_out(self.categorical_features))
        self.feature_names_out = cat_feature_names + self.numerical_features

        return transformed_data, self.feature_names_out

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        """
        Transforms input DataFrame using pre-fitted pipeline.
        """
        if self.pipeline is None:
            raise RuntimeError("Preprocessor pipeline has not been fitted or loaded yet.")

        for feature in ALL_FEATURES:
            if feature not in df.columns:
                raise ValueError(f"Missing required input feature: {feature}")

        X = df[ALL_FEATURES]
        return self.pipeline.transform(X)

    def save(self, file_path: Path = PREPROCESSOR_PATH):
        """Saves fitted preprocessor pipeline artifact."""
        if self.pipeline is None:
            raise RuntimeError("Cannot save an unfitted preprocessor pipeline.")
        joblib.dump(self, file_path)
        print(f"Preprocessor saved to: {file_path}")

    @classmethod
    def load(cls, file_path: Path = PREPROCESSOR_PATH) -> "DataPreprocessor":
        """Loads fitted preprocessor pipeline artifact."""
        if not Path(file_path).exists():
            raise FileNotFoundError(f"Preprocessor file not found at {file_path}")
        preprocessor = joblib.load(file_path)
        return preprocessor
