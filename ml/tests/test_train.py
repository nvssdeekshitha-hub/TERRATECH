import pytest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.src.train import train_models
from ml.src.config import (
    CLASSIFIER_MODEL_PATH,
    REGRESSOR_MODEL_PATH,
    PREPROCESSOR_PATH,
    METRICS_PATH,
    METADATA_PATH
)


def test_model_training_pipeline(tmp_path):
    temp_csv = tmp_path / "test_data.csv"
    metrics, metadata = train_models(data_path=temp_csv)

    assert CLASSIFIER_MODEL_PATH.exists()
    assert REGRESSOR_MODEL_PATH.exists()
    assert PREPROCESSOR_PATH.exists()
    assert METRICS_PATH.exists()
    assert METADATA_PATH.exists()

    assert "classification" in metrics
    assert "regression" in metrics
    assert metrics["classification"]["selected_metrics"]["f1_score"] >= 0.0
    assert metrics["regression"]["selected_metrics"]["mae"] >= 0.0
