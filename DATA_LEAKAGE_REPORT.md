# TerraTech - Data Leakage Prevention Report

> **CRITICAL ARCHITECTURAL DIRECTIVE**
> 
> "Do not allow future or post-outcome information to enter the feature matrix when training predictive early-warning models. Predictive features must strictly represent information available at or before the inference observation window."

---

## 1. Temporal Horizon Analysis

In predictive early-warning systems for land acquisition, data leakage occurs when an algorithm is trained on features that encapsulate the outcome itself or are recorded chronologically *after* the delay has occurred.

```
TIME ────────────────────────────────────────────────────────────────────────►
[Phase 1: Project Setup] ──► [Phase 2: Statutory Workflow] ──► [Phase 3: Outcome Realized]
- Project Type               - Notification Status (Sec 11/19)  - Actual Handover Date
- Location (State/District)  - Compensation Disbursement Stage  - Realized Delay Days
- Initial Survey (Acres)     - Legal Petitions Filed            - Delay Status (0 or 1)
- Initial Family Count       - Administrative Processing Time
                             - R&R Delivery Progress
                             
▲                                                               ▲
└────────────── SAFE PREDICTIVE HORIZON ───────────────────────┘── UNSAFE LEAKAGE
```

---

## 2. Categorization of All Dataset Variables

### A. Safe Predictive Features (Allowed in `ml_dataset.csv`)
These variables represent characteristics, administrative stages, and operational progress known while the acquisition is underway:

| Variable | Availability Phase | Operational Justification |
|----------|--------------------|----------------------------|
| `project_type` | Inception | Intrinsic project sector (e.g., Expressway vs. Solar). |
| `state` | Inception | State administrative jurisdiction. |
| `district` | Inception | Local revenue authority jurisdiction. |
| `land_area_acres` | Inception / Sec 11 | Surveyed plot dimensions. |
| `affected_families` | Sec 11 / SIA | Enumerated families requiring resettlement. |
| `ownership_complexity` | Verification | Legal status of title deeds and joint holdings. |
| `documentation_completeness`| Active Process | Share of cleared revenue records to date. |
| `legal_dispute` | Active Process | Presence of active court stay or lawsuit. |
| `compensation_status` | Sec 23 Milestone | Current compensation disbursement tranche. |
| `compensation_pending_days`| Active Process | Elapsed days awaiting disbursement. |
| `notification_status` | Statutory Stage | Gazette notification milestone under RFCTLARR. |
| `approval_status` | Clearance Stage | Status of clearances (Forest, Wildlife, Collector). |
| `approval_processing_days` | Active Process | Days spent in clearance scrutiny. |
| `rehabilitation_progress` | Active Process | R&R milestone completion ratio. |
| `possession_status` | Physical Stage | Physical site handover stage. |
| `stakeholder_responsiveness`| Community Stage | Engagement level of local landowners. |
| `administrative_processing_days`| Revenue Stage | Processing time consumed by revenue machinery. |
| `historical_delay_rate` | Prior History | Historical track record of district/sector. |
| `planned_duration_days` | Baseline Schedule | Contractual timeline from start to planned date. |
| `family_density_per_acre`| Derived Early | Ratio of PAFs to land area. |
| `land_per_family` | Derived Early | Inverse density. |
| `composite_risk_proxy` | Derived Early | Weighted operational friction indicator. |

---

### B. Potentially Unsafe / Borderline Features
Variables that must be handled with strict contextual controls:

1. **`possession_status`**:
   - *Risk*: If "Full Possession" has already occurred, the acquisition has reached its terminal state.
   - *Policy*: Safe for training when modeling intermediate parcels; during live deployment on ongoing acquisitions, parcels with "Full Possession" are flagged as completed and bypassed by the early-warning model.
2. **`administrative_processing_days`**:
   - *Risk*: If measured after project completion, it reflects total duration rather than interim duration.
   - *Policy*: For in-flight predictions, this is clipped at the snapshot date. In our ML dataset, this represents elapsed days as of the audit checkpoint.

---

### C. Target Variables (Isolated from Predictive Features)
1. **`delay_status`**:
   - The primary supervised classification target.
   - Retained *only* as the prediction label column (`y`) in `ml_dataset.csv`.
   - Never included in the input feature matrix (`X`).
2. **`delay_days`**:
   - The primary continuous regression target.
   - Retained as a secondary ground-truth label in `ml_dataset.csv`.
   - Must never be provided as an input feature for `delay_status` classification.

---

### D. Strictly Excluded Leakage Features (Prohibited from ML Matrix)
The following fields are strictly excluded from the ML feature matrix:

| Prohibited Feature | Reason for Absolute Exclusion |
|--------------------|-------------------------------|
| `actual_completion_date` | Directly reveals the exact completion timestamp. In a live early-warning setting, this date is unknown. Using this feature causes near-100% artificial accuracy and catastrophic failure on unseen ongoing projects. |
| `delay_days` (as input) | Directly encodes the outcome duration; using it to predict `delay_status` constitutes trivial circular reasoning (\(\text{delay\_days} > 90 \implies \text{delayed}\)). |
| `project_name` | High-cardinality descriptive string containing idiosyncratic names; excluded to prevent overfitting. |
| `parcel_id`, `project_id` | Unique primary keys that carry no generalizable predictive signal; retained only as index identifiers, not model inputs. |

---

## 3. Automated Leakage Prevention Enforcement

The feature engineering pipeline (`data_pipeline/feature_engineering.py`) automatically enforces leakage isolation through programmatic assertion:

```python
# Programmatic leakage guardrail
assert "actual_completion_date" not in ml_features.columns, "CRITICAL: actual_completion_date leaked into ML features!"
assert "delay_days" not in predictor_columns, "CRITICAL: delay_days leaked into predictive feature matrix!"
```

The resulting `data/processed/ml_dataset.csv` contains only vetted safe predictors, indexed by `parcel_id` and accompanied by isolated ground truth targets (`delay_status`, `delay_days`).
