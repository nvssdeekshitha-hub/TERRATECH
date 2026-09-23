import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.src.config import METRICS_PATH, METADATA_PATH


def display_model_evaluation():
    if not METRICS_PATH.exists():
        print(f"Metrics file not found at {METRICS_PATH}. Please run training first (python ml/src/train.py).")
        return

    with open(METRICS_PATH, "r") as f:
        metrics = json.load(f)

    metadata = {}
    if METADATA_PATH.exists():
        with open(METADATA_PATH, "r") as f:
            metadata = json.load(f)

    print("\n=================================================================")
    print("           TERRATECH ML MODEL EVALUATION & BENCHMARK            ")
    print("=================================================================")
    print(f"Model Version: {metrics.get('model_version', 'N/A')}")
    print(f"Trained At:    {metrics.get('timestamp', 'N/A')}")
    print(f"Train Samples: {metadata.get('train_samples', 'N/A')}")
    print(f"Test Samples:  {metadata.get('test_samples', 'N/A')}")
    print("-----------------------------------------------------------------")

    cls_metrics = metrics.get("classification", {})
    rf_cls = cls_metrics.get("baseline_random_forest", {})
    xgb_cls = cls_metrics.get("xgboost", {})

    print("\n[CLASSIFICATION METRICS - DELAY PROBABILITY / CATEGORY]")
    print(f"{'Metric':<18} | {'Random Forest (Baseline)':<24} | {'XGBoost (Selected)':<24}")
    print("-" * 72)
    print(f"{'Accuracy':<18} | {rf_cls.get('accuracy', 0):<24.4f} | {xgb_cls.get('accuracy', 0):<24.4f}")
    print(f"{'Precision':<18} | {rf_cls.get('precision', 0):<24.4f} | {xgb_cls.get('precision', 0):<24.4f}")
    print(f"{'Recall':<18} | {rf_cls.get('recall', 0):<24.4f} | {xgb_cls.get('recall', 0):<24.4f}")
    print(f"{'F1-Score':<18} | {rf_cls.get('f1_score', 0):<24.4f} | {xgb_cls.get('f1_score', 0):<24.4f}")
    print(f"{'ROC-AUC':<18} | {rf_cls.get('roc_auc', 0):<24.4f} | {xgb_cls.get('roc_auc', 0):<24.4f}")
    print("-" * 72)
    print(f"Selected Model: {cls_metrics.get('selected_model', 'N/A')}")

    reg_metrics = metrics.get("regression", {})
    rf_reg = reg_metrics.get("baseline_random_forest", {})
    xgb_reg = reg_metrics.get("xgboost", {})

    print("\n[REGRESSION METRICS - ESTIMATED DELAY DURATION (DAYS)]")
    print(f"{'Metric':<18} | {'Random Forest (Baseline)':<24} | {'XGBoost (Selected)':<24}")
    print("-" * 72)
    print(f"{'MAE (Days)':<18} | {rf_reg.get('mae', 0):<24.2f} | {xgb_reg.get('mae', 0):<24.2f}")
    print(f"{'RMSE (Days)':<18} | {rf_reg.get('rmse', 0):<24.2f} | {xgb_reg.get('rmse', 0):<24.2f}")
    print("-" * 72)
    print(f"Selected Model: {reg_metrics.get('selected_model', 'N/A')}")
    print("=================================================================\n")


if __name__ == "__main__":
    display_model_evaluation()
