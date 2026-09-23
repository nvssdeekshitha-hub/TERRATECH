# TerraTech - Data Cleaning Report

- **Input Dataset**: `C:\Users\dell\Desktop\data\data\sample\terra_land_acquisition_synthetic.csv`
- **Output Dataset**: `C:\Users\dell\Desktop\data\data\processed\cleaned_land_acquisition.csv`
- **Initial Record Count**: 2505
- **Final Cleaned Record Count**: 2500
- **Net Removed Records**: 5 (Duplicates)

---

## 1. Summary of Cleaning Operations

| Step # | Operation | Original Problem | Cleaning Method | Affected Records |
|--------|-----------|------------------|-----------------|------------------|
| 1 | **Deduplication** | Duplicate records sharing identical parcel_id and attribute values. | Identified duplicate parcel_id keys and retained first valid occurrence. | 5 |
| 2 | **Categorical Normalization** | Inconsistent casing, lowercase strings, and trailing/leading whitespace in categorical attributes. | Stripped leading/trailing whitespace and standardized strings against domain canonical vocabulary. | 75 |
| 3 | **Impute Missing Affected Families** | Missing values (NaN) in affected_families column. | Imputed missing counts using median project-type family density multiplied by parcel land area. | 20 |
| 4 | **Impute Missing Rehabilitation Progress** | Missing values (NaN) in rehabilitation_progress ratio. | Imputed using median progress conditioned on parcel possession handover stage. | 25 |
| 5 | **Impute Geographic Coordinates** | Parcels missing latitude and longitude coordinates. | Imputed using official state administrative centroid coordinates to preserve geospatial validity. | 15 |

---

## 2. Granular Field-Level Handling

### A. Duplicate Handling
- **Observed Issue**: 5 rows had duplicated `parcel_id` identifiers created during raw batch assembly.
- **Action**: Performed primary key deduplication preserving the first chronological observation.

### B. Missing Values Resolution
- **Affected Families (20 records)**: Imputed via median family density per acre grouped by project sector.
- **Rehabilitation Progress (25 records)**: Imputed via conditional median based on physical possession handover status.
- **Geographic Coordinates (15 records)**: Imputed via state/district centroid boundaries. No arbitrary outside coordinates were injected.
- **Actual Completion Date (399 records)**: Legitimate nulls representing active ongoing projects. Retained as valid domain state and isolated from ML features.

### C. Text Normalization & Whitespace
- **Observed Issue**: 75 categorical instances contained extraneous leading/trailing spaces or lowercase text.
- **Action**: Applied strip normalization and standardized against domain ontology dictionaries.

### D. Numerical Constraints & Outlier Policy
- **Tukey's IQR Outliers**: High land areas (>111 acres) and large family displacements (>193 PAFs) were evaluated against mega-infrastructure requirements (dams, expressways, solar parks). Because these represent authentic engineering realities rather than sensor errors, they were **intentionally retained** to maintain realistic predictive distributions.
- **Boundary Clamping**: Bounded ratios (`documentation_completeness`, `rehabilitation_progress`, `historical_delay_rate`) were validated within strict `[0.0, 1.0]` limits.

---

## 3. Data Integrity Sign-Off

- **Duplicate Count Post-Clean**: 0
- **Critical Missing Fields**: 0 (excluding uncompleted project handover dates)
- **Data Integrity Status**: **VERIFIED & CLEAN**
