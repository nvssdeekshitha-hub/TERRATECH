import json
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Tuple
import sys

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    mean_absolute_error,
    mean_squared_error
)

from xgboost import XGBClassifier, XGBRegressor

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.src.config import (
    RAW_DATA_PATH,
    CLASSIFIER_MODEL_PATH,
    REGRESSOR_MODEL_PATH,
    PREPROCESSOR_PATH,
    METADATA_PATH,
    METRICS_PATH,
    CLASSIFICATION_TARGET,
    REGRESSION_TARGET,
    ALL_FEATURES,
    SEED,
    MODEL_VERSION
)
from ml.src.data_generator import generate_synthetic_data
from ml.src.preprocess import DataPreprocessor


def calculate_classification_metrics(y_true: np.ndarray, y_pred: np.ndarray, y_prob: np.ndarray) -> Dict[str, float]:
    return {
        "accuracy": round(float(accuracy_score(y_true, y_pred)), 4),
        "precision": round(float(precision_score(y_true, y_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_true, y_pred, zero_division=0)), 4),
        "f1_score": round(float(f1_score(y_true, y_pred, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_true, y_prob)), 4)
    }


def calculate_regression_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    return {
        "mae": round(float(mae), 2),
        "rmse": round(float(rmse), 2)
    }


def train_models(data_path: Path = RAW_DATA_PATH) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """
    Loads dataset, performs 80/20 train/test split, trains Random Forest baseline and XGBoost models,
    evaluates both, selects best models, and persists artifacts.
    """
    if not data_path.exists():
        print(f"Dataset not found at {data_path}. Generating synthetic data...")
        df = generate_synthetic_data(num_samples=3000, seed=SEED)
        df.to_csv(data_path, index=False)
    else:
        df = pd.read_csv(data_path)

    print(f"Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns.")

    X = df[ALL_FEATURES]
    y_cls = df[CLASSIFICATION_TARGET]
    y_reg = df[REGRESSION_TARGET]

    # Train/Test Split (80/20)
    X_train, X_test, y_cls_train, y_cls_test, y_reg_train, y_reg_test = train_test_split(
        X, y_cls, y_reg, test_size=0.20, random_state=SEED, stratify=y_cls
    )

    # Preprocessing
    preprocessor = DataPreprocessor()
    X_train_transformed, feature_names = preprocessor.fit_transform(X_train)
    X_test_transformed = preprocessor.transform(X_test)
    preprocessor.save(PREPROCESSOR_PATH)

    print("\n--- Training Classification Models ---")
    # 1. Baseline Random Forest Classifier
    rf_cls = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=SEED)
    rf_cls.fit(X_train_transformed, y_cls_train)
    rf_cls_pred = rf_cls.predict(X_test_transformed)
    rf_cls_prob = rf_cls.predict_proba(X_test_transformed)[:, 1]
    rf_cls_metrics = calculate_classification_metrics(y_cls_test, rf_cls_pred, rf_cls_prob)
    print(f"Random Forest Classifier Metrics: {rf_cls_metrics}")

    # 2. XGBoost Classifier
    xgb_cls = XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.08,
        random_state=SEED,
        eval_metric="logloss"
    )
    xgb_cls.fit(X_train_transformed, y_cls_train)
    xgb_cls_pred = xgb_cls.predict(X_test_transformed)
    xgb_cls_prob = xgb_cls.predict_proba(X_test_transformed)[:, 1]
    xgb_cls_metrics = calculate_classification_metrics(y_cls_test, xgb_cls_pred, xgb_cls_prob)
    print(f"XGBoost Classifier Metrics:       {xgb_cls_metrics}")

    print("\n--- Training Regression Models ---")
    # 1. Baseline Random Forest Regressor
    rf_reg = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=SEED)
    rf_reg.fit(X_train_transformed, y_reg_train)
    rf_reg_pred = np.maximum(0, rf_reg.predict(X_test_transformed))
    rf_reg_metrics = calculate_regression_metrics(y_reg_test, rf_reg_pred)
    print(f"Random Forest Regressor Metrics: {rf_reg_metrics}")

    # 2. XGBoost Regressor
    xgb_reg = XGBRegressor(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.08,
        random_state=SEED
    )
    xgb_reg.fit(X_train_transformed, y_reg_train)
    xgb_reg_pred = np.maximum(0, xgb_reg.predict(X_test_transformed))
    xgb_reg_metrics = calculate_regression_metrics(y_reg_test, xgb_reg_pred)
    print(f"XGBoost Regressor Metrics:       {xgb_reg_metrics}")

    # Select Best Classifier based on F1-score & ROC-AUC
    if xgb_cls_metrics["f1_score"] >= rf_cls_metrics["f1_score"]:
        best_cls_model = xgb_cls
        best_cls_name = "XGBoost Classifier"
        best_cls_metrics = xgb_cls_metrics
    else:
        best_cls_model = rf_cls
        best_cls_name = "Random Forest Classifier"
        best_cls_metrics = rf_cls_metrics

    # Select Best Regressor based on lowest MAE
    if xgb_reg_metrics["mae"] <= rf_reg_metrics["mae"]:
        best_reg_model = xgb_reg
        best_reg_name = "XGBoost Regressor"
        best_reg_metrics = xgb_reg_metrics
    else:
        best_reg_model = rf_reg
        best_reg_name = "Random Forest Regressor"
        best_reg_metrics = rf_reg_metrics

    print(f"\nSelected Best Classifier: {best_cls_name}")
    print(f"Selected Best Regressor:  {best_reg_name}")

    # Save Best Model Artifacts
    joblib.dump(best_cls_model, CLASSIFIER_MODEL_PATH)
    joblib.dump(best_reg_model, REGRESSOR_MODEL_PATH)
    print(f"Saved classifier artifact to: {CLASSIFIER_MODEL_PATH}")
    print(f"Saved regressor artifact to:  {REGRESSOR_MODEL_PATH}")

    # Save Comparison Metrics JSON
    all_metrics = {
        "timestamp": datetime.now().isoformat(),
        "model_version": MODEL_VERSION,
        "classification": {
            "baseline_random_forest": rf_cls_metrics,
            "xgboost": xgb_cls_metrics,
            "selected_model": best_cls_name,
            "selected_metrics": best_cls_metrics
        },
        "regression": {
            "baseline_random_forest": rf_reg_metrics,
            "xgboost": xgb_reg_metrics,
            "selected_model": best_reg_name,
            "selected_metrics": best_reg_metrics
        }
    }
    with open(METRICS_PATH, "w") as f:
        json.dump(all_metrics, f, indent=2)
    print(f"Saved metrics comparison to: {METRICS_PATH}")

    # Save Metadata JSON
    metadata = {
        "model_version": MODEL_VERSION,
        "trained_at": datetime.now().isoformat(),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "selected_classifier": best_cls_name,
        "selected_regressor": best_reg_name,
        "feature_count": len(feature_names),
        "feature_names": feature_names,
        "raw_features": ALL_FEATURES,
        "seed": SEED
    }
    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved metadata to:           {METADATA_PATH}")

    return all_metrics, metadata


if __name__ == "__main__":
    train_models()
