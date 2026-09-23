# TerraTech — Data Engineering Layer (Member 2)

Welcome to the **Data Engineering & Preparation Layer** for **TerraTech** — the AI-powered predictive analytics platform for detecting and preventing land acquisition delays.

This module provides a reproducible, validated, and leak-proof data pipeline that ingests raw/sample land acquisition records and produces clean, feature-engineered datasets for Machine Learning (Member 1), GIS Spatial Mapping (Member 3), and PostgreSQL/PostGIS Database Seeding (Member 4).

---

## 1. Directory Structure

```
.
├── DATA_CLEANING_REPORT.md       # Detailed audit of cleaning operations & affected rows
├── DATA_CONTRACT.md              # Immutable cross-team data interface definition
├── DATA_DICTIONARY.md            # Raw & sample column catalog
├── DATA_LEAKAGE_REPORT.md        # Safe vs. unsafe feature classification & audit
├── ML_DATA_DICTIONARY.md         # Schema of final ML dataset (ml_dataset.csv)
├── README.md                     # This primary execution manual
├── SYNTHETIC_DATASET_README.md   # Legal notice & synthetic generation specification
├── TARGET_ANALYSIS.md            # Analysis of delay_status and delay_days targets
│
├── data/
│   ├── raw/                      # Target directory for real government datasets
│   ├── sample/
│   │   └── terra_land_acquisition_synthetic.csv  # 2,500 realistic demonstration records
│   ├── processed/
│   │   ├── cleaned_land_acquisition.csv          # Cleaned & normalized dataset
│   │   └── ml_dataset.csv                        # ML-ready training feature matrix
│   └── validation/
│       ├── profiling_report.json                 # Machine-readable data profile
│       ├── profiling_report.md                   # Formatted statistical summary
│       └── quality_report.txt                    # Automated quality check output
│
├── data_pipeline/
│   ├── config.py                 # Central configuration, schemas & paths
│   ├── generate_sample.py        # Synthetic demonstration data generator
│   ├── profile_data.py           # Statistical profiling engine
│   ├── clean_data.py             # Data cleaning & imputation pipeline
│   ├── validate_data.py          # Quality test suite & assertions
│   ├── feature_engineering.py    # Feature extraction & leakage prevention
│   ├── export_data.py            # PostgreSQL / PostGIS seed generator
│   └── requirements.txt          # Python dependencies
│
└── database/
    └── seed_data/
        ├── projects_seed.csv     # Parent projects relational seed table
        ├── projects_seed.json    # JSON representation of projects
        ├── parcels_seed.csv      # Child parcels relational seed table (with PostGIS geom)
        ├── parcels_seed.json     # JSON representation of parcels
        └── schema_seed.sql       # DDL and SQL COPY commands for PostGIS
```

---

## 2. Where the Raw Dataset Goes
- When real official government land acquisition datasets become available, place the raw files directly inside:
  ```
  data/raw/
  ```
- **Rule**: Raw files in `data/raw/` are treated as immutable read-only records and are never modified or overwritten by any script.
- For prototype demonstration, the synthetic fallback dataset is placed at:
  ```
  data/sample/terra_land_acquisition_synthetic.csv
  ```

---

## 3. Environment Setup

Install the required Python packages:

```bash
pip install -r data_pipeline/requirements.txt
```

*(Tested on Python 3.11 with `pandas`, `numpy`, and `scikit-learn`)*.

---

## 4. How to Run the Pipeline (Step-by-Step Commands)

All scripts can be executed from the project root directory.

### Step 1: Generate Synthetic Demonstration Data (Fallback Mode)
If generating or refreshing the demonstration dataset:
```bash
python data_pipeline/generate_sample.py
```
*Output*: Generates 2,500 realistic records with realistic correlations across 10 Indian states at `data/sample/terra_land_acquisition_synthetic.csv`.

---

### Step 2: Run Data Profiling
Inspect statistical distributions, missing values, duplicates, and outliers:
```bash
python data_pipeline/profile_data.py
```
*Outputs*:
- `data/validation/profiling_report.json`
- `data/validation/profiling_report.md`

---

