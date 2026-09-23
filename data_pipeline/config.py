"""
TerraTech - Data Pipeline Configuration
Member 2: Data Engineering Layer

Central configuration defining paths, column schemas, categories,
validation thresholds, and data leakage isolation rules.
"""

from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
SAMPLE_DATA_DIR = DATA_DIR / "sample"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
VALIDATION_DATA_DIR = DATA_DIR / "validation"
DATABASE_DIR = BASE_DIR / "database"
SEED_DATA_DIR = DATABASE_DIR / "seed_data"

# File Paths
SYNTHETIC_DATA_PATH = SAMPLE_DATA_DIR / "terra_land_acquisition_synthetic.csv"
CLEANED_DATA_PATH = PROCESSED_DATA_DIR / "cleaned_land_acquisition.csv"
ML_DATASET_PATH = PROCESSED_DATA_DIR / "ml_dataset.csv"
PROFILING_JSON_PATH = VALIDATION_DATA_DIR / "profiling_report.json"
PROFILING_MD_PATH = VALIDATION_DATA_DIR / "profiling_report.md"
VALIDATION_REPORT_PATH = VALIDATION_DATA_DIR / "quality_report.txt"
PROJECTS_SEED_PATH = SEED_DATA_DIR / "projects_seed.csv"
PARCELS_SEED_PATH = SEED_DATA_DIR / "parcels_seed.csv"

# Global Random Seed for Reproducibility
RANDOM_SEED = 42

# Column Definitions
ID_COLUMNS = ["project_id", "parcel_id"]
METADATA_COLUMNS = ["project_name"]

GEOGRAPHIC_COLUMNS = [
    "state",
    "district",
    "latitude",
    "longitude"
]

PROJECT_CHARACTERISTICS = [
    "project_type",
    "land_area_acres",
    "affected_families",
    "ownership_complexity"
]

PROCESS_PROGRESS_COLUMNS = [
    "documentation_completeness",
    "legal_dispute",
    "compensation_status",
    "compensation_pending_days",
    "notification_status",
    "approval_status",
    "approval_processing_days",
    "rehabilitation_progress",
    "possession_status",
    "stakeholder_responsiveness",
    "administrative_processing_days",
    "historical_delay_rate"
]

TIMELINE_COLUMNS = [
    "planned_completion_date",
    "actual_completion_date"
]

TARGET_COLUMNS = [
    "delay_status",  # Primary classification target (0: On-time / No significant delay, 1: Delayed)
    "delay_days"     # Primary regression target (duration in days)
]

# Strict Data Leakage Prevention Lists
# Features that are safe to use for early-warning predictive inference
SAFE_PREDICTIVE_FEATURES = [
    "project_type",
    "state",
    "district",
    "land_area_acres",
    "affected_families",
    "ownership_complexity",
    "documentation_completeness",
    "legal_dispute",
    "compensation_status",
    "compensation_pending_days",
    "notification_status",
    "approval_status",
    "approval_processing_days",
    "rehabilitation_progress",
    "possession_status",
    "stakeholder_responsiveness",
    "administrative_processing_days",
    "historical_delay_rate",
    "planned_duration_days",
    "family_density_per_acre",
    "land_per_family",
    "composite_risk_proxy"
]

# Features that MUST NOT be used for predicting delay_status
UNSAFE_LEAKAGE_FEATURES = [
    "actual_completion_date",
    "delay_days",
    "delay_status"  # Target itself is not an input feature
]

# Categorical Domains
PROJECT_TYPES = [
    "Highway / Expressway",
    "Railway & Freight Corridor",
    "Renewable / Solar Park",
    "Industrial Corridor / SEZ",
    "Urban Metro / Transit",
    "Irrigation / Water Canal",
    "Airport Infrastructure"
]

OWNERSHIP_COMPLEXITY_LEVELS = ["Low", "Medium", "High", "Very High"]

COMPENSATION_STATUS_LEVELS = [
    "Fully Disbursed",
    "Partially Disbursed",
    "Pending Disbursal",
    "Disputed in Escrow"
]

NOTIFICATION_STATUS_LEVELS = [
    "Preliminary Notification (Sec 11)",
    "Declaration Published (Sec 19)",
    "Award Declared (Sec 23)",
    "Possession Taken (Sec 38)",
    "Notification Pending"
]

APPROVAL_STATUS_LEVELS = [
    "Approved",
    "Under Scrutiny",
    "Conditional Clearance",
    "Pending Environmental Clearance",
    "Resubmission Required"
]

POSSESSION_STATUS_LEVELS = [
    "Full Possession",
    "Substantial Possession (>70%)",
    "Partial Possession (30-70%)",
    "Initial Stage (<30%)",
    "Contested / Encroached"
]

STAKEHOLDER_RESPONSIVENESS_LEVELS = [
    "High / Cooperative",
    "Moderate",
    "Low / Resistant",
    "Hostile / Legal Injunction"
]

# Realistic Geographic Bounds for Demonstration (Indian States & Districts)
INDIAN_LOCATIONS = {
    "Maharashtra": {
        "districts": ["Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur"],
        "lat_range": (18.0, 21.0),
        "lon_range": (73.0, 79.5)
    },
    "Gujarat": {
        "districts": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Kutch", "Bharuch"],
        "lat_range": (21.0, 24.0),
        "lon_range": (69.0, 73.5)
    },
    "Uttar Pradesh": {
        "districts": ["Lucknow", "Varanasi", "Noida", "Kanpur", "Agra", "Prayagraj"],
        "lat_range": (25.0, 28.5),
        "lon_range": (78.0, 83.5)
    },
    "Karnataka": {
        "districts": ["Bengaluru Rural", "Mysuru", "Belagavi", "Dharwad", "Kalaburagi"],
        "lat_range": (12.5, 17.5),
        "lon_range": (74.5, 77.8)
    },
    "Tamil Nadu": {
        "districts": ["Kanchipuram", "Coimbatore", "Salem", "Tiruchirappalli", "Madurai"],
        "lat_range": (9.5, 13.0),
        "lon_range": (77.0, 80.2)
    },
    "Andhra Pradesh": {
        "districts": ["Visakhapatnam", "Krishna", "Guntur", "Nellore", "Kurnool"],
        "lat_range": (14.0, 18.5),
        "lon_range": (78.0, 83.0)
    },
    "Odisha": {
        "districts": ["Khurda", "Sundargarh", "Angul", "Jajpur", "Cuttack"],
        "lat_range": (19.5, 22.2),
        "lon_range": (84.0, 86.8)
    },
    "Rajasthan": {
        "districts": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Alwar"],
        "lat_range": (24.0, 28.5),
        "lon_range": (71.0, 77.0)
    },
    "Madhya Pradesh": {
        "districts": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
        "lat_range": (22.0, 26.5),
        "lon_range": (75.0, 81.5)
    },
    "Haryana": {
        "districts": ["Gurugram", "Faridabad", "Panipat", "Karnal", "Hisar"],
        "lat_range": (28.0, 30.5),
        "lon_range": (75.5, 77.5)
    }
}
