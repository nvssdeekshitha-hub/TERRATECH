"""
TerraTech - Feature Engineering Pipeline
Member 2: Data Engineering Layer

Transforms cleaned land-acquisition records into a reproducible, ML-ready dataset:
- Derives domain-specific density, duration, and progress metrics
- Applies ordinal mappings and standard categorical representations
- Formulates composite risk indices
- Strictly prevents data leakage by isolating targets and excluding future dates
- Exports data/processed/ml_dataset.csv and generates ML_DATA_DICTIONARY.md
"""

from pathlib import Path
import numpy as np
import pandas as pd

from config import (
    CLEANED_DATA_PATH,
    ML_DATASET_PATH,
    BASE_DIR,
    PROCESSED_DATA_DIR,
    RANDOM_SEED
)

def build_features(input_path=CLEANED_DATA_PATH, output_path=ML_DATASET_PATH):
    print(f"[FEATURE ENGINEERING] Reading cleaned data from: {input_path}")
    df = pd.read_csv(input_path)

    # 1. Verification of Safe Inputs
    # Leakage check: actual_completion_date must NEVER become a predictor
    if "actual_completion_date" in df.columns:
        print("[NOTICE] Isolating and excluding 'actual_completion_date' from feature matrix.")

    features = pd.DataFrame()

    # Identifiers (Retained for merging, indexing, and traceability)
    features["parcel_id"] = df["parcel_id"]
    features["project_id"] = df["project_id"]

    # Geographical Features (Preserved for GIS integration and spatial clustering)
    features["state"] = df["state"]
    features["district"] = df["district"]
    features["latitude"] = df["latitude"]
    features["longitude"] = df["longitude"]

    # Project Sector & Scale
    features["project_type"] = df["project_type"]
    features["land_area_acres"] = df["land_area_acres"]
    features["affected_families"] = df["affected_families"]

    # Derived Density & Intensity Metrics
    features["affected_family_density"] = (df["affected_families"] / df["land_area_acres"]).round(4)
    features["land_area_per_family"] = (df["land_area_acres"] / (df["affected_families"] + 0.001)).round(4)

    # Statutory & Documentation Progress
    features["documentation_completeness_pct"] = (df["documentation_completeness"] * 100.0).round(2)
    features["rehabilitation_progress_pct"] = (df["rehabilitation_progress"] * 100.0).round(2)
    features["legal_dispute_indicator"] = df["legal_dispute"].astype(int)

    # Timeline & Duration Features
    features["compensation_pending_days"] = df["compensation_pending_days"]
    features["approval_processing_days"] = df["approval_processing_days"]
    # Baseline statutory clearance target is 60 days; surplus represents statutory approval delay
    features["approval_delay_days"] = df["approval_processing_days"].apply(lambda x: max(0, x - 60))
    features["administrative_processing_days"] = df["administrative_processing_days"]
    features["historical_delay_rate"] = df["historical_delay_rate"].round(3)

    # Categorical Status Fields
    features["compensation_status"] = df["compensation_status"]
    features["notification_status"] = df["notification_status"]
    features["approval_status"] = df["approval_status"]
    features["possession_status"] = df["possession_status"]
    features["stakeholder_responsiveness"] = df["stakeholder_responsiveness"]
    features["ownership_complexity"] = df["ownership_complexity"]

    # Ordinal Numerical Encodings (Optimized for tree-based models like XGBoost/LightGBM)
    complexity_map = {"Low": 1, "Medium": 2, "High": 3, "Very High": 4}
    features["ownership_complexity_score"] = df["ownership_complexity"].map(complexity_map).fillna(2).astype(int)

    stakeholder_map = {
        "Hostile / Legal Injunction": 1,
        "Low / Resistant": 2,
        "Moderate": 3,
        "High / Cooperative": 4
    }
    features["stakeholder_response_score"] = df["stakeholder_responsiveness"].map(stakeholder_map).fillna(3).astype(int)

    possession_map = {
        "Contested / Encroached": 1,
        "Initial Stage (<30%)": 2,
        "Partial Possession (30-70%)": 3,
        "Substantial Possession (>70%)": 4,
        "Full Possession": 5
    }
    features["possession_progress_score"] = df["possession_status"].map(possession_map).fillna(3).astype(int)

    # Heuristic Operational Friction Score (0 to 100)
    # Provides a transparent baseline comparator for SHAP explainability benchmarking
    norm_comp_days = np.clip(df["compensation_pending_days"] / 365.0, 0, 1)
    norm_admin_days = np.clip(df["administrative_processing_days"] / 400.0, 0, 1)
    norm_doc_gap = 1.0 - df["documentation_completeness"]
    norm_rehab_gap = 1.0 - df["rehabilitation_progress"]
    
    friction = (
        0.25 * df["legal_dispute"]
        + 0.20 * norm_doc_gap
        + 0.15 * norm_comp_days
        + 0.15 * norm_admin_days
        + 0.15 * (1.0 - (features["stakeholder_response_score"] / 4.0))
        + 0.10 * norm_rehab_gap
    ) * 100.0
    features["operational_friction_index"] = friction.round(2)

    # Ground Truth Target Columns (Strictly segregated at the end of the schema)
    features["target_delay_status"] = df["delay_status"].astype(int)
    features["target_delay_days"] = df["delay_days"].astype(int)

    # Export Processed ML Dataset
    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    features.to_csv(output_path, index=False)
    print(f"[SUCCESS] Exported ML-ready dataset with {len(features)} rows and {features.shape[1]} columns to: {output_path}")

    # Generate ML_DATA_DICTIONARY.md
    generate_ml_data_dictionary(features)

    return features

