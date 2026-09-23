# TerraTech - ML Feature Data Dictionary

This document defines the schema of `data/processed/ml_dataset.csv`, engineered specifically for Member 1 (ML / AI) and Member 5 (XAI / SHAP).

---

## Output Feature Catalog

| Feature | Type | Meaning | Source Column | Transformation |
|---------|------|---------|---------------|----------------|
| `parcel_id` | Identifier | Unique parcel primary key for joins and indexing. | `parcel_id` | Direct passthrough |
| `project_id` | Identifier | Parent project identifier. | `project_id` | Direct passthrough |
| `state` | Categorical | Indian state revenue jurisdiction. | `state` | Normalized casing |
| `district` | Categorical | Administrative district authority. | `district` | Normalized casing |
| `latitude` | Float | WGS84 latitude coordinate for spatial modeling. | `latitude` | District-centroid imputed |
| `longitude` | Float | WGS84 longitude coordinate for spatial modeling. | `longitude` | District-centroid imputed |
| `project_type` | Categorical | Infrastructure sector classification. | `project_type` | Standardized enum |
| `land_area_acres` | Float | Total parcel land area in acres. | `land_area_acres` | Rounded to 2 decimals |
| `affected_families` | Integer | Count of Project Affected Families (PAFs). | `affected_families` | Density-imputed integer |
| `affected_family_density` | Float | Project Affected Families per acre. | `affected_families, land_area_acres` | affected_families / land_area_acres |
| `land_area_per_family` | Float | Acres of land per affected family. | `land_area_acres, affected_families` | land_area_acres / PAFs |
| `documentation_completeness_pct` | Float | Percentage of revenue & title records verified. | `documentation_completeness` | documentation_completeness * 100 |
| `rehabilitation_progress_pct` | Float | Percentage of R&R entitlements disbursed. | `rehabilitation_progress` | rehabilitation_progress * 100 |
| `legal_dispute_indicator` | Integer | Binary flag: 1 if active civil/court litigation exists, 0 otherwise. | `legal_dispute` | Binary cast int(0/1) |
| `compensation_pending_days` | Integer | Elapsed days since award declaration without compensation. | `compensation_pending_days` | Integer verification |
| `approval_processing_days` | Integer | Total days spent in clearance scrutiny. | `approval_processing_days` | Integer verification |
| `approval_delay_days` | Integer | Surplus days beyond 60-day statutory scrutiny benchmark. | `approval_processing_days` | max(0, approval_processing_days - 60) |
| `administrative_processing_days` | Integer | Elapsed days spent in revenue office processing. | `administrative_processing_days` | Integer verification |
| `historical_delay_rate` | Float | Historical delay probability for district/sector. | `historical_delay_rate` | Clipped [0.0, 1.0] |
| `compensation_status` | Categorical | Current compensation disbursement milestone. | `compensation_status` | Standardized enum |
| `notification_status` | Categorical | Gazette notification stage under RFCTLARR Act 2013. | `notification_status` | Standardized enum |
| `approval_status` | Categorical | Statutory clearance review status. | `approval_status` | Standardized enum |
| `possession_status` | Categorical | Physical land possession handover tier. | `possession_status` | Standardized enum |
| `stakeholder_responsiveness` | Categorical | Community and landowner engagement level. | `stakeholder_responsiveness` | Standardized enum |
| `ownership_complexity` | Categorical | Degree of title subdivision and disputed shares. | `ownership_complexity` | Standardized enum |
| `ownership_complexity_score` | Integer (Ordinal) | Ordinal encoding: 1=Low, 2=Medium, 3=High, 4=Very High. | `ownership_complexity` | Categorical mapping |
| `stakeholder_response_score` | Integer (Ordinal) | Ordinal encoding: 1=Hostile, 2=Low, 3=Moderate, 4=High. | `stakeholder_responsiveness` | Categorical mapping |
| `possession_progress_score` | Integer (Ordinal) | Ordinal encoding: 1=Contested, 2=<30%, 3=30-70%, 4=>70%, 5=Full. | `possession_status` | Categorical mapping |
| `operational_friction_index` | Float | Baseline composite risk index [0-100] reflecting operational drag. | `Multi-source operational metrics` | Weighted multi-attribute friction formula |
| `target_delay_status` | Integer (Binary Target) | PRIMARY TARGET: 1 = Delayed (> 90 days), 0 = No Significant Delay. | `delay_status` | Ground truth target (X-matrix exclusion) |
| `target_delay_days` | Integer (Regression Target) | SECONDARY TARGET: Realized delay duration in calendar days. | `delay_days` | Ground truth target (X-matrix exclusion) |

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
