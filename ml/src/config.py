import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"
NOTEBOOKS_DIR = BASE_DIR / "notebooks"

# Ensure directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
MODELS_DIR.mkdir(parents=True, exist_ok=True)
NOTEBOOKS_DIR.mkdir(parents=True, exist_ok=True)

# Random Seed for Reproducibility
SEED = 42

# Data Paths
RAW_DATA_PATH = DATA_DIR / "land_acquisition_data.csv"

# Model File Artifact Paths
CLASSIFIER_MODEL_PATH = MODELS_DIR / "classifier_model.joblib"
REGRESSOR_MODEL_PATH = MODELS_DIR / "regressor_model.joblib"
PREPROCESSOR_PATH = MODELS_DIR / "preprocessor.joblib"
METADATA_PATH = MODELS_DIR / "metadata.json"
METRICS_PATH = MODELS_DIR / "model_metrics.json"

# Features Configuration
CATEGORICAL_FEATURES = [
    "project_type",
    "state",
    "district"
]

NUMERICAL_FEATURES = [
    "land_area_acres",
    "affected_families",
    "ownership_complexity",
    "documentation_completeness",
    "legal_dispute",
    "compensation_status",
    "approval_status",
    "rehabilitation_status",
    "possession_status",
    "stakeholder_responsiveness",
    "administrative_processing_days",
    "historical_delay_rate"
]

ALL_FEATURES = CATEGORICAL_FEATURES + NUMERICAL_FEATURES

# Target Variables
CLASSIFICATION_TARGET = "is_delayed"
REGRESSION_TARGET = "delay_duration_days"

# Domain Values for Data Generation
PROJECT_TYPES = [
    "Highways",
    "Railways",
    "Solar Parks",
    "Mining",
    "Urban Infrastructure",
    "Industrial Corridors",
    "Water Resources"
]

STATE_DISTRICT_MAP = {
    "Maharashtra": ["Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"],
    "Uttar Pradesh": ["Lucknow", "Varanasi", "Kanpur", "Agra", "Gorakhpur"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Kutch"],
    "Odisha": ["Jharsuguda", "Sundargarh", "Bhubaneswar", "Cuttack", "Angul"],
    "Tamil Nadu": ["Kanchipuram", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
    "Karnataka": ["Bengaluru Urban", "Mysuru", "Belagavi", "Ballari", "Dakshina Kannada"],
    "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga"],
    "West Bengal": ["North 24 Parganas", "Paschim Bardhaman", "Howrah", "Hooghly", "Murshidabad"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bhilwara"]
}

# Risk Thresholds
RISK_LEVELS = {
    "LOW": (0, 30),
    "MEDIUM": (30, 60),
    "HIGH": (60, 85),
    "CRITICAL": (85, 100)
}

# Current Model Version
MODEL_VERSION = "v1.0.0"
