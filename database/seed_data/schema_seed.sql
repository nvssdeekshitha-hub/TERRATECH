-- ========================================================
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
-- \copy projects(project_id, project_name, project_type, state, district, total_parcels, total_land_area_acres, total_affected_families, planned_completion_date, avg_historical_delay_rate, centroid_latitude, centroid_longitude, geom) FROM 'projects_seed.csv' WITH (FORMAT csv, HEADER true);
--
-- UPDATE projects SET geom = ST_SetSRID(ST_MakePoint(centroid_longitude, centroid_latitude), 4326);
-- UPDATE parcels SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326);
-- ========================================================
