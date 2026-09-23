import pytest
import pandas as pd
import numpy as np
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.src.data_generator import generate_synthetic_data
from ml.src.preprocess import DataPreprocessor


def test_preprocessor_fit_transform():
    df = generate_synthetic_data(num_samples=100, seed=42)
    preprocessor = DataPreprocessor()
    transformed, feature_names = preprocessor.fit_transform(df)
    
    assert isinstance(transformed, np.ndarray)
    assert transformed.shape[0] == 100
    assert len(feature_names) == transformed.shape[1]


def test_preprocessor_unseen_category():
    df_train = generate_synthetic_data(num_samples=100, seed=42)
    preprocessor = DataPreprocessor()
    preprocessor.fit_transform(df_train)

    # Test with novel state/district
    df_test = df_train.iloc[:5].copy()
    df_test.loc[0, "state"] = "UnknownState"
    df_test.loc[0, "district"] = "UnknownDistrict"

    transformed_test = preprocessor.transform(df_test)
    assert transformed_test.shape[0] == 5
    assert not np.isnan(transformed_test).any()
