"""
TerraTech - Database Seed Data Exporter
Member 2: Data Engineering Layer

Prepares normalized relational tables and PostGIS-compatible spatial seed data:
- database/seed_data/projects_seed.csv (and .json)
- database/seed_data/parcels_seed.csv (and .json)
- database/seed_data/schema_seed.sql (PostgreSQL + PostGIS DDL and COPY statements)
"""

from pathlib import Path
import json
import pandas as pd
import numpy as np

from config import (
    CLEANED_DATA_PATH,
    SEED_DATA_DIR,
    PROJECTS_SEED_PATH,
    PARCELS_SEED_PATH
)

def export_database_seed(input_path=CLEANED_DATA_PATH):
    print(f"[DATABASE SEED EXPORTER] Generating relational seed files from: {input_path}")
    df = pd.read_csv(input_path)
    SEED_DATA_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Generate Projects Table (Parent Entity)
    project_groups = df.groupby("project_id")
    
    projects_list = []
    for pid, group in project_groups:
        first_row = group.iloc[0]
        cent_lat = round(float(group["latitude"].mean()), 6)
        cent_lon = round(float(group["longitude"].mean()), 6)
        
        projects_list.append({
            "project_id": pid,
            "project_name": first_row["project_name"],
            "project_type": first_row["project_type"],
            "state": first_row["state"],
            "district": first_row["district"],
            "total_parcels": int(len(group)),
            "total_land_area_acres": round(float(group["land_area_acres"].sum()), 2),
            "total_affected_families": int(group["affected_families"].sum()),
            "planned_completion_date": first_row["planned_completion_date"],
            "avg_historical_delay_rate": round(float(group["historical_delay_rate"].mean()), 3),
            "centroid_latitude": cent_lat,
            "centroid_longitude": cent_lon,
            "geom_wkt": f"SRID=4326;POINT({cent_lon} {cent_lat})"
        })

    projects_df = pd.DataFrame(projects_list)
    projects_df.to_csv(PROJECTS_SEED_PATH, index=False)
    
    # Export JSON version
    projects_json_path = SEED_DATA_DIR / "projects_seed.json"
    with open(projects_json_path, "w", encoding="utf-8") as f:
        json.dump(projects_list, f, indent=2)
    print(f"[SUCCESS] Exported {len(projects_df)} projects to {PROJECTS_SEED_PATH}")

    # 2. Generate Parcels Table (Child Entity with Foreign Key)
    parcels_df = df.copy()
    # Add PostGIS Well-Known Text (WKT) column: POINT(longitude latitude)
    parcels_df["geom_wkt"] = parcels_df.apply(
        lambda r: f"SRID=4326;POINT({r['longitude']} {r['latitude']})",
        axis=1
    )
    
    # Convert binary legal_dispute to PostgreSQL boolean representation
    parcels_df["legal_dispute_bool"] = parcels_df["legal_dispute"].apply(lambda x: True if x == 1 else False)

    parcels_df.to_csv(PARCELS_SEED_PATH, index=False)
    
    # Export JSON version
    parcels_json_path = SEED_DATA_DIR / "parcels_seed.json"
    parcels_dict = parcels_df.replace({np.nan: None}).to_dict(orient="records")
    with open(parcels_json_path, "w", encoding="utf-8") as f:
        json.dump(parcels_dict, f, indent=2)
    print(f"[SUCCESS] Exported {len(parcels_df)} parcels to {PARCELS_SEED_PATH}")

    # 3. Generate PostgreSQL / PostGIS DDL Schema Script
    schema_sql_path = SEED_DATA_DIR / "schema_seed.sql"
    sql_content = """-- ========================================================
-- TerraTech Database Seed & Schema Definition
-- Prepared by Member 2 (Data Engineering Layer)
-- Target: PostgreSQL 14+ with PostGIS Extension
-- ========================================================

-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Projects Table
DROP TABLE IF EXISTS parcels CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE projects (
    project_id VARCHAR(32) PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    project_type VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    district VARCHAR(64) NOT NULL,
    total_parcels INTEGER NOT NULL,
    total_land_area_acres NUMERIC(10, 2) NOT NULL,
    total_affected_families INTEGER NOT NULL,
    planned_completion_date DATE NOT NULL,
    avg_historical_delay_rate NUMERIC(5, 3),
    centroid_latitude NUMERIC(10, 6),
    centroid_longitude NUMERIC(10, 6),
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_state_district ON projects(state, district);
CREATE INDEX idx_projects_geom ON projects USING GIST(geom);

-- 2. Parcels Table
CREATE TABLE parcels (
    parcel_id VARCHAR(32) PRIMARY KEY,
    project_id VARCHAR(32) NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    land_area_acres NUMERIC(10, 2) NOT NULL,
    affected_families INTEGER NOT NULL,
    ownership_complexity VARCHAR(32) NOT NULL,
    documentation_completeness NUMERIC(4, 2) NOT NULL,
    legal_dispute BOOLEAN NOT NULL DEFAULT FALSE,
    compensation_status VARCHAR(64) NOT NULL,
    compensation_pending_days INTEGER NOT NULL DEFAULT 0,
    notification_status VARCHAR(64) NOT NULL,
    approval_status VARCHAR(64) NOT NULL,
    approval_processing_days INTEGER NOT NULL DEFAULT 0,
    rehabilitation_progress NUMERIC(4, 2) NOT NULL DEFAULT 0.0,
    possession_status VARCHAR(64) NOT NULL,
    stakeholder_responsiveness VARCHAR(64) NOT NULL,
    administrative_processing_days INTEGER NOT NULL DEFAULT 0,
    historical_delay_rate NUMERIC(5, 3) NOT NULL,
    planned_completion_date DATE NOT NULL,
    actual_completion_date DATE,
    delay_days INTEGER NOT NULL DEFAULT 0,
    delay_status INTEGER NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_parcels_project_id ON parcels(project_id);
CREATE INDEX idx_parcels_delay_status ON parcels(delay_status);
CREATE INDEX idx_parcels_geom ON parcels USING GIST(geom);

-- ========================================================
-- Seed Instructions for Member 4 (Backend Developer):
-- Run the following in psql or via Node.js db-migrate script:
--
-- \\copy projects(project_id, project_name, project_type, state, district, total_parcels, total_land_area_acres, total_affected_families, planned_completion_date, avg_historical_delay_rate, centroid_latitude, centroid_longitude, geom) FROM 'projects_seed.csv' WITH (FORMAT csv, HEADER true);
--
-- UPDATE projects SET geom = ST_SetSRID(ST_MakePoint(centroid_longitude, centroid_latitude), 4326);
-- UPDATE parcels SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326);
-- ========================================================
"""
    with open(schema_sql_path, "w", encoding="utf-8") as f:
        f.write(sql_content)
    print(f"[SUCCESS] Exported PostgreSQL / PostGIS DDL script to {schema_sql_path}")

    return projects_df, parcels_df

if __name__ == "__main__":
    export_database_seed()