def generate_ml_data_dictionary(df):
    dict_path = BASE_DIR / "ML_DATA_DICTIONARY.md"
    
    col_descriptions = {
        "parcel_id": ("Identifier", "Unique parcel primary key for joins and indexing.", "parcel_id", "Direct passthrough"),
        "project_id": ("Identifier", "Parent project identifier.", "project_id", "Direct passthrough"),
        "state": ("Categorical", "Indian state revenue jurisdiction.", "state", "Normalized casing"),
        "district": ("Categorical", "Administrative district authority.", "district", "Normalized casing"),
        "latitude": ("Float", "WGS84 latitude coordinate for spatial modeling.", "latitude", "District-centroid imputed"),
        "longitude": ("Float", "WGS84 longitude coordinate for spatial modeling.", "longitude", "District-centroid imputed"),
        "project_type": ("Categorical", "Infrastructure sector classification.", "project_type", "Standardized enum"),
        "land_area_acres": ("Float", "Total parcel land area in acres.", "land_area_acres", "Rounded to 2 decimals"),
        "affected_families": ("Integer", "Count of Project Affected Families (PAFs).", "affected_families", "Density-imputed integer"),
        "affected_family_density": ("Float", "Project Affected Families per acre.", "affected_families, land_area_acres", "affected_families / land_area_acres"),
        "land_area_per_family": ("Float", "Acres of land per affected family.", "land_area_acres, affected_families", "land_area_acres / PAFs"),
        "documentation_completeness_pct": ("Float", "Percentage of revenue & title records verified.", "documentation_completeness", "documentation_completeness * 100"),
        "rehabilitation_progress_pct": ("Float", "Percentage of R&R entitlements disbursed.", "rehabilitation_progress", "rehabilitation_progress * 100"),
        "legal_dispute_indicator": ("Integer", "Binary flag: 1 if active civil/court litigation exists, 0 otherwise.", "legal_dispute", "Binary cast int(0/1)"),
        "compensation_pending_days": ("Integer", "Elapsed days since award declaration without compensation.", "compensation_pending_days", "Integer verification"),
        "approval_processing_days": ("Integer", "Total days spent in clearance scrutiny.", "approval_processing_days", "Integer verification"),
        "approval_delay_days": ("Integer", "Surplus days beyond 60-day statutory scrutiny benchmark.", "approval_processing_days", "max(0, approval_processing_days - 60)"),
        "administrative_processing_days": ("Integer", "Elapsed days spent in revenue office processing.", "administrative_processing_days", "Integer verification"),
        "historical_delay_rate": ("Float", "Historical delay probability for district/sector.", "historical_delay_rate", "Clipped [0.0, 1.0]"),
        "compensation_status": ("Categorical", "Current compensation disbursement milestone.", "compensation_status", "Standardized enum"),
        "notification_status": ("Categorical", "Gazette notification stage under RFCTLARR Act 2013.", "notification_status", "Standardized enum"),
        "approval_status": ("Categorical", "Statutory clearance review status.", "approval_status", "Standardized enum"),
        "possession_status": ("Categorical", "Physical land possession handover tier.", "possession_status", "Standardized enum"),
        "stakeholder_responsiveness": ("Categorical", "Community and landowner engagement level.", "stakeholder_responsiveness", "Standardized enum"),
        "ownership_complexity": ("Categorical", "Degree of title subdivision and disputed shares.", "ownership_complexity", "Standardized enum"),
        "ownership_complexity_score": ("Integer (Ordinal)", "Ordinal encoding: 1=Low, 2=Medium, 3=High, 4=Very High.", "ownership_complexity", "Categorical mapping"),
        "stakeholder_response_score": ("Integer (Ordinal)", "Ordinal encoding: 1=Hostile, 2=Low, 3=Moderate, 4=High.", "stakeholder_responsiveness", "Categorical mapping"),
        "possession_progress_score": ("Integer (Ordinal)", "Ordinal encoding: 1=Contested, 2=<30%, 3=30-70%, 4=>70%, 5=Full.", "possession_status", "Categorical mapping"),
        "operational_friction_index": ("Float", "Baseline composite risk index [0-100] reflecting operational drag.", "Multi-source operational metrics", "Weighted multi-attribute friction formula"),
        "target_delay_status": ("Integer (Binary Target)", "PRIMARY TARGET: 1 = Delayed (> 90 days), 0 = No Significant Delay.", "delay_status", "Ground truth target (X-matrix exclusion)"),
        "target_delay_days": ("Integer (Regression Target)", "SECONDARY TARGET: Realized delay duration in calendar days.", "delay_days", "Ground truth target (X-matrix exclusion)")
    }

    md_content = """# TerraTech - ML Feature Data Dictionary

This document defines the schema of `data/processed/ml_dataset.csv`, engineered specifically for Member 1 (ML / AI) and Member 5 (XAI / SHAP).

---

## Output Feature Catalog

| Feature | Type | Meaning | Source Column | Transformation |
|---------|------|---------|---------------|----------------|
"""
    for col in df.columns:
        if col in col_descriptions:
            ftype, meaning, src, trans = col_descriptions[col]
            md_content += f"| `{col}` | {ftype} | {meaning} | `{src}` | {trans} |\n"
        else:
            md_content += f"| `{col}` | {df[col].dtype} | Model attribute | `{col}` | Direct passthrough |\n"

    md_content += """
---

## Strict Rules for Member 1 (ML / AI) Consumption

1. **Features Matrix (`X`)**:
   - Use all features from `state` through `operational_friction_index`.
   - Categorical columns (`project_type`, `state`, `district`, `compensation_status`, `notification_status`, `approval_status`, `possession_status`, `stakeholder_responsiveness`, `ownership_complexity`) can be one-hot encoded or passed to native categorical handlers in XGBoost/LightGBM/CatBoost.
   - Ordinal columns (`ownership_complexity_score`, `stakeholder_response_score`, `possession_progress_score`) are pre-encoded for direct tree splits.
2. **Ground Truth Labels (`y`)**:
   - For classification: `y = df['target_delay_status']`
   - For regression: `y = df['target_delay_days']`
3. **Identifiers**:
   - Retain `parcel_id` and `project_id` as non-training index columns to merge predictions back into database seed files and GIS tables.
4. **Leakage Safeguard**:
   - Neither `actual_completion_date` nor `target_delay_days` is present among predictor columns in `X`.
"""

    with open(dict_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"[SUCCESS] Saved ML Data Dictionary to {dict_path}")

if __name__ == "__main__":
    build_features()
