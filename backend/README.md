# TerraTech Backend API

> AI-Powered Predictive Analytics and Decision-Support Platform for Detecting and Preventing Land Acquisition Delays.

The TerraTech Backend acts as the core orchestration layer connecting:
- **Frontend** (React.js + TypeScript + Tailwind CSS)
- **Database** (PostgreSQL + PostGIS)
- **ML Service** (Python FastAPI XGBoost/SHAP Service)
- **GIS Engine** (GeoJSON for Leaflet.js / OpenStreetMap)
- **Recommendations Engine** (Actionable mitigation strategies)
- **Early-Warning Alerts** (Real-time risk notifications)

---

## Table of Contents
1. [Architecture & Features](#architecture--features)
2. [Technology Stack](#technology-stack)
3. [Environment Variables](#environment-variables)
4. [Installation & Setup](#installation--setup)
5. [Database Setup & Seeding](#database-setup--seeding)
6. [Running the Backend](#running-the-backend)
7. [Running Tests](#running-tests)
8. [API Documentation & Endpoints](#api-documentation--endpoints)
9. [Authentication & Role-Based Access Control](#authentication--role-based-access-control)
10. [Machine Learning Integration](#machine-learning-integration)

---

## Architecture & Features

- **Project & Parcel Registry**: Comprehensive tracking of infrastructure corridors, survey numbers, ownership complexity, compensation escrow, and court litigation statuses.
- **ML Delay Prediction Proxy**: Securely passes land acquisition attributes to Python FastAPI ML service, returning delay probability, risk score (0-100), risk category (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), estimated delay duration, and SHAP factor weights.
- **GIS GeoJSON Engine**: Serves standard GeoJSON `FeatureCollection` objects ready for rendering directly in Leaflet.js / Mapbox / OpenStreetMap.
- **State & District Analytics**: High-level KPI aggregations, district-level delay trends, and breakdown of main delay factors.
- **Early-Warning Alerts**: Event-driven alert system with severity tags (`CRITICAL`, `WARNING`, `INFO`).
- **Interactive OpenAPI/Swagger**: Full Swagger UI accessible at `/api/docs`.
- **Hybrid Storage Resilience**: Connects directly to PostgreSQL using parameterized queries with connection pooling (`pg`). If PostgreSQL is not configured or offline during local frontend development, transparently serves realistic synthetic data in fallback mode.

---

## Technology Stack

- **Runtime**: Node.js (v20+ / v22+ / v24+)
- **Framework**: Express.js
- **Language**: TypeScript (ES2022 / NodeNext)
- **Database**: PostgreSQL (with PostGIS support)
- **Authentication**: JWT (`jsonwebtoken`) + Password Hashing (`bcryptjs`)
- **Validation**: Zod
- **Documentation**: Swagger UI (`swagger-ui-express`)
- **Testing**: Jest + Supertest (`ts-jest`)

---

## Environment Variables

Copy `.env.example` to `.env` in the `backend/` directory:

```bash
cp .env.example .env
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | HTTP Server port | `5000` |
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) | `development` |
| `DATABASE_URL` | PostgreSQL connection URI | `postgresql://postgres:postgres@localhost:5432/terratech_db` |
| `JWT_SECRET` | Secret key for signing and verifying JWT tokens | `terratech_jwt_super_secret_production_key_2026` |
| `JWT_EXPIRES_IN` | Token validity duration | `7d` |
| `ML_SERVICE_URL` | Python FastAPI ML service URL | `http://localhost:8000` |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated or `*`) | `*` |

---

## Installation & Setup

Navigate to the `backend/` directory and install dependencies:

```bash
cd d:/tt-backend/TERRATECH/backend
npm install
```

---

## Database Setup & Seeding

### 1. Create PostgreSQL Database
Make sure PostgreSQL is running, then create the database:
```sql
CREATE DATABASE terratech_db;
```

### 2. Initialize Schema & Tables
Execute the DDL schema:
```bash
npm run db:init
```
*(Or execute `sql/schema.sql` directly using `psql -d terratech_db -f sql/schema.sql`)*

### 3. Seed Realistic Indian Infrastructure Data
Populate demo users, infrastructure projects (DMIC, WDFC, Bengaluru Suburban Rail, Polavaram Canal, etc.), parcels with GeoJSON polygons, alerts, and recommendations:
```bash
npm run db:seed
```
*(Or execute `sql/seed.sql` directly using `psql -d terratech_db -f sql/seed.sql`)*

---

## Running the Backend

### Development Mode (with hot-reload)
```bash
npm run dev
```

### Production Build & Run
```bash
npm run build
npm start
```

Once started:
- API Server: `http://localhost:5000`
- Interactive Swagger UI: `http://localhost:5000/api/docs`
- Health Endpoint: `http://localhost:5000/api/health`

---

## Running Tests

Execute the automated test suite covering Health, Auth, Projects, Parcels, Predictions, Analytics, Alerts, and GIS:

```bash
npm test
```

Generate test coverage report:
```bash
npm run test:coverage
```

---

## API Documentation & Endpoints

Base URL: `/api`

### 1. Health
- `GET /api/health` - Check backend service and database connectivity.

### 2. Authentication
- `POST /api/auth/register` - Register a new user account.
- `POST /api/auth/login` - Authenticate with email/password and obtain JWT.
- `GET /api/auth/me` - Get profile of the logged-in user.

### 3. Projects
- `GET /api/projects` - List projects with filtering (`state`, `district`, `riskCategory`, `status`, `search`) and pagination (`page`, `limit`).
- `GET /api/projects/:id` - Get project details with aggregated parcel statistics.
- `POST /api/projects` - Create project (*Requires `ADMIN` or `OFFICER` role*).
- `PUT /api/projects/:id` - Update project (*Requires `ADMIN` or `OFFICER` role*).

### 4. Parcels
- `GET /api/parcels` - Filter parcels by `state`, `district`, `riskCategory`, `project`, `status`.
- `GET /api/parcels/:id` - Get parcel details by ID.

### 5. Prediction (ML Service Integration)
- `POST /api/predictions` - Forwards parcel/project attributes to the Python FastAPI ML service at `ML_SERVICE_URL/predict`.
  - **Returns**: `delay_probability`, `risk_score`, `risk_category`, `estimated_delay_days`, explainable AI factor weights, and recommendations.

### 6. Analytics
- `GET /api/analytics/overview` - Returns `totalProjects`, `highRiskProjects`, `criticalProjects`, `averageDelayProbability`, `averageEstimatedDelay`.
- `GET /api/analytics/states` - State-wise risk and land area breakdown.
- `GET /api/analytics/districts` - District-level risk heatmaps and delay averages.
- `GET /api/analytics/delay-trends` - Historical quarterly trend metrics.
- `GET /api/analytics/factors` - Top delay factors (Legal disputes, compensation, approvals, etc.).

### 7. GIS
- `GET /api/gis/parcels` - Returns GeoJSON `FeatureCollection` with polygon coordinates and risk properties for Leaflet.js / OpenStreetMap.
  - Optional filters: `projectId`, `state`, `district`, `riskCategory`.

### 8. Alerts
- `GET /api/alerts` - List early-warning alerts (filters: `projectId`, `severity`, `isRead`).
- `POST /api/alerts` - Create alert (*Requires `ADMIN` or `OFFICER` role*).
- `PUT /api/alerts/:id/read` - Mark alert as read.

### 9. Recommendations
- `GET /api/projects/:id/recommendations` - Retrieve corrective actions and mitigation strategies for a project.

---

## Authentication & Role-Based Access Control

Pass the JWT in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

### Pre-seeded Demo Accounts
All pre-seeded demo accounts share the password: `Password@123`

| Email | Role | Department |
| :--- | :--- | :--- |
| `admin@terratech.gov.in` | `ADMIN` | Ministry of Infrastructure & Land Resources |
| `officer.patil@terratech.gov.in` | `OFFICER` | Revenue & Land Acquisition Directorate - MH |
| `officer.verma@terratech.gov.in` | `OFFICER` | Special Land Acquisition Cell - UP |
| `policy.iyer@terratech.gov.in` | `POLICYMAKER` | NITI Aayog Infrastructure Division |
| `viewer.analyst@terratech.gov.in` | `VIEWER` | Public Project Monitoring Cell |

---

## Machine Learning Integration

The Node.js backend acts as a gateway and does not duplicate the ML algorithm.
When `POST /api/predictions` is called:
1. Node.js validates the feature payload with Zod.
2. It sends an HTTP POST request to `http://localhost:8000/predict`.
3. If the Python FastAPI service is active, the real XGBoost + SHAP prediction is returned and logged to the `predictions` table.
4. If the ML service is not reachable during local UI prototyping, a clearly tagged fallback estimation is provided with `is_simulated_fallback: true` to prevent breaking frontend workflows.
