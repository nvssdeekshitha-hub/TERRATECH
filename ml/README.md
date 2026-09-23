# TerraTech - Machine Learning & AI Module

TerraTech is an AI-powered predictive analytics and decision-support platform designed to detect, quantify, and prevent land acquisition delays across infrastructure and industrial projects.

This directory (`ml/`) contains the complete machine learning architecture, synthetic data generator, model training and comparison pipeline (**Random Forest** baseline vs. **XGBoost**), Explainable AI (SHAP) engine, automated unit testing suite, and production-ready **FastAPI** web service.

---

## 🏗️ Architecture & Directory Structure

```
ml/
├── data/
│   └── land_acquisition_data.csv       # Synthetic training dataset (3,000 samples)
├── models/
│   ├── classifier_model.joblib          # Trained Random Forest / XGBoost Classifier
│   ├── regressor_model.joblib           # Trained Random Forest / XGBoost Regressor
│   ├── preprocessor.joblib              # Fitted Scikit-Learn ColumnTransformer pipeline
│   ├── metadata.json                    # Model versioning, schema, and training metadata
│   └── model_metrics.json               # Baseline vs XGBoost evaluation metrics
├── notebooks/
│   └── exploratory_data_analysis.ipynb  # Interactive EDA, model metrics & SHAP analysis
├── src/
│   ├── config.py                        # Centralized paths, thresholds, and hyperparameters
│   ├── data_generator.py                # Realistic domain-specific synthetic data generator
│   ├── preprocess.py                    # Scikit-Learn OneHot + StandardScaler pipeline
│   ├── train.py                         # Model training, comparison & artifact persistence
│   ├── evaluate.py                      # Standalone CLI evaluation report renderer
│   ├── explainability.py                # SHAP XAI feature contribution & corrective engine
│   ├── predict.py                       # High-level inference engine for single/batch inputs
│   └── api.py                           # Production FastAPI server exposing REST endpoints
├── tests/
│   ├── test_data_generator.py           # Unit tests for data generation
│   ├── test_preprocess.py               # Unit tests for preprocessor pipeline
│   ├── test_train.py                    # Unit tests for training pipeline
│   ├── test_predict.py                  # Unit tests for inference & SHAP explanations
│   └── test_api.py                      # Unit tests for FastAPI HTTP endpoints
├── requirements.txt                     # Python dependencies
└── README.md                            # Comprehensive module documentation
```

---

## 📊 Feature Schema & Input Payload

The model accepts 15 input features representing land parcel and project-level administrative indicators:

| Feature | Type | Range / Options | Description |
| :--- | :--- | :--- | :--- |
| `project_type` | Categorical | Highways, Railways, Solar Parks, Mining, etc. | Sector classification of the project |
| `state` | Categorical | Maharashtra, Uttar Pradesh, Gujarat, Odisha, etc. | State location in India |
| `district` | Categorical | Pune, Lucknow, Ahmedabad, Jharsuguda, etc. | Specific district |
| `land_area_acres` | Numerical | > 0.0 acres | Total land parcel size |
| `affected_families` | Numerical | >= 0 | Total number of displaced or affected families |
| `ownership_complexity` | Numerical | 0.0 - 1.0 | Complexity index of land titles & co-ownership |
| `documentation_completeness` | Numerical | 0.0 - 1.0 | Share of verified title deeds & revenue records |
| `legal_dispute` | Binary | 0 or 1 | Active court cases / litigation status |
| `compensation_status` | Numerical | 0.0 - 1.0 | Proportion of compensation disbursed |
| `approval_status` | Numerical | 0.0 - 1.0 | Statutory clearances completion index |
| `rehabilitation_status` | Numerical | 0.0 - 1.0 | Resettlement & Rehabilitation (R&R) progress |
| `possession_status` | Numerical | 0.0 - 1.0 | Physical land possession completion |
| `stakeholder_responsiveness` | Numerical | 0.0 - 1.0 | Responsiveness index of local community/owners |
| `administrative_processing_days` | Numerical | >= 0 days | Elapsed administrative processing time |
| `historical_delay_rate` | Numerical | 0.0 - 1.0 | Historical delay rate in district/sector |

---

## 🎯 Prediction Outputs & Targets

The ML service delivers four core predictions and actionable insights:

1. **`delay_probability`** (Float `0.00` - `1.00`): Probability of project experiencing deadline slippage.
2. **`risk_score`** (Integer `0` - `100`): Scaled delay severity score derived from classification probability.
3. **`risk_category`** (String):
   - **`LOW`**: Risk Score < 30
   - **`MEDIUM`**: 30 <= Risk Score < 60
   - **`HIGH`**: 60 <= Risk Score < 85
   - **`CRITICAL`**: Risk Score >= 85
4. **`estimated_delay_days`** (Integer >= 0): Predicted additional days of project delay beyond scheduled timeline.
5. **`delay_factors`** (Array): SHAP feature attribution identifying top factors driving delay probability higher.
6. **`corrective_recommendations`** (Array): Domain-specific prescriptive mitigation steps tailored to identified delay factors.

