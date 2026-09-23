# TerraTech - Inter-Team Data Contract

**DOCUMENT VERSION**: `1.0.0` (Immutable Data Interface)  
**OWNER**: Member 2 (Data Engineering Layer)  
**CONSUMERS**:
- Member 1: Machine Learning & Predictive Analytics
- Member 3: GIS & Spatial Mapping (Leaflet / PostGIS)
- Member 4: Backend API & Database (Node.js / Express / PostgreSQL)
- Member 5: Explainable AI (SHAP / Feature Attribution)

> **IMMUTABILITY NOTICE**:  
> Field names, primary keys, data types, and target definitions in this document are frozen. No breaking renames will be introduced without incrementing the major version and team approval.

---

## A. Machine Learning Input Features (`data/processed/ml_dataset.csv`)

Member 1 (ML/AI) and Member 5 (XAI) MUST consume the following vetted feature set:

### 1. Feature Matrix Columns (\(X\))

| Feature Name | Type | Domain / Values | Semantics |
|--------------|------|-----------------|-----------|
| `state` | String (Categorical) | 10 Indian States | State administrative revenue jurisdiction |
| `district` | String (Categorical) | 53 Districts | District authority jurisdiction |
| `latitude` | Float | `[9.5, 30.5]` | Geospatial latitude |
| `longitude` | Float | `[69.0, 87.0]` | Geospatial longitude |
| `project_type` | String (Categorical) | 7 Sectors (Highway, Rail, Solar, etc.) | Project classification |
| `land_area_acres` | Float | `[5.0, 1200.0]` | Parcel land area in acres |
| `affected_families` | Integer | `[1, 2500]` | Count of Project Affected Families |
| `affected_family_density`| Float | `> 0.0` | Families per acre (`affected_families / land_area_acres`) |
| `land_area_per_family` | Float | `> 0.0` | Acres per family (`land_area_acres / affected_families`) |
| `documentation_completeness_pct` | Float | `[0.0, 100.0]` | Verified title deeds percentage |
| `rehabilitation_progress_pct` | Float | `[0.0, 100.0]` | Resettlement & rehabilitation delivery percentage |
| `legal_dispute_indicator` | Integer (Binary) | `0` or `1` | 1 = Active court litigation, 0 = No active dispute |
| `compensation_pending_days` | Integer | `[0, 1000]` | Days elapsed without compensation disbursement |
| `approval_processing_days` | Integer | `[0, 600]` | Total days in clearance review |
| `approval_delay_days` | Integer | `[0, 540]` | Clearance delay beyond 60-day statutory benchmark |
| `administrative_processing_days` | Integer | `[0, 1000]` | Days spent in revenue department processing |
| `historical_delay_rate` | Float | `[0.0, 1.0]` | Historical probability of delay in sector/district |
| `compensation_status` | String (Categorical) | Fully Disbursed, Partially Disbursed, Pending Disbursal, Disputed in Escrow | Compensation milestone |
| `notification_status` | String (Categorical) | Sec 11, Sec 19, Sec 23, Sec 38, Notification Pending | Gazette notification stage |
| `approval_status` | String (Categorical) | Approved, Under Scrutiny, Conditional Clearance, Pending Environmental, Resubmission Required | Clearance status |
| `possession_status` | String (Categorical) | Full, Substantial, Partial, Initial Stage, Contested | Physical possession stage |
| `stakeholder_responsiveness` | String (Categorical) | High / Cooperative, Moderate, Low / Resistant, Hostile / Injunction | Community sentiment |
| `ownership_complexity` | String (Categorical) | Low, Medium, High, Very High | Title complexity |
| `ownership_complexity_score` | Integer (Ordinal) | `1`, `2`, `3`, `4` | Pre-mapped ordinal split for tree algorithms |
| `stakeholder_response_score` | Integer (Ordinal) | `1`, `2`, `3`, `4` | Pre-mapped ordinal split (1=Hostile, 4=High) |
| `possession_progress_score` | Integer (Ordinal) | `1`, `2`, `3`, `4`, `5` | Pre-mapped ordinal split (1=Contested, 5=Full) |
| `operational_friction_index`| Float | `[0.0, 100.0]` | Heuristic baseline operational drag index |

---

## B. Target Variables

### 1. Primary Classification Target
- **Column**: `target_delay_status`
- **Type**: `INTEGER` (`0` or `1`)
- **Values**:
  - `0` = On-Schedule / No Significant Delay (\(\le 90\) days)
  - `1` = Delayed (\(> 90\) days beyond baseline target)
- **Constraint**: Must NEVER be included in the feature input matrix \(X\).

