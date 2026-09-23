import pytest
import pandas as pd
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.src.data_generator import generate_synthetic_data
from ml.src.config import ALL_FEATURES, CLASSIFICATION_TARGET, REGRESSION_TARGET


def test_data_generation_columns_and_rows():
    df = generate_synthetic_data(num_samples=100, seed=42)
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 100
    
    # Verify all input features and targets exist
    for col in ALL_FEATURES + [CLASSIFICATION_TARGET, REGRESSION_TARGET]:
        assert col in df.columns, f"Missing column: {col}"


def test_data_generation_reproducibility():
    df1 = generate_synthetic_data(num_samples=50, seed=42)
    df2 = generate_synthetic_data(num_samples=50, seed=42)
    pd.testing.assert_frame_equal(df1, df2)


def test_data_generation_ranges():
    df = generate_synthetic_data(num_samples=200, seed=42)
    assert df["is_delayed"].isin([0, 1]).all()
    assert (df["delay_duration_days"] >= 0).all()
    assert (df["ownership_complexity"].between(0, 1)).all()
    assert (df["legal_dispute"].isin([0, 1])).all()
