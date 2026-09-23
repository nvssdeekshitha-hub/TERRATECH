# TerraTech - Target Variable Analysis

**PRIMARY CLASSIFICATION TARGET**:
```python
TARGET_COLUMN = "delay_status"
```

**SECONDARY REGRESSION TARGET (DURATION)**:
```python
CONTINUOUS_TARGET_COLUMN = "delay_days"
```

---

## 1. Target Definition & Formulation

In the TerraTech land acquisition lifecycle, delay is defined in accordance with statutory milestones under the **Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement (RFCTLARR) Act, 2013** and infrastructure execution benchmarks (e.g., NHAI, Ministry of Railways).

### A. Classification Target: `delay_status`
- **Definition**:
  \[
  \text{delay\_status} = \begin{cases} 
  1, & \text{if } \text{delay\_days} > 90 \quad (\text{Statutory/Significant Delay}) \\
  0, & \text{if } \text{delay\_days} \le 90 \quad (\text{On-Schedule / Acceptable Operational Drift}) 
  \end{cases}
  \]
- **Operational Rationale**:
  Minor procedural drift of up to 90 days commonly occurs due to revenue notice periods and gazette publication schedules without impacting overall project commissioning. A delay exceeding 90 calendar days triggers contractual penalties, escalating compensation claims, and secondary infrastructure deadlocks.
- **Distribution in Cleaned Dataset (2,500 records)**:
  - Class `0` (No Significant Delay): 785 records (31.4%)
  - Class `1` (Delayed): 1,715 records (68.6%)
  - Base Rate: ~68.6% positive class representation, reflecting real-world complexities where the majority of land acquisition processes in India face statutory timeline overruns.

### B. Continuous Regression Target: `delay_days`
- **Definition**: The net calendar days elapsed between the contractual/baseline milestone target (`planned_completion_date`) and the physical possession handover date (`actual_completion_date`).
- **Distribution Summary**:
  - Minimum: 0 days (completed on schedule or ahead)
  - 25th Percentile: 41 days
  - Median: 195 days
  - Mean: 211.7 days
  - 75th Percentile: 345 days
  - Maximum: 720 days

---

## 2. Statistical Health & Suitability for Supervised Learning

1. **Information Sufficiency**: Both categorical binary classification (`delay_status`) and numeric duration forecasting (`delay_days`) are directly supported with 2,500 observations across 53 districts.
2. **Non-Trivial Separability**: Target outcomes were generated via a probabilistic logistic formulation infused with stochastic Gaussian noise (\(\epsilon \sim \mathcal{N}(0, 0.45)\)). This prevents artificial 100% linear separability, ensuring that Member 1 (ML/AI) can train robust tree-based models (XGBoost, Random Forest) or neural architectures with realistic validation loss curves.
3. **Censoring Handling**: For active/ongoing acquisitions where `actual_completion_date` is pending (approx. 16% of raw records), historical retrospective audit labels have been supplied for training. For inference on live pipelines, Member 1 should predict `P(delay_status = 1 | features)` as an early-warning signal.

---

## 3. Actionable Recommendations for Member 1 (ML / AI Team)

- **Primary Metric Recommendation**: Optimize for **PR-AUC (Precision-Recall AUC)** and **F1-Score (macro)** rather than raw accuracy, given the 68.6% vs 31.4% class distribution.
- **Cost-Sensitive Learning**: In government infrastructure projects, false negatives (failing to detect a delay before it happens) carry significantly higher fiscal costs than false positives (triggering proactive administrative review). Use sample weighting or adjusted classification thresholds (e.g., threshold at 0.40 probability).
- **Two-Stage Multi-Task Architecture**:
  1. **Stage 1 (Classification)**: Predict `delay_status` using XGBoost / LightGBM.
  2. **Stage 2 (Conditional Regression)**: For parcels where `P(delay_status = 1) > threshold`, estimate expected `delay_days` duration.
- **Explainability Interface (Member 5 - XAI)**: The target's correlation with `legal_dispute`, `documentation_completeness`, and `compensation_pending_days` aligns cleanly with TreeSHAP and KernelSHAP attribution engines.