### 2. Secondary Regression Target
- **Column**: `target_delay_days`
- **Type**: `INTEGER`
- **Unit**: Calendar days
- **Values**: `[0, 720]`
- **Constraint**: Must NEVER be included in the feature input matrix \(X\).

---

## C. Project Identifier
- **Column**: `project_id`
- **Type**: `VARCHAR(32)`
- **Format / Regex**: `^PRJ-\d{4,5}$` (e.g., `PRJ-1042`)
- **Cardinality**: 260 distinct projects
- **Scope**: Parent infrastructure undertaking.

---

## D. Parcel Identifier
- **Column**: `parcel_id`
- **Type**: `VARCHAR(32)`
- **Format / Regex**: `^PCL-\d{5}$` (e.g., `PCL-10023`)
- **Cardinality**: 2,500 distinct parcels (100% unique primary key)
- **Scope**: Cadastral parcel / plot unit of acquisition.

---

## E. GIS Fields (`Member 3: GIS & Spatial Team`)

Provided in `data/processed/ml_dataset.csv` and `database/seed_data/parcels_seed.csv`:

| Field Name | Type | Format / Reference | Description |
|------------|------|--------------------|-------------|
| `latitude` | Float (Decimal Degrees) | EPSG:4326 (WGS84) | Parcel latitude |
| `longitude` | Float (Decimal Degrees) | EPSG:4326 (WGS84) | Parcel longitude |
| `geom_wkt` | String (WKT) | `SRID=4326;POINT(lon lat)` | PostGIS Well-Known Text geometry |
| `state` | String | Indian State Name | State boundary grouping |
| `district` | String | District Collectorate | District boundary grouping |

---

## F. Database Fields (`Member 4: Backend / PostgreSQL Developer`)

Available as seed files in `database/seed_data/`:

### 1. Relational Table: `projects` (`database/seed_data/projects_seed.csv`)
- `project_id` (PK, `VARCHAR(32)`)
- `project_name` (`VARCHAR(255)`)
- `project_type` (`VARCHAR(64)`)
- `state` (`VARCHAR(64)`)
- `district` (`VARCHAR(64)`)
- `total_parcels` (`INTEGER`)
- `total_land_area_acres` (`NUMERIC(10,2)`)
- `total_affected_families` (`INTEGER`)
- `planned_completion_date` (`DATE`)
- `avg_historical_delay_rate` (`NUMERIC(5,3)`)
- `centroid_latitude` (`NUMERIC(10,6)`)
- `centroid_longitude` (`NUMERIC(10,6)`)
- `geom` (`GEOMETRY(Point, 4326)`)

### 2. Relational Table: `parcels` (`database/seed_data/parcels_seed.csv`)
- `parcel_id` (PK, `VARCHAR(32)`)
- `project_id` (FK referencing `projects.project_id`, `VARCHAR(32)`)
- `land_area_acres` (`NUMERIC(10,2)`)
- `affected_families` (`INTEGER`)
- `ownership_complexity` (`VARCHAR(32)`)
- `documentation_completeness` (`NUMERIC(4,2)`)
- `legal_dispute` (`BOOLEAN`)
- `compensation_status` (`VARCHAR(64)`)
- `compensation_pending_days` (`INTEGER`)
- `notification_status` (`VARCHAR(64)`)
- `approval_status` (`VARCHAR(64)`)
- `approval_processing_days` (`INTEGER`)
- `rehabilitation_progress` (`NUMERIC(4,2)`)
- `possession_status` (`VARCHAR(64)`)
- `stakeholder_responsiveness` (`VARCHAR(64)`)
- `administrative_processing_days` (`INTEGER`)
- `historical_delay_rate` (`NUMERIC(5,3)`)
- `planned_completion_date` (`DATE`)
- `actual_completion_date` (`DATE`, Nullable)
- `delay_days` (`INTEGER`)
- `delay_status` (`INTEGER`)
- `latitude` (`NUMERIC(10,6)`)
- `longitude` (`NUMERIC(10,6)`)
- `geom` (`GEOMETRY(Point, 4326)`)

---

## G. Team Sign-Off Summary

- **ML Team (Member 1)**: Ingest `data/processed/ml_dataset.csv`. Split by `parcel_id`. Use `target_delay_status` for classification.
- **GIS Team (Member 3)**: Use `database/seed_data/parcels_seed.csv` or GeoJSON point layers with `latitude`, `longitude`, `district`.
- **Backend Team (Member 4)**: Run `database/seed_data/schema_seed.sql` to initialize PostgreSQL and seed initial records.
- **XAI Team (Member 5)**: Explain features relative to `operational_friction_index` and individual model trees using SHAP values.