---

## 📈 Model Comparison & Benchmark Results

Model performance evaluated on an **80/20 train/test split** (2,400 train / 600 test samples):

### 1. Classification Performance (Delay Probability & Risk Category)

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Random Forest Baseline** | **0.6817** | **0.6912** | **0.7321** | **0.7110** | **0.7286** |
| **XGBoost Classifier** | 0.6817 | 0.7044 | 0.6978 | 0.7011 | **0.7359** |

* **Selected Classification Model**: `Random Forest Classifier` (Highest F1-Score: `0.7110`).

### 2. Regression Performance (Estimated Delay Duration in Days)

| Model | MAE (Mean Absolute Error) | RMSE (Root Mean Squared Error) |
| :--- | :---: | :---: |
| **Random Forest Baseline** | 91.41 Days | 106.99 Days |
| **XGBoost Regressor** | **89.64 Days** | **106.13 Days** |

* **Selected Regression Model**: `XGBoost Regressor` (Lowest MAE: `89.64 Days`).

---

## 🔍 Explainable AI (SHAP) & Corrective Actions

TerraTech implements **TreeSHAP** via `shap.TreeExplainer` to demystify black-box predictions:
- **Local Attribution**: Calculates exact percentage contribution of each feature towards delay risk for individual land parcels.
- **Prescriptive Guidance**: Maps top risk drivers to targeted administrative interventions (e.g., active disputes trigger Lok Adalat arbitration; low documentation triggers revenue record digitisation drives).

---

## 🚀 Step-by-Step Commands to Run

### 1. Create Virtual Environment & Activate

```powershell
# Windows PowerShell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies

```powershell
pip install -r ml/requirements.txt
```

### 3. Generate Synthetic Dataset

```powershell
python ml/src/data_generator.py
```

### 4. Train Models & Evaluate Performance

```powershell
python ml/src/train.py
```

To display formatted evaluation benchmark table:
```powershell
python ml/src/evaluate.py
```

### 5. Run Automated Unit Tests

```powershell
pytest ml/tests/ -v
```

### 6. Start FastAPI Prediction Server

```powershell
uvicorn ml.src.api:app --host 0.0.0.0 --port 8000 --reload
```

Interactive OpenAPI Swagger Documentation: `http://localhost:8000/docs`

---

## 🔌 API Endpoints Reference

### 1. `GET /health`
- **Response**:
  ```json
  {
    "status": "ok",
    "service": "TerraTech ML Engine",
    "model_version": "v1.0.0",
    "models_loaded": true,
    "timestamp": "2026-09-23T22:44:35"
  }
  ```

### 2. `POST /predict`
- **Payload**:
  ```json
  {
    "project_type": "Highways",
    "state": "Maharashtra",
    "district": "Pune",
    "land_area_acres": 100,
    "affected_families": 50,
    "ownership_complexity": 0.6,
    "documentation_completeness": 0.7,
    "legal_dispute": 1,
    "compensation_status": 0.5,
    "approval_status": 0.4,
    "rehabilitation_status": 0.5,
    "possession_status": 0.2,
    "stakeholder_responsiveness": 0.6,
    "administrative_processing_days": 180,
    "historical_delay_rate": 0.3
  }
  ```
- **Response**:
  ```json
  {
    "delay_probability": 0.8145,
    "risk_score": 81,
    "risk_category": "HIGH",
    "estimated_delay_days": 112,
    "delay_factors": [
      {
        "feature": "legal_dispute",
        "transformed_feature": "num__legal_dispute",
        "impact_score": 0.1845,
        "current_value": "1",
        "description": "Feature 'legal_dispute' (value: 1) increases delay risk by +18.5%"
      }
    ],
    "corrective_recommendations": [
      "Active legal dispute detected: Deploy fast-track Lok Adalat arbitration and out-of-court settlement committee to expedite land dispute resolution.",
      "Pending statutory approvals: Escalate forest, environmental, and inter-departmental clearances to state single-window approval committee."
    ],
    "model_version": "v1.0.0"
  }
  ```

### 3. `POST /retrain`
- **Payload**: `{"sample_count": 3000, "force_retrain": true}`
- **Behavior**: Generates fresh synthetic training data, retrains baseline and XGBoost models, saves updated artifacts, updates metadata versioning, and reloads models in memory.

### 4. `GET /metrics`
- **Response**: Returns JSON object containing full Random Forest vs. XGBoost baseline classification and regression benchmark metrics.

---

## 🔗 Node.js / Express Backend Integration Example

To connect the Node.js/Express backend service to this Python FastAPI ML service:

```javascript
// Node.js Express integration snippet
const axios = require('axios');

async function getLandDelayPrediction(parcelData) {
  try {
    const response = await axios.post('http://localhost:8000/predict', parcelData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    console.error('Error querying TerraTech ML Service:', error.response?.data || error.message);
    throw error;
  }
}
```
