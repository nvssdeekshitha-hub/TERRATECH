# TerraTech - Data Profiling Report

- **Source File**: `C:\Users\dell\Desktop\data\data\sample\terra_land_acquisition_synthetic.csv`
- **Total Records (Rows)**: 2505
- **Total Features (Columns)**: 27
- **Duplicate Rows**: 5

---

## 1. Column Overview & Missing Value Analysis

| Column Name | Data Type | Missing Count | Missing % | Unique Values | Leakage Risk |
|-------------|-----------|---------------|-----------|---------------|--------------|
| `project_id` | str | 0 | 0.0% | 260 | SAFE |
| `parcel_id` | str | 0 | 0.0% | 2500 | SAFE |
| `project_name` | str | 0 | 0.0% | 190 | SAFE |
| `project_type` | str | 0 | 0.0% | 19 | SAFE |
| `state` | str | 0 | 0.0% | 10 | SAFE |
| `district` | str | 0 | 0.0% | 72 | SAFE |
| `land_area_acres` | float64 | 0 | 0.0% | 2146 | SAFE |
| `affected_families` | float64 | 20 | 0.8% | 307 | SAFE |
| `ownership_complexity` | str | 0 | 0.0% | 11 | SAFE |
| `documentation_completeness` | float64 | 0 | 0.0% | 81 | SAFE |
| `legal_dispute` | int64 | 0 | 0.0% | 2 | SAFE |
| `compensation_status` | str | 0 | 0.0% | 4 | SAFE |
| `compensation_pending_days` | int64 | 0 | 0.0% | 461 | SAFE |
| `notification_status` | str | 0 | 0.0% | 5 | SAFE |
| `approval_status` | str | 0 | 0.0% | 5 | SAFE |
| `approval_processing_days` | int64 | 0 | 0.0% | 234 | SAFE |
| `rehabilitation_progress` | float64 | 25 | 1.0% | 93 | SAFE |
| `possession_status` | str | 0 | 0.0% | 5 | SAFE |
| `stakeholder_responsiveness` | str | 0 | 0.0% | 4 | SAFE |
| `administrative_processing_days` | int64 | 0 | 0.0% | 388 | SAFE |
| `historical_delay_rate` | float64 | 0 | 0.0% | 690 | SAFE |
| `planned_completion_date` | str | 0 | 0.0% | 250 | SAFE |
| `actual_completion_date` | str | 399 | 15.93% | 1244 | ⚠️ HIGH |
| `delay_days` | int64 | 0 | 0.0% | 562 | ⚠️ HIGH |
| `delay_status` | int64 | 0 | 0.0% | 2 | ⚠️ HIGH |
| `latitude` | float64 | 15 | 0.6% | 2485 | SAFE |
| `longitude` | float64 | 15 | 0.6% | 2484 | SAFE |

---

## 2. Numerical Feature Statistics

| Column | Min | 25% | Median | 75% | Max | Mean | Std | Skewness |
|--------|-----|-----|--------|-----|-----|------|-----|----------|
| `land_area_acres` | 5.0 | 19.34 | 33.04 | 56.2 | 401.07 | 45.5269 | 41.4595 | 2.7212 |
| `affected_families` | 2.0 | 26.0 | 49.0 | 93.0 | 1396.0 | 74.8286 | 85.471 | 4.4579 |
| `documentation_completeness` | 0.15 | 0.58 | 0.71 | 0.83 | 0.99 | 0.6964 | 0.1632 | -0.4971 |
| `legal_dispute` | 0.0 | 0.0 | 0.0 | 1.0 | 1.0 | 0.3381 | 0.4732 | 0.6848 |
| `compensation_pending_days` | 0.0 | 0.0 | 112.0 | 218.0 | 648.0 | 140.3665 | 149.3362 | 1.2117 |
| `approval_processing_days` | 15.0 | 50.0 | 105.0 | 153.0 | 273.0 | 103.6255 | 60.8966 | 0.1387 |
| `rehabilitation_progress` | 0.02 | 0.45 | 0.59 | 0.73 | 0.98 | 0.5833 | 0.1863 | -0.1794 |
| `administrative_processing_days` | 30.0 | 153.0 | 210.0 | 271.0 | 523.0 | 211.8012 | 85.783 | 0.0929 |
| `historical_delay_rate` | 0.08 | 0.297 | 0.422 | 0.562 | 0.85 | 0.4329 | 0.1772 | 0.1806 |
| `delay_days` | 0.0 | 41.0 | 195.0 | 345.0 | 720.0 | 211.677 | 169.616 | 0.4546 |
| `delay_status` | 0.0 | 0.0 | 1.0 | 1.0 | 1.0 | 0.6846 | 0.4648 | -0.7952 |
| `latitude` | 9.634 | 17.6183 | 22.6798 | 26.3235 | 30.4372 | 21.8777 | 5.5407 | -0.4595 |
| `longitude` | 69.0907 | 75.3462 | 77.1848 | 79.8725 | 86.6942 | 77.5093 | 3.8983 | 0.1941 |

---

## 3. Potential Outlier Detection (Tukey's IQR 1.5x)

| Column | Outlier Count | Outlier % | Lower Bound | Upper Bound | Notes |
|--------|---------------|-----------|-------------|-------------|-------|
| `land_area_acres` | 162 | 6.47% | -35.95 | 111.49 | Retain valid domain values |
| `affected_families` | 163 | 6.51% | -74.5 | 193.5 | Retain valid domain values |
| `documentation_completeness` | 5 | 0.2% | 0.2 | 1.21 | Retain valid domain values |
| `legal_dispute` | 0 | 0.0% | -1.5 | 2.5 | Retain valid domain values |
| `compensation_pending_days` | 73 | 2.91% | -327.0 | 545.0 | Retain valid domain values |
| `approval_processing_days` | 0 | 0.0% | -104.5 | 307.5 | Retain valid domain values |
| `rehabilitation_progress` | 1 | 0.04% | 0.03 | 1.15 | Retain valid domain values |
| `administrative_processing_days` | 7 | 0.28% | -24.0 | 448.0 | Retain valid domain values |
| `historical_delay_rate` | 0 | 0.0% | -0.1 | 0.96 | Retain valid domain values |
| `delay_days` | 0 | 0.0% | -415.0 | 801.0 | Retain valid domain values |
| `delay_status` | 0 | 0.0% | -1.5 | 2.5 | Retain valid domain values |
| `latitude` | 0 | 0.0% | 4.56 | 39.38 | Retain valid domain values |
| `longitude` | 3 | 0.12% | 68.56 | 86.66 | Retain valid domain values |

---

## 4. Date Fields Profile

| Column | Min Date | Max Date | Valid Records | Blank / Ongoing |
|--------|----------|----------|---------------|-----------------|
| `planned_completion_date` | 2022-04-09 | 2027-09-08 | 2505 | 0 |
| `actual_completion_date` | 2022-04-09 | 2029-02-15 | 2106 | 399 |

---

## 5. Target Variable Distribution

- **Target Classification (`delay_status`)**:
  - Class `1` (Delayed (> 90 days)): 1715 records (68.5%)
  - Class `0` (On-Schedule / No Significant Delay): 790 records (31.5%)
  - Overall Delay Incidence: 68.5%

- **Target Continuous (`delay_days`)**:
  - Min: 0.0 days | Median: 195.0 days | Mean: 211.68 days | Max: 720.0 days
