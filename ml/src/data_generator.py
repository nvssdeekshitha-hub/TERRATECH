import numpy as np
import pandas as pd
from typing import Optional
from pathlib import Path
import sys

# Ensure parent directory is in path for imports when run as script
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from ml.src.config import (
    PROJECT_TYPES,
    STATE_DISTRICT_MAP,
    RAW_DATA_PATH,
    SEED
)


def generate_synthetic_data(num_samples: int = 3000, seed: int = SEED) -> pd.DataFrame:
    """
    Generates a realistic synthetic dataset for Indian land acquisition project delays.

    Features:
    - project_type, state, district
    - land_area_acres, affected_families
    - ownership_complexity, documentation_completeness, legal_dispute
    - compensation_status, approval_status, rehabilitation_status, possession_status
    - stakeholder_responsiveness, administrative_processing_days, historical_delay_rate

    Targets:
    - is_delayed (binary 0/1)
    - delay_duration_days (int >= 0)
    """
    np.random.seed(seed)

    states = list(STATE_DISTRICT_MAP.keys())
    state_choices = np.random.choice(states, size=num_samples)
    district_choices = [
        np.random.choice(STATE_DISTRICT_MAP[st]) for st in state_choices
    ]
    project_choices = np.random.choice(PROJECT_TYPES, size=num_samples)

    # Land area (acres): skewed log-normal distribution (e.g. 5 to 500 acres)
    land_area_acres = np.round(np.random.lognormal(mean=3.5, sigma=0.8, size=num_samples), 2)
    land_area_acres = np.clip(land_area_acres, 2.0, 1500.0)

    # Affected families: correlated with land area with random noise
    affected_families = np.round(land_area_acres * np.random.uniform(0.3, 1.8, size=num_samples) + np.random.randint(0, 30, size=num_samples)).astype(int)
    affected_families = np.clip(affected_families, 1, 2000)

    # Ownership complexity: uniform 0.1 to 0.95
    ownership_complexity = np.round(np.random.uniform(0.1, 0.95, size=num_samples), 2)

    # Documentation completeness: uniform 0.2 to 0.98
    documentation_completeness = np.round(np.random.uniform(0.2, 0.98, size=num_samples), 2)

    # Legal dispute: binary (0 or 1), probability increases with high ownership complexity & affected families
    dispute_prob = 0.15 + 0.35 * ownership_complexity + 0.1 * (affected_families > 100)
    dispute_prob = np.clip(dispute_prob, 0.05, 0.85)
    legal_dispute = (np.random.uniform(0, 1, size=num_samples) < dispute_prob).astype(int)

    # Administrative processing days: normal distribution around 120-250 days
    admin_days = np.random.normal(loc=160, scale=45, size=num_samples)
    admin_days = np.clip(admin_days, 30, 365).astype(int)

    # Operational status metrics (0.0 to 1.0)
    compensation_status = np.round(np.random.uniform(0.1, 1.0, size=num_samples), 2)
    approval_status = np.round(np.random.uniform(0.1, 1.0, size=num_samples), 2)
    rehabilitation_status = np.round(np.random.uniform(0.1, 1.0, size=num_samples), 2)
    possession_status = np.round(np.random.uniform(0.05, 0.95, size=num_samples), 2)
    stakeholder_responsiveness = np.round(np.random.uniform(0.2, 0.95, size=num_samples), 2)

    # Historical delay rate (0.05 to 0.65)
    historical_delay_rate = np.round(np.random.uniform(0.05, 0.65, size=num_samples), 2)

    # --- Domain Logic for Targets ---
    # Propensity score calculation based on risk factors
    delay_score = (
        0.35 * (1.0 - documentation_completeness) +
        0.45 * legal_dispute +
        0.30 * ownership_complexity +
        0.30 * (1.0 - compensation_status) +
        0.25 * (1.0 - approval_status) +
        0.25 * (1.0 - rehabilitation_status) +
        0.30 * (1.0 - possession_status) +
        0.25 * (1.0 - stakeholder_responsiveness) +
        0.20 * (admin_days / 365.0) +
        0.25 * historical_delay_rate +
        0.15 * (affected_families / 1000.0)
    )

    # Convert propensity score to delay probability using sigmoid logic with threshold offset
    # Base intercept shifts mean probability to ~40-45%
    prob_delay = 1.0 / (1.0 + np.exp(-(delay_score - 1.2) * 3.5))

    # Binary delay target with probabilistic outcome + noise
    is_delayed = (np.random.uniform(0, 1, size=num_samples) < prob_delay).astype(int)

    # Delay duration in days: if delayed, base delay scales with propensity + random variation
    base_delay_days = np.where(
        is_delayed == 1,
        30 + delay_score * 120 + np.random.exponential(scale=40, size=num_samples),
        0
    )

    # Add minor noise for edge cases where is_delayed is 0 but small grace period
    delay_duration_days = np.round(base_delay_days).astype(int)
    delay_duration_days = np.where(is_delayed == 0, 0, np.clip(delay_duration_days, 15, 450))

    df = pd.DataFrame({
        "project_type": project_choices,
        "state": state_choices,
        "district": district_choices,
        "land_area_acres": land_area_acres,
        "affected_families": affected_families,
        "ownership_complexity": ownership_complexity,
        "documentation_completeness": documentation_completeness,
        "legal_dispute": legal_dispute,
        "compensation_status": compensation_status,
        "approval_status": approval_status,
        "rehabilitation_status": rehabilitation_status,
        "possession_status": possession_status,
        "stakeholder_responsiveness": stakeholder_responsiveness,
        "administrative_processing_days": admin_days,
        "historical_delay_rate": historical_delay_rate,
        "is_delayed": is_delayed,
        "delay_duration_days": delay_duration_days
    })

    return df


def main(num_samples: int = 3000, output_path: Optional[Path] = None):
    output_path = output_path or RAW_DATA_PATH
    print(f"Generating synthetic land acquisition dataset with {num_samples} samples...")
    df = generate_synthetic_data(num_samples=num_samples, seed=SEED)
    df.to_csv(output_path, index=False)
    print(f"Dataset successfully saved to: {output_path}")
    print(f"Dataset Shape: {df.shape}")
    print("Class distribution ('is_delayed'):")
    print(df['is_delayed'].value_counts(normalize=True))
    print("\nSummary of delay_duration_days:")
    print(df['delay_duration_days'].describe())


if __name__ == "__main__":
    main()
