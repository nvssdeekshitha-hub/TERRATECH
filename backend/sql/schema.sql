-- ==============================================================================
-- TerraTech Database Schema
-- Predictive Analytics & Decision Support for Land Acquisition Delays
-- ==============================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'OFFICER', 'POLICYMAKER', 'VIEWER')),
    department VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    project_type VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    total_land_area_ha NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    budget_cr NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    affected_families INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    risk_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    risk_category VARCHAR(50) NOT NULL DEFAULT 'LOW' CHECK (risk_category IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    delay_probability NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    estimated_delay_days INT NOT NULL DEFAULT 0,
    primary_delay_factors JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_state ON projects(state);
CREATE INDEX IF NOT EXISTS idx_projects_district ON projects(district);
CREATE INDEX IF NOT EXISTS idx_projects_risk_category ON projects(risk_category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- 3. PARCELS TABLE
CREATE TABLE IF NOT EXISTS parcels (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    parcel_number VARCHAR(100) NOT NULL,
    survey_number VARCHAR(100) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    land_type VARCHAR(100) NOT NULL,
    area_sqm NUMERIC(12, 2) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ownership_complexity VARCHAR(50) NOT NULL DEFAULT 'STANDARD',
    documentation_status VARCHAR(50) NOT NULL DEFAULT 'COMPLETE',
    legal_disputes VARCHAR(50) NOT NULL DEFAULT 'NONE',
    compensation_status VARCHAR(50) NOT NULL DEFAULT 'DISBURSED',
    approval_status VARCHAR(50) NOT NULL DEFAULT 'APPROVED',
    rehabilitation_status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    possession_status VARCHAR(50) NOT NULL DEFAULT 'POSSESSED',
    stakeholder_responsiveness VARCHAR(50) NOT NULL DEFAULT 'HIGH',
    risk_category VARCHAR(50) NOT NULL DEFAULT 'LOW' CHECK (risk_category IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    risk_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    delay_probability NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    estimated_delay_days INT NOT NULL DEFAULT 0,
    coordinates_geojson JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_parcels_project_id ON parcels(project_id);
CREATE INDEX IF NOT EXISTS idx_parcels_state ON parcels(state);
CREATE INDEX IF NOT EXISTS idx_parcels_district ON parcels(district);
CREATE INDEX IF NOT EXISTS idx_parcels_risk_category ON parcels(risk_category);
CREATE INDEX IF NOT EXISTS idx_parcels_legal_disputes ON parcels(legal_disputes);

-- 4. PREDICTIONS TABLE (History of ML evaluations)
CREATE TABLE IF NOT EXISTS predictions (
    id VARCHAR(64) PRIMARY KEY,
    parcel_id VARCHAR(64) REFERENCES parcels(id) ON DELETE SET NULL,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    delay_probability NUMERIC(5, 2) NOT NULL,
    risk_score NUMERIC(5, 2) NOT NULL,
    risk_category VARCHAR(50) NOT NULL,
    estimated_delay_days INT NOT NULL,
    factor_contributions JSONB DEFAULT '{}'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    input_features JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_predictions_project_id ON predictions(project_id);
CREATE INDEX IF NOT EXISTS idx_predictions_parcel_id ON predictions(parcel_id);

-- 5. ALERTS TABLE
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL')),
    category VARCHAR(100) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alerts_project_id ON alerts(project_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON alerts(is_read);

-- 6. RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(64) PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    delay_factor VARCHAR(100) NOT NULL,
    recommended_action TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    estimated_time_saving_days INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recommendations_project_id ON recommendations(project_id);
