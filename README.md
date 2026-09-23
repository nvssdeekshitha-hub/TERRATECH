# TerraTech - AI-Powered GIS Land Acquisition Risk Platform

TerraTech is a predictive analytics and decision-support platform for detecting and preventing land acquisition delays across major infrastructure projects in India (Highways, Railways, Metro Corridors, Logistics Hubs, and Solar Energy Parks).

This repository contains the complete, production-ready **GIS Visualization and Spatial Risk Analytics Module** built with React, TypeScript, Leaflet.js, GeoJSON, Tailwind CSS, and Recharts.

---

## Table of Contents
1. [GIS Architecture](#gis-architecture)
2. [GeoJSON Data Specification](#geojson-data-specification)
3. [Map Implementation & Accessibility Features](#map-implementation--accessibility-features)
4. [Required API Endpoints & Request/Response Contracts](#required-api-endpoints--requestresponse-contracts)
5. [Analytics Suite (Recharts Integration)](#analytics-suite-recharts-integration)
6. [Component Sitemap](#component-sitemap)
7. [How to Run the GIS Module](#how-to-run-the-gis-module)

---

## GIS Architecture

The TerraTech GIS layer is designed as a decoupled, reactive React + TypeScript spatial visualization module capable of displaying hundreds of land parcels across India.

```
                  +-----------------------------------+
                  |          GISDashboard             |
                  |  (Master Controller & Filter State)|
                  +-----------------+-----------------+
                                    |
          +-------------------------+-------------------------+
          |                                                   |
+---------v----------+                              +---------v----------+
|  TerraTechRiskMap  |                              |  Recharts Suite    |
| (Leaflet Container)|                              | (7 Analytics Charts|
+---------+----------+                              +--------------------+
          |
    +-----+-----+
    |           |
+---v----+  +---v---------------+
| Tile   |  |   ParcelLayer     |
| Layer  |  | (Markers+GeoJSON) |
+--------+  +---+---------------+
                |
            +---v----+
            | Risk   |
            | Popup  |
            +--------+
```

### Key Architectural Principles
- **Decoupled API Client Service (`src/services/api.ts`)**: Encapsulates all backend data fetching. The UI components consume normalized `LandParcel` and `AnalyticsSummary` data shapes.
- **Dynamic Reactive Filtering**: Changing any filter (State, District, Project, Risk Category, Search) immediately updates:
  1. Visible markers and polygon boundaries on `TerraTechRiskMap`.
  2. Map bounds to center on filtered parcels.
  3. KPI summary cards (Total parcels, High/Critical risk, Avg delay days, Total area).
  4. All 7 Recharts analytics graphs.
- **Accessibility-First Design**: Risk level visualization relies on a combination of colors, shape badges, textual labels, and ARIA tags so color-blind users can easily distinguish risk levels.

---

## GeoJSON Data Specification

Each land parcel record includes a GeoJSON geometry object defining its spatial boundaries.

### Example Parcel Object with GeoJSON Polygon:
```json
{
  "id": "P001",
  "project": "NH-65 Expressway Expansion",
  "projectType": "Highway",
  "district": "Vijayawada",
  "state": "Andhra Pradesh",
  "tehsilVillage": "Penamaluru / Kankipadu",
  "landArea": 14.5,
  "affectedFamilies": 32,
  "ownershipComplexity": "Joint Family",
  "documentationStatus": "Pending Verification",
  "legalDisputesCount": 3,
  "compensationStatus": "Partially Paid",
  "rehabilitationStatus": "In Progress",
  "possessionStatus": "Partial",
  "riskScore": 82,
  "riskCategory": "HIGH",
  "delayProbability": 0.82,
  "estimatedDelayDays": 95,
  "mainDelayFactor": "Land Title Disparity & Multi-Owner Claims",
  "mainRiskFactors": [
    "Ancestral property dispute among 14 heirs",
    "Pending high-court injunction petition"
  ],
  "recommendedAction": "Initiate fast-track tribunal arbitration and issue interim compensation payout.",
  "acquisitionStatus": "Valuation & Award",
  "latitude": 16.5062,
  "longitude": 80.6480,
  "geojson": {
    "type": "Polygon",
    "coordinates": [
      [
        [80.6360, 16.4942],
        [80.6600, 16.4942],
        [80.6600, 16.5182],
        [80.6360, 16.5182],
        [80.6360, 16.4942]
      ]
    ]
  },
  "updatedAt": "2026-09-20"
}
```

---

## Map Implementation & Accessibility Features

### Map Components
1. **`TerraTechRiskMap` (`src/components/gis/TerraTechRiskMap.tsx`)**:
   - Built on `react-leaflet` (`MapContainer`, `TileLayer`, `ZoomControl`).
   - Supports switching between **Dark Canvas** (`CartoDB Dark`) and **Satellite View** (`Esri World Imagery`).
   - Includes `MapBoundsController` which automatically adjusts map bounds to encapsulate active parcels.
   - Hosts an interactive Accessibility & Risk Legend overlay.

2. **`ParcelLayer` (`src/components/gis/ParcelLayer.tsx`)**:
   - Renders Leaflet `GeoJSON` layer for parcel polygon boundaries with styled borders and fill colors based on risk severity.
   - Renders custom `L.divIcon` markers with distinct symbols:
     - **LOW Risk**: `#10B981` Green (`✓ LOW`) - Solid Polygon Border
     - **MEDIUM Risk**: `#F59E0B` Yellow (`▲ MED`) - Dashed Polygon Border
     - **HIGH Risk**: `#F97316` Orange (`◆ HIGH`) - Long-dashed Polygon Border
     - **CRITICAL Risk**: `#EF4444` Red (`⯁ CRIT!`) - Pulsing Octagon Badge + Short-dashed Border

3. **`RiskPopup` (`src/components/gis/RiskPopup.tsx`)**:
   - Appears on clicking any map marker or polygon boundary.
   - Displays Parcel ID, Project name, State/District, Land area (Acres), Delay probability (%), Estimated delay (Days), Main risk factors, Recommended corrective action, and a button to launch the full detail drawer.

---

## Required API Endpoints & Request/Response Contracts

The GIS components expect the following RESTful API endpoints from the backend (Express.js or FastAPI):

### 1. Fetch Parcels
- **Endpoint**: `GET /api/parcels`
- **Query Parameters**:
  - `state` (optional): Filter by state name (e.g. `Andhra Pradesh`)
  - `district` (optional): Filter by district (e.g. `Vijayawada`)
  - `project` (optional): Filter by project name
  - `riskCategory` (optional): `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`
  - `searchQuery` (optional): Free text search
- **Response Format**: `Array<LandParcel>` (JSON)

### 2. Fetch Single Parcel Detail
- **Endpoint**: `GET /api/parcels/:id`
- **Response Format**: `LandParcel` object (JSON)

### 3. Fetch Analytics Aggregations
- **Endpoint**: `GET /api/analytics`
- **Query Parameters**: Same filter parameters as `GET /api/parcels`
- **Response Format**: `AnalyticsSummary` object (JSON)

---

## Analytics Suite (Recharts Integration)

Located in `src/components/charts/`, 7 reusable Recharts components consume props dynamically:

1. **`StateWiseDelayTrend`**: BarChart showing average delay days and high-risk parcel count per state.
2. **`DistrictWiseRiskDistribution`**: Stacked BarChart detailing Low/Med/High/Critical parcels per district.
3. **`RiskCategoryDistribution`**: Donut / PieChart displaying percentage share of risk levels.
4. **`AverageDelayDuration`**: BarChart comparing average and peak delay days by project sector.
5. **`ProjectsByStatus`**: Horizontal BarChart showing parcel count by land acquisition stage.
6. **`TopDelayFactors`**: Horizontal BarChart highlighting leading root causes and average impact scores.
7. **`MonthlyDelayTrend`**: AreaChart tracking 6-month historical AI predictions vs actual recorded delays.

---

## Component Sitemap

```
src/
├── types/
│   └── gis.ts                      # Parcel, Filter, and Analytics TS interfaces
├── data/
│   ├── mockParcels.ts              # Synthetic land parcel dataset with GeoJSON
│   └── mockAnalytics.ts            # Dynamic aggregation logic for analytics charts
├── services/
│   └── api.ts                      # API client service layer
├── utils/
│   └── gisUtils.ts                 # Risk color/symbol mapping & formatters
├── components/
│   ├── gis/
│   │   ├── TerraTechRiskMap.tsx    # Leaflet map container & controls
│   │   ├── ParcelLayer.tsx         # GeoJSON polygons & marker badges
│   │   ├── RiskPopup.tsx           # Map popup component
│   │   ├── StateFilter.tsx         # State dropdown filter
│   │   ├── DistrictFilter.tsx      # District dropdown filter
│   │   ├── ProjectFilter.tsx       # Project dropdown filter
│   │   ├── RiskCategoryFilter.tsx  # Risk category dropdown filter
│   │   └── SearchBar.tsx           # Search input & reset controls
│   ├── charts/
│   │   ├── StateWiseDelayTrend.tsx
│   │   ├── DistrictWiseRiskDistribution.tsx
│   │   ├── RiskCategoryDistribution.tsx
│   │   ├── AverageDelayDuration.tsx
│   │   ├── ProjectsByStatus.tsx
│   │   ├── TopDelayFactors.tsx
│   │   └── MonthlyDelayTrend.tsx
│   └── dashboard/
│       ├── GISDashboard.tsx        # Master dashboard view
│       ├── StatCards.tsx           # KPI header card grid
│       └── ParcelDetailModal.tsx   # Detailed slide-over drawer
├── App.tsx
├── index.css
└── main.tsx
```

---

## How to Run the GIS Module

### Prerequisites
- **Node.js**: v18+ or v20+
- **npm** or **yarn**

### Installation & Development Server
```bash
# Navigate to project directory
cd d:/Manoj/SIH/TERRATECH

# Install dependencies (if not already done)
npm install

# Start local Vite development server
npm run dev
```

The application will launch at `http://localhost:3000`.

### Type Check & Production Build
```bash
# Run TypeScript compilation check
npm run lint

# Build production bundle
npm run build
```
