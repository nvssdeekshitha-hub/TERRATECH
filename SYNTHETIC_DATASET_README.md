# Synthetic Demonstration Dataset Notice & Documentation

> **CRITICAL LEGAL & SYSTEM NOTICE**
> 
> "This dataset is synthetic demonstration data created for the TerraTech prototype. It is not official government data and must not be interpreted as real land acquisition records."

---

## 1. Overview & Purpose
TerraTech is an AI-powered predictive analytics and decision-support platform designed to detect and mitigate land acquisition delays for infrastructure and development projects across India. Due to the proprietary, sensitive, and fragmented nature of government land records and revenue records, this **Synthetic Demonstration Dataset** (`data/sample/terra_land_acquisition_synthetic.csv`) was generated to power the working prototype.

This dataset provides 2,500 realistic parcel-level and project-level observations spanning 10 Indian states and 53 distinct administrative districts.

---

## 2. Realistic Variable Relationships & Generative Logic
Rather than pure uniform random numbers, variables are generated using non-deterministic probabilistic modeling reflecting real-world land acquisition dynamics:

1. **Legal Disputes**: Presence of a legal dispute (`legal_dispute = 1`) significantly elevates delay probability, adding a heavy delay log-odds factor (+2.2) and extending pending compensation timelines.
2. **Documentation Completeness**: Projects with low documentation completeness (< 0.50) experience compounded administrative friction (+1.8 log-odds factor).
3. **Compensation Delays**: Long pending compensation days (`compensation_pending_days` > 180) correlate strongly with contested possession and farmer/landowner resistance.
4. **Ownership Complexity**: Land parcels with high or very high complexity (ancestral disputes, undivided titles, joint Hindu family holdings) increase administrative processing times by 30% to 120%.
5. **Rehabilitation Progress**: Slow R&R progress (< 40%) severely impedes physical possession handover.
6. **Stakeholder Responsiveness**: Cooperative stakeholders reduce delay risk (-1.5 log-odds), whereas hostile communities or injunctions sharply heighten delay probability.
7. **Stochastic Realism**: A Gaussian noise component (\(\epsilon \sim \mathcal{N}(0, 0.45)\)) is infused into the latent risk function so the dataset remains non-deterministic, enabling the ML team (Member 1) to train and evaluate generalized statistical classifiers and regression models without artificial 100% separability.

---

## 3. Data Dictionary of Synthetic Columns

| Field Name | Type | Unit / Format | Description |
|------------|------|---------------|-------------|
| `project_id` | String | `PRJ-XXXXX` | Unique identifier for the overall infrastructure project. |
| `parcel_id` | String | `PCL-XXXXX` | Unique parcel/plot-level identifier. |
| `project_name` | String | Text | Descriptive synthetic name of the project. |
| `project_type` | Categorical | Enum | Category (Highway, Freight, Solar, SEZ, Metro, Canal, Airport). |
| `state` | Categorical | Indian State | State name (10 states represented). |
| `district` | Categorical | District | Administrative district within the state. |
| `land_area_acres` | Float | Acres | Total parcel land area (5.0 to 1200.0 acres). |
| `affected_families` | Integer | Count | Count of Project Affected Families (PAFs). |
| `ownership_complexity` | Categorical | Ordinal | Complexity tier: Low, Medium, High, Very High. |
| `documentation_completeness` | Float | 0.0 - 1.0 | Share of verified title deeds, survey maps, and revenue records. |
| `legal_dispute` | Integer | 0 or 1 | 1 if active civil/revenue court litigation or writ petition; 0 otherwise. |
| `compensation_status` | Categorical | Enum | Fully Disbursed, Partially Disbursed, Pending Disbursal, Disputed. |
| `compensation_pending_days` | Integer | Days | Elapsed duration since award declaration without final payment. |
| `notification_status` | Categorical | RFCTLARR Stage | Statutory stage under RFCTLARR Act 2013 (Sec 11, 19, 23, 38). |
| `approval_status` | Categorical | Enum | Statutory clearance status (Approved, Under Scrutiny, Conditional, etc.). |
| `approval_processing_days` | Integer | Days | Time elapsed in statutory approval workflows. |
| `rehabilitation_progress` | Float | 0.0 - 1.0 | R&R milestone completion percentage (housing, livelihood, grants). |
| `possession_status` | Categorical | Enum | Physical handover status (Full, Substantial, Partial, Initial, Contested). |
| `stakeholder_responsiveness` | Categorical | Enum | Community engagement tier (High, Moderate, Low, Hostile). |
| `administrative_processing_days`| Integer | Days | Total revenue department processing duration to date. |
| `historical_delay_rate` | Float | 0.0 - 1.0 | Historical district/agency track record for similar acquisitions. |
| `planned_completion_date` | Date | `YYYY-MM-DD` | Contractual milestone baseline target date. |
| `actual_completion_date` | Date | `YYYY-MM-DD` | Date parcel was actually acquired and handed over (null if ongoing). |
| `delay_days` | Integer | Days | Delay in days beyond planned baseline (0 if on-schedule/ahead). |
| `delay_status` | Integer | 0 or 1 | **Target**: 1 = Delayed (> 90 days), 0 = No Significant Delay (<= 90 days). |
| `latitude` | Float | Decimal Deg | Geospatial latitude bounded to district limits. |
| `longitude` | Float | Decimal Deg | Geospatial longitude bounded to district limits. |

---

## 4. Preservation of Geospatial Coordinates
All coordinates (`latitude` and `longitude`) are verified to fall within the geographic bounding boxes of their respective Indian states and districts, allowing immediate consumption by Member 3 (GIS) for Leaflet.js and OpenStreetMap rendering.

---

## 5. Safe Usage Disclaimer
This file and the resulting processed datasets must strictly be utilized for prototype testing, interface verification, and predictive pipeline development within the TerraTech project environment.
