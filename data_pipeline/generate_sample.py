"""
TerraTech - Synthetic Demonstration Data Generator
Member 2: Data Engineering Layer

Generates realistic land-acquisition demonstration data covering 2,500 parcel records
across 10 Indian states with non-deterministic probabilistic delay relationships.
"""

import sys
import random
from datetime import datetime, timedelta
import numpy as np
import pandas as pd

from config import (
    SYNTHETIC_DATA_PATH,
    SAMPLE_DATA_DIR,
    RANDOM_SEED,
    INDIAN_LOCATIONS,
    PROJECT_TYPES,
    OWNERSHIP_COMPLEXITY_LEVELS,
    COMPENSATION_STATUS_LEVELS,
    NOTIFICATION_STATUS_LEVELS,
    APPROVAL_STATUS_LEVELS,
    POSSESSION_STATUS_LEVELS,
    STAKEHOLDER_RESPONSIVENESS_LEVELS
)

def set_seed(seed=RANDOM_SEED):
    random.seed(seed)
    np.random.seed(seed)

def generate_synthetic_dataset(num_records=2500):
    set_seed(RANDOM_SEED)
    SAMPLE_DATA_DIR.mkdir(parents=True, exist_ok=True)

    states = list(INDIAN_LOCATIONS.keys())
    
    # 1. Generate ~250 Parent Infrastructure Projects
    num_projects = 260
    projects = []
    
    project_name_templates = {
        "Highway / Expressway": ["{state} Green Express Corridor Phase {phase}", "NH-{num} Four-Laning Bypass Section {phase}", "Bharatmala Economic Highway Ring {phase}"],
        "Railway & Freight Corridor": ["{state} Dedicated High-Speed Rail Segment {phase}", "Western Freight Corridor Spur Line {phase}", "Industrial Rail Siding Network {phase}"],
        "Renewable / Solar Park": ["{district} Ultra Mega Solar Park Unit {phase}", "{state} Clean Energy Hub Sector {phase}", "Wind-Solar Hybrid Energy Grid {phase}"],
        "Industrial Corridor / SEZ": ["{district} Multi-Modal Logistics Park {phase}", "DMIC Special Investment Region Node {phase}", "{state} Integrated Industrial Township {phase}"],
        "Urban Metro / Transit": ["{district} Metro Rail Extension Corridor {phase}", "Suburban Commuter Rapid Transit Line {phase}", "Urban Flyover & Transit Hub {phase}"],
        "Irrigation / Water Canal": ["{district} Lift Irrigation Main Canal Reach {phase}", "{state} Inter-River Linking Canal Sector {phase}", "Command Area Distribution Network {phase}"],
        "Airport Infrastructure": ["{district} Greenfield International Airport Phase {phase}", "{district} Cargo Terminal Expansion {phase}", "Aviation Logistics Runway Package {phase}"]
    }

    for i in range(1, num_projects + 1):
        p_id = f"PRJ-{1000 + i}"
        state = random.choice(states)
        loc_meta = INDIAN_LOCATIONS[state]
        district = random.choice(loc_meta["districts"])
        ptype = random.choice(PROJECT_TYPES)
        template = random.choice(project_name_templates[ptype])
        p_name = template.format(state=state, district=district, phase=random.randint(1, 5), num=random.randint(20, 99))
        
        # Base project timeline
        start_year = random.choice([2021, 2022, 2023, 2024])
        start_month = random.randint(1, 12)
        start_day = random.randint(1, 28)
        start_date = datetime(start_year, start_month, start_day)
        duration_days = random.randint(365, 1095)
        planned_completion = start_date + timedelta(days=duration_days)

        projects.append({
            "project_id": p_id,
            "project_name": p_name,
            "project_type": ptype,
            "state": state,
            "district": district,
            "lat_bounds": loc_meta["lat_range"],
            "lon_bounds": loc_meta["lon_range"],
            "start_date": start_date,
            "planned_completion_date": planned_completion
        })

    # 2. Generate Parcels distributed across projects
    records = []
    parcel_counter = 10001
    
    for _ in range(num_records):
        proj = random.choice(projects)
        parcel_id = f"PCL-{parcel_counter}"
        parcel_counter += 1

        # Geospatial Coordinates within district bounds
        lat = round(random.uniform(proj["lat_bounds"][0] + 0.05, proj["lat_bounds"][1] - 0.05), 6)
        lon = round(random.uniform(proj["lon_bounds"][0] + 0.05, proj["lon_bounds"][1] - 0.05), 6)

        # Land area (acres) - skewed lognormal
        land_area = round(float(np.random.lognormal(mean=3.5, sigma=0.8)), 2)
        land_area = max(5.0, min(1200.0, land_area))

        # Affected families - correlated with land area and urban/rural density
        density_factor = 2.4 if proj["project_type"] in ["Urban Metro / Transit", "Airport Infrastructure"] else 1.1
        noise_family = np.random.normal(0, 8)
        affected_families = max(2, int(land_area * density_factor * random.uniform(0.6, 1.8) + noise_family))

        # Ownership Complexity
        if affected_families > 150 or land_area > 200:
            complexity_weights = [0.10, 0.25, 0.40, 0.25]
        else:
            complexity_weights = [0.35, 0.40, 0.20, 0.05]
        ownership_complexity = random.choices(OWNERSHIP_COMPLEXITY_LEVELS, weights=complexity_weights)[0]

        # Documentation completeness (0.15 to 1.0)
        doc_completeness = round(float(np.clip(np.random.beta(a=5, b=2.2), 0.15, 1.0)), 2)

        # Historical delay rate in district / type (0.10 to 0.85)
        hist_delay_rate = round(float(np.clip(np.random.beta(a=3, b=4), 0.08, 0.85)), 3)

        # Stakeholder responsiveness
        if ownership_complexity in ["High", "Very High"] or doc_completeness < 0.45:
            resp_weights = [0.15, 0.30, 0.35, 0.20]
        else:
            resp_weights = [0.50, 0.35, 0.12, 0.03]
        stakeholder_resp = random.choices(STAKEHOLDER_RESPONSIVENESS_LEVELS, weights=resp_weights)[0]

        # Legal dispute: correlated with complexity, poor documentation, and hostile response
        dispute_logit = (
            -2.2
            + 1.8 * (1.0 if ownership_complexity in ["High", "Very High"] else 0.0)
            + 1.5 * (1.0 if doc_completeness < 0.45 else 0.0)
            + 2.0 * (1.0 if stakeholder_resp in ["Hostile / Legal Injunction", "Low / Resistant"] else 0.0)
            + np.random.normal(0, 0.4)
        )
        p_dispute = 1.0 / (1.0 + np.exp(-dispute_logit))
        legal_dispute = 1 if (random.random() < p_dispute) else 0

        # Compensation status & pending days
        if legal_dispute == 1:
            comp_weights = [0.05, 0.20, 0.40, 0.35]
        else:
            comp_weights = [0.45, 0.35, 0.18, 0.02]
        compensation_status = random.choices(COMPENSATION_STATUS_LEVELS, weights=comp_weights)[0]

        if compensation_status == "Fully Disbursed":
            compensation_pending_days = 0
        elif compensation_status == "Partially Disbursed":
            compensation_pending_days = random.randint(30, 180)
        elif compensation_status == "Pending Disbursal":
            compensation_pending_days = random.randint(90, 365)
        else:  # Disputed in Escrow
            compensation_pending_days = random.randint(180, 650)

        # Notification status under RFCTLARR Act
        notif_status = random.choice(NOTIFICATION_STATUS_LEVELS)

        # Approval status & processing days
        approval_weights = [0.45, 0.25, 0.15, 0.10, 0.05]
        approval_status = random.choices(APPROVAL_STATUS_LEVELS, weights=approval_weights)[0]
        base_app_days = 45 if approval_status == "Approved" else 150
        approval_processing_days = int(np.clip(np.random.normal(base_app_days, 40), 15, 520))

        # Rehabilitation progress (0.0 to 1.0)
        rehab_progress = round(float(np.clip(np.random.beta(a=3.5, b=2.5), 0.0, 1.0)), 2)

        # Possession status
        if legal_dispute == 1 or compensation_pending_days > 200:
            poss_weights = [0.05, 0.15, 0.25, 0.25, 0.30]
        else:
            poss_weights = [0.35, 0.30, 0.20, 0.12, 0.03]
        possession_status = random.choices(POSSESSION_STATUS_LEVELS, weights=poss_weights)[0]

        # Administrative processing days
        admin_days = int(np.clip(np.random.normal(210, 85), 30, 750))

        # --- Latent Risk Score & Probabilistic Delay Determination ---
        # Logit formula for delay risk
        z = (
            -2.8
            + 2.1 * legal_dispute
            + 2.4 * (1.0 - doc_completeness)
            + 0.0055 * min(compensation_pending_days, 400)
            + 0.0040 * approval_processing_days
            + 1.8 * (1.0 - rehab_progress)
            + 1.7 * (1.0 if ownership_complexity == "Very High" else 0.8 if ownership_complexity == "High" else 0.3 if ownership_complexity == "Medium" else 0.0)
            - 1.6 * (1.0 if stakeholder_resp == "High / Cooperative" else 0.3 if stakeholder_resp == "Moderate" else -0.5 if stakeholder_resp == "Low / Resistant" else -1.4)
            + 2.2 * hist_delay_rate
            + 0.0025 * (admin_days - 180)
            + np.random.normal(0, 0.55)  # Stochastic variation/noise
        )
        p_delay = 1.0 / (1.0 + np.exp(-z))
        delay_status = 1 if (random.random() < p_delay) else 0

        # Delay duration in days
        if delay_status == 1:
            delay_days = int(max(91, 90 + z * 50 + np.random.normal(60, 45)))
            delay_days = min(720, delay_days)
        else:
            delay_days = int(max(0, np.random.normal(25, 20)))
            if delay_days > 90:
                delay_days = 85  # Cap non-delayed records strictly <= 90 days

        # Dates
        planned_completion_date = proj["planned_completion_date"].strftime("%Y-%m-%d")
        
        # Actual completion date: known for retrospective/historical records
        # Projects planned before late 2024 have actual completion; newer ones may still be underway
        if proj["planned_completion_date"] < datetime(2024, 10, 1):
            act_date = proj["planned_completion_date"] + timedelta(days=delay_days)
            actual_completion_date = act_date.strftime("%Y-%m-%d")
        else:
            # Active in-flight project (outcome observed in milestone audit, actual date future/open)
            if random.random() < 0.25:
                actual_completion_date = ""  # Still ongoing
            else:
                act_date = proj["planned_completion_date"] + timedelta(days=delay_days)
                actual_completion_date = act_date.strftime("%Y-%m-%d")

        records.append({
            "project_id": proj["project_id"],
            "parcel_id": parcel_id,
            "project_name": proj["project_name"],
            "project_type": proj["project_type"],
            "state": proj["state"],
            "district": proj["district"],
            "land_area_acres": land_area,
            "affected_families": affected_families,
            "ownership_complexity": ownership_complexity,
            "documentation_completeness": doc_completeness,
            "legal_dispute": legal_dispute,
            "compensation_status": compensation_status,
            "compensation_pending_days": compensation_pending_days,
            "notification_status": notif_status,
            "approval_status": approval_status,
            "approval_processing_days": approval_processing_days,
            "rehabilitation_progress": rehab_progress,
            "possession_status": possession_status,
            "stakeholder_responsiveness": stakeholder_resp,
            "administrative_processing_days": admin_days,
            "historical_delay_rate": hist_delay_rate,
            "planned_completion_date": planned_completion_date,
            "actual_completion_date": actual_completion_date,
            "delay_days": delay_days,
            "delay_status": delay_status,
            "latitude": lat,
            "longitude": lon
        })

    df = pd.DataFrame(records)

    # 3. Inject realistic data-cleaning challenges (so clean_data.py has authentic tasks to solve)
    # A. Minor whitespace & casing inconsistencies in ~3% of text fields
    indices_text = np.random.choice(df.index, size=int(0.03 * len(df)), replace=False)
    for idx in indices_text:
        col = random.choice(["district", "project_type", "ownership_complexity"])
        val = str(df.at[idx, col])
        if random.random() < 0.5:
            df.at[idx, col] = f"  {val}  "
        else:
            df.at[idx, col] = val.lower()

    # B. Missing values in optional/derived fields (e.g. 15 missing coordinates, 20 missing PAFs)
    na_coords = np.random.choice(df.index, size=15, replace=False)
    df.loc[na_coords, "latitude"] = np.nan
    df.loc[na_coords, "longitude"] = np.nan

    na_families = np.random.choice(df.index, size=20, replace=False)
    df.loc[na_families, "affected_families"] = np.nan

    na_rehab = np.random.choice(df.index, size=25, replace=False)
    df.loc[na_rehab, "rehabilitation_progress"] = np.nan

    # C. Minor duplicate rows (5 duplicate rows)
    dup_indices = np.random.choice(df.index, size=5, replace=False)
    dup_rows = df.loc[dup_indices].copy()
    df = pd.concat([df, dup_rows], ignore_index=True)

    # Export raw sample
    df.to_csv(SYNTHETIC_DATA_PATH, index=False)
    print(f"[SUCCESS] Generated {len(df)} synthetic records at {SYNTHETIC_DATA_PATH}")
    return df

if __name__ == "__main__":
    generate_synthetic_dataset(num_records=2500)