### Step 3: Clean the Dataset
Deduplicate, impute missing values, standardize text casing, and enforce constraints:
```bash
python data_pipeline/clean_data.py
```
*Outputs*:
- `data/processed/cleaned_land_acquisition.csv`
- `DATA_CLEANING_REPORT.md`

---

### Step 4: Validate Data Quality
Execute automated test assertions verifying data integrity, boundaries, and leakage guards:
```bash
python data_pipeline/validate_data.py
```
*Output*: Generates `data/validation/quality_report.txt` and exits with code `0` on `PASS` or `1` on `FAIL`.

---

### Step 5: Engineer ML Features & Generate ML Dataset
Derive operational density, progress percentages, and ordinal scores while strictly excluding data leakage:
```bash
python data_pipeline/feature_engineering.py
```
*Outputs*:
- `data/processed/ml_dataset.csv`
- `ML_DATA_DICTIONARY.md`

---

### Step 6: Export Database Seed Data (PostgreSQL + PostGIS)
Generate relational tables and PostGIS spatial geometries for backend storage:
```bash
python data_pipeline/export_data.py
```
*Outputs*:
- `database/seed_data/projects_seed.csv` & `.json`
- `database/seed_data/parcels_seed.csv` & `.json`
- `database/seed_data/schema_seed.sql`

---

## 5. Team Integration Guide

### A. For Member 1 (Machine Learning & AI)
- **File to Consume**: `data/processed/ml_dataset.csv`
- **Feature Set (\(X\))**: All columns from `state` through `operational_friction_index`.
- **Primary Classification Target (\(y\))**: `target_delay_status` (`1` = Delayed > 90 days, `0` = On-Schedule).
- **Secondary Regression Target**: `target_delay_days` (continuous duration).
- **Leakage Safeguard**: `actual_completion_date` and `target_delay_days` are strictly barred from the predictor matrix.
- Refer to [`ML_DATA_DICTIONARY.md`](file:///C:/Users/dell/Desktop/data/ML_DATA_DICTIONARY.md) and [`TARGET_ANALYSIS.md`](file:///C:/Users/dell/Desktop/data/TARGET_ANALYSIS.md).

### B. For Member 3 (GIS & Spatial Mapping)
- **Files to Consume**: `database/seed_data/parcels_seed.csv` or `data/processed/ml_dataset.csv`.
- **Geospatial Fields**:
  - `latitude`: WGS84 decimal degrees `[9.5, 30.5]`
  - `longitude`: WGS84 decimal degrees `[69.0, 87.0]`
  - `geom_wkt`: `SRID=4326;POINT(longitude latitude)` ready for Leaflet and PostGIS.
  - `district` & `state`: Geographic grouping boundaries.
- Refer to [`DATA_CONTRACT.md`](file:///C:/Users/dell/Desktop/data/DATA_CONTRACT.md).

### C. For Member 4 (Backend API & Database)
- **Directory to Consume**: `database/seed_data/`
- **Execution**: Apply `schema_seed.sql` in PostgreSQL to instantiate the `projects` and `parcels` tables with PostGIS extensions.
- Seed data is available in both CSV and JSON formats.

### D. For Member 5 (Explainable AI / SHAP)
- Use `operational_friction_index` as a baseline comparator.
- Key SHAP explanation drivers: `legal_dispute_indicator`, `documentation_completeness_pct`, `compensation_pending_days`, `approval_delay_days`, `rehabilitation_progress_pct`, and `stakeholder_response_score`.

---

## 6. Verification Status

| Check | Expected | Actual Result | Status |
|-------|----------|---------------|--------|
| Synthetic Records | \(\ge 2,000\) | 2,500 unique parcels (260 projects) | **PASSED** |
| Quality Report | `PASS` | `Overall status: PASS` (0 errors) | **PASSED** |
| Missing Critical Values | 0 | 0 | **PASSED** |
| Duplicate Rows | 0 | 0 | **PASSED** |
| Coordinates Valid | Indian Bounds | 100% within district polygons | **PASSED** |
| Target Available | `delay_status` | Binary (`0`/`1`), 68.6% delay rate | **PASSED** |
| Data Leakage Guard | Complete Isolation | Zero post-outcome leakage in `ml_dataset.csv` | **PASSED** |
