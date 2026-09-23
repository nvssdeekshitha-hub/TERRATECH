# TerraTech - Data Dictionary (Source / Sample Dataset)

This data dictionary documents the exact columns present in the land acquisition dataset (`data/sample/terra_land_acquisition_synthetic.csv`).

---

## Column Catalog

| Column Name | Physical Data Type | Logical Type | Allowed Domain / Range | Missing Values Allowed? | Description & Semantics |
|-------------|-------------------|--------------|------------------------|-------------------------|--------------------------|
| `project_id` | `VARCHAR(32)` | Identifier | Pattern: `PRJ-\d{4,5}` | No (Mandatory) | Unique identifier for the parent infrastructure project. |
| `parcel_id` | `VARCHAR(32)` | Identifier | Pattern: `PCL-\d{5}` | No (Mandatory) | Unique identifier for the specific parcel or cadastral plot. |
| `project_name` | `VARCHAR(255)` | Text Metadata | String | No | Official title of the infrastructure undertaking. |
| `project_type` | `VARCHAR(64)` | Categorical | 7 predefined sectors (Highway, Railway, Solar, SEZ, Metro, Irrigation, Airport) | No | Infrastructure sector classifying the operational nature of acquisition. |
| `state` | `VARCHAR(64)` | Categorical | 10 Indian States | No | State revenue jurisdiction administering the acquisition. |
| `district` | `VARCHAR(64)` | Categorical | 53 Districts | No | District Collectorate / Land Acquisition Officer jurisdiction. |
| `land_area_acres` | `FLOAT` | Numerical | `[5.0, 1200.0]` | No | Total geographic area of parcel measured in acres. |
| `affected_families` | `FLOAT` / `INT` | Numerical | `[1, 2500]` | Yes (Imputed during cleaning) | Number of Project Affected Families (PAFs) eligible for R&R. |
| `ownership_complexity` | `VARCHAR(32)` | Categorical (Ordinal) | `Low`, `Medium`, `High`, `Very High` | No | Title clarity, number of co-parceners, ancestral dispute degree. |
| `documentation_completeness` | `FLOAT` | Numerical (Ratio) | `[0.0, 1.0]` | No | Proportion of completed revenue records, mutations, and survey maps. |
| `legal_dispute` | `INT` | Binary Indicator | `0` or `1` | No | Flag indicating active litigation in District Court, High Court, or Authority. |
| `compensation_status` | `VARCHAR(64)` | Categorical | `Fully Disbursed`, `Partially Disbursed`, `Pending Disbursal`, `Disputed in Escrow` | No | Statutory milestone status of compensation disbursement. |
| `compensation_pending_days` | `INT` | Numerical (Days) | `[0, 1000]` | No | Elapsed calendar days since award declaration without disbursement. |
| `notification_status` | `VARCHAR(64)` | Categorical | Stages under RFCTLARR Act 2013 | No | Latest published Gazette notification stage (Sec 11, 19, 23, 38). |
| `approval_status` | `VARCHAR(64)` | Categorical | Clearance levels | No | Competent authority administrative & environmental clearance status. |
| `approval_processing_days` | `INT` | Numerical (Days) | `[0, 600]` | No | Duration elapsed in current approval review workflow. |
| `rehabilitation_progress` | `FLOAT` | Numerical (Ratio) | `[0.0, 1.0]` | Yes (Imputed during cleaning) | Cumulative percentage of R&R entitlements delivered to families. |
| `possession_status` | `VARCHAR(64)` | Categorical | Handover stages | No | Physical site possession status by the requiring body. |
| `stakeholder_responsiveness` | `VARCHAR(64)` | Categorical | Engagement tiers | No | Cooperative engagement level of local community and gram sabhas. |
| `administrative_processing_days` | `INT` | Numerical (Days) | `[0, 1000]` | No | Total administrative processing time expended by revenue department. |
| `historical_delay_rate` | `FLOAT` | Numerical (Ratio) | `[0.0, 1.0]` | No | Historical average delay probability for similar projects in jurisdiction. |
| `planned_completion_date` | `DATE` | Date (`YYYY-MM-DD`) | `[2021-01-01, 2030-12-31]` | No | Contractual milestone baseline target completion date. |
| `actual_completion_date` | `DATE` | Date (`YYYY-MM-DD`) | `[2021-01-01, 2030-12-31]` | Yes (Blank for ongoing) | Realized handover date (**Leakage feature: Excluded from ML predictors**). |
| `delay_days` | `INT` | Numerical (Days) | `[0, 1500]` | No | Realized delay duration in days (**Leakage feature: Excluded from ML predictors**). |
| `delay_status` | `INT` | Binary Target | `0` or `1` | No | **Primary Target Variable**: `1` = Delayed (> 90 days), `0` = No Delay. |
| `latitude` | `FLOAT` | Geospatial | `[8.0, 37.0]` | Yes (District centroid imputed) | WGS84 geographic latitude coordinate. |
| `longitude` | `FLOAT` | Geospatial | `[68.0, 97.0]` | Yes (District centroid imputed) | WGS84 geographic longitude coordinate. |

---

## Role Accessibility Mapping

| Consumer Module | Primary Consumption Columns | Excluded Columns |
|-----------------|-----------------------------|------------------|
| **Member 1 (ML / AI)** | All operational, statutory, and environmental features + `delay_status` | `actual_completion_date`, `delay_days` (strictly prohibited as input features) |
| **Member 3 (GIS)** | `parcel_id`, `project_name`, `state`, `district`, `latitude`, `longitude`, `delay_status`, `land_area_acres` | Internal algorithmic transform variables |
| **Member 4 (Backend)** | Complete relational schema with primary/foreign keys (`project_id`, `parcel_id`) | Non-serializable objects |
