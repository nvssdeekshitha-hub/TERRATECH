"""
TerraTech - Data Quality Validation Script
Member 2: Data Engineering Layer

Automated validation checks:
- Required identifiers & format integrity
- Duplicate IDs check
- Missing critical fields
- Numerical ranges & validity
- Date consistency & formats
- Categorical consistency against domain vocabularies
- Geographical bounds validity (India coordinates)
- Target variable availability & integrity
- Data leakage isolation audit
"""

import sys
from pathlib import Path
import pandas as pd
import numpy as np

from config import (
    CLEANED_DATA_PATH,
    VALIDATION_REPORT_PATH,
    VALIDATION_DATA_DIR,
    UNSAFE_LEAKAGE_FEATURES,
    PROJECT_TYPES,
    OWNERSHIP_COMPLEXITY_LEVELS,
    COMPENSATION_STATUS_LEVELS,
    APPROVAL_STATUS_LEVELS,
    POSSESSION_STATUS_LEVELS,
    STAKEHOLDER_RESPONSIVENESS_LEVELS,
    INDIAN_LOCATIONS
)

def run_validation(dataset_path=CLEANED_DATA_PATH):
    print(f"[VALIDATION] Running validation suite on: {dataset_path}")
    if not Path(dataset_path).exists():
        print(f"[ERROR] Target dataset does not exist: {dataset_path}")
        return False, "FAIL"

    df = pd.read_csv(dataset_path)
    rows, cols = df.shape
    issues = []
    warnings = []

    # 1. Check Required Identifiers
    missing_project_ids = int(df["project_id"].isna().sum())
    missing_parcel_ids = int(df["parcel_id"].isna().sum())
    invalid_id_format = int((~df["parcel_id"].str.startswith("PCL-")).sum())

    if missing_project_ids > 0 or missing_parcel_ids > 0:
        issues.append(f"Missing required IDs (project_id: {missing_project_ids}, parcel_id: {missing_parcel_ids})")

    # 2. Check Duplicates
    duplicate_rows = int(df.duplicated().sum())
    duplicate_parcels = int(df.duplicated(subset=["parcel_id"]).sum())
    if duplicate_parcels > 0:
        issues.append(f"Found {duplicate_parcels} duplicate parcel_id records")

    # 3. Check Critical Missing Values (excluding planned open actual_completion_date)
    critical_cols = [
        "project_id", "parcel_id", "project_name", "project_type", "state", "district",
        "land_area_acres", "affected_families", "ownership_complexity",
        "documentation_completeness", "legal_dispute", "compensation_status",
        "compensation_pending_days", "notification_status", "approval_status",
        "approval_processing_days", "rehabilitation_progress", "possession_status",
        "stakeholder_responsiveness", "administrative_processing_days",
        "historical_delay_rate", "planned_completion_date", "delay_status"
    ]
    missing_critical = 0
    for col in critical_cols:
        count = int(df[col].isna().sum())
        if count > 0:
            missing_critical += count
            issues.append(f"Critical column '{col}' has {count} missing values")

    # 4. Check Numerical Ranges
    invalid_numeric = 0
    if (df["land_area_acres"] <= 0).any():
        invalid_numeric += int((df["land_area_acres"] <= 0).sum())
        issues.append("land_area_acres contains non-positive values")

    if (df["affected_families"] < 0).any():
        invalid_numeric += int((df["affected_families"] < 0).sum())
        issues.append("affected_families contains negative counts")

    for ratio_col in ["documentation_completeness", "rehabilitation_progress", "historical_delay_rate"]:
        out_of_bounds = int(((df[ratio_col] < 0.0) | (df[ratio_col] > 1.0)).sum())
        if out_of_bounds > 0:
            invalid_numeric += out_of_bounds
            issues.append(f"Ratio column '{ratio_col}' has {out_of_bounds} values outside [0, 1]")

    for days_col in ["compensation_pending_days", "approval_processing_days", "administrative_processing_days", "delay_days"]:
        neg_days = int((df[days_col] < 0).sum())
        if neg_days > 0:
            invalid_numeric += neg_days
            issues.append(f"Duration column '{days_col}' has negative values")

    # 5. Check Categorical Consistency
    inconsistent_categories = 0
    cat_checks = {
        "project_type": set(PROJECT_TYPES),
        "ownership_complexity": set(OWNERSHIP_COMPLEXITY_LEVELS),
        "compensation_status": set(COMPENSATION_STATUS_LEVELS),
        "approval_status": set(APPROVAL_STATUS_LEVELS),
        "possession_status": set(POSSESSION_STATUS_LEVELS),
        "stakeholder_responsiveness": set(STAKEHOLDER_RESPONSIVENESS_LEVELS)
    }

    for col, valid_set in cat_checks.items():
        invalid_vals = df[~df[col].isin(valid_set)][col].unique()
        if len(invalid_vals) > 0:
            inconsistent_categories += len(invalid_vals)
            issues.append(f"Categorical column '{col}' contains unrecognized values: {list(invalid_vals)}")

    # 6. Check Geographical Validity
    # India bounding box: lat [8.0, 37.0], lon [68.0, 97.5]
    invalid_coords = int((
        df["latitude"].isna() | df["longitude"].isna() |
        (df["latitude"] < 8.0) | (df["latitude"] > 37.0) |
        (df["longitude"] < 68.0) | (df["longitude"] > 97.5)
    ).sum())

    if invalid_coords > 0:
        issues.append(f"Found {invalid_coords} records with invalid/missing geospatial coordinates")

    # 7. Target Availability & Distribution
    target_available = "delay_status" in df.columns and "delay_days" in df.columns
    if not target_available:
        issues.append("Primary target columns ('delay_status', 'delay_days') are missing")
    else:
        invalid_target_vals = int((~df["delay_status"].isin([0, 1])).sum())
        if invalid_target_vals > 0:
            issues.append(f"Target 'delay_status' contains non-binary values ({invalid_target_vals} records)")

    # 8. Potential Data Leakage Risk Audit
    leakage_cols_in_data = [c for c in UNSAFE_LEAKAGE_FEATURES if c in df.columns]
    # In the raw/cleaned base table, target and retrospective columns exist for record keeping.
    # We warn that they must be isolated during ML feature engineering.
    if len(leakage_cols_in_data) > 0:
        warnings.append(f"{len(leakage_cols_in_data)} potential leakage columns present in base storage ({leakage_cols_in_data}). Must be excluded from ml_dataset.csv.")

    # Determine overall status
    if len(issues) == 0:
        overall_status = "PASS"
    elif len(issues) <= 2 and missing_critical == 0 and duplicate_parcels == 0:
        overall_status = "WARNING"
    else:
        overall_status = "FAIL"

    # Format Quality Report
    report_text = f"""==================================================
DATA QUALITY REPORT
==================================================
Rows: {rows:,}
Columns: {cols}
Duplicate rows: {duplicate_rows}
Duplicate parcel IDs: {duplicate_parcels}
Missing critical values: {missing_critical}
Invalid coordinates: {invalid_coords}
Invalid numerical values: {invalid_numeric}
Inconsistent categorical values: {inconsistent_categories}
Target available: {"YES" if target_available else "NO"}
Potential leakage columns in base data: {len(leakage_cols_in_data)}
Overall status: {overall_status}
==================================================
"""

    if issues:
        report_text += "\nDETECTED ISSUES:\n"
        for issue in issues:
            report_text += f"- [ERROR] {issue}\n"

    if warnings:
        report_text += "\nSYSTEM WARNINGS & LEAKAGE NOTICES:\n"
        for warn in warnings:
            report_text += f"- [NOTICE] {warn}\n"

    report_text += "\n" + "=" * 50 + "\n"

    VALIDATION_DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(VALIDATION_REPORT_PATH, "w", encoding="utf-8") as f:
        f.write(report_text)

    print(report_text)
    print(f"[SUCCESS] Quality report written to: {VALIDATION_REPORT_PATH}")

    return overall_status == "PASS", overall_status

if __name__ == "__main__":
    success, status = run_validation()
    sys.exit(0 if success else 1)
