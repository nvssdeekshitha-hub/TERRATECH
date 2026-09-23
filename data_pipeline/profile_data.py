"""
TerraTech - Data Profiling Script
Member 2: Data Engineering Layer

Inspects dataset structure, data types, missing values, duplicates,
numerical statistics, categorical distributions, date ranges, and outliers.
Saves comprehensive reports in JSON and Markdown formats in data/validation/.
"""

import json
from pathlib import Path
import numpy as np
import pandas as pd

from config import (
    SYNTHETIC_DATA_PATH,
    PROFILING_JSON_PATH,
    PROFILING_MD_PATH,
    VALIDATION_DATA_DIR,
    UNSAFE_LEAKAGE_FEATURES
)

def profile_dataset(file_path=SYNTHETIC_DATA_PATH):
    print(f"[PROFILING] Reading dataset from: {file_path}")
    if not Path(file_path).exists():
        raise FileNotFoundError(f"Dataset not found at {file_path}")

    df = pd.read_csv(file_path)
    total_rows, total_cols = df.shape

    # 1. Basic Metadata
    duplicate_count = int(df.duplicated().sum())

    # 2. Column-by-column profiling
    columns_profile = {}
    numerical_stats = {}
    categorical_distributions = {}
    date_ranges = {}
    outlier_summary = {}

    date_columns = ["planned_completion_date", "actual_completion_date"]

    for col in df.columns:
        col_series = df[col]
        missing_count = int(col_series.isna().sum())
        missing_pct = round((missing_count / total_rows) * 100, 2)
        unique_count = int(col_series.nunique())

        col_dtype = str(col_series.dtype)
        is_leakage = col in UNSAFE_LEAKAGE_FEATURES

        columns_profile[col] = {
            "dtype": col_dtype,
            "missing_count": missing_count,
            "missing_percentage": missing_pct,
            "unique_count": unique_count,
            "leakage_flag": is_leakage
        }

        # Date handling
        if col in date_columns:
            # Drop empty strings and NaNs for date analysis
            clean_dates = pd.to_datetime(col_series.dropna().replace("", np.nan).dropna(), errors="coerce")
            clean_dates = clean_dates.dropna()
            if not clean_dates.empty:
                date_ranges[col] = {
                    "min_date": clean_dates.min().strftime("%Y-%m-%d"),
                    "max_date": clean_dates.max().strftime("%Y-%m-%d"),
                    "valid_records": int(len(clean_dates)),
                    "missing_or_blank": int(total_rows - len(clean_dates))
                }

        # Numerical statistics
        elif pd.api.types.is_numeric_dtype(col_series):
            valid_num = col_series.dropna()
            if not valid_num.empty:
                q25 = float(valid_num.quantile(0.25))
                q75 = float(valid_num.quantile(0.75))
                iqr = q75 - q25
                lower_bound = q25 - 1.5 * iqr
                upper_bound = q75 + 1.5 * iqr
                outliers = valid_num[(valid_num < lower_bound) | (valid_num > upper_bound)]
                
                numerical_stats[col] = {
                    "min": round(float(valid_num.min()), 4),
                    "q25": round(q25, 4),
                    "median": round(float(valid_num.median()), 4),
                    "q75": round(q75, 4),
                    "max": round(float(valid_num.max()), 4),
                    "mean": round(float(valid_num.mean()), 4),
                    "std": round(float(valid_num.std()), 4),
                    "skew": round(float(valid_num.skew()), 4) if len(valid_num) > 2 else 0.0
                }

                outlier_summary[col] = {
                    "outlier_count": int(len(outliers)),
                    "outlier_percentage": round((len(outliers) / total_rows) * 100, 2),
                    "lower_bound": round(lower_bound, 2),
                    "upper_bound": round(upper_bound, 2)
                }

        # Categorical distributions
        else:
            val_counts = col_series.dropna().astype(str).str.strip().value_counts()
            top_5 = val_counts.head(5).to_dict()
            categorical_distributions[col] = {
                "cardinality": int(len(val_counts)),
                "top_categories": {k: int(v) for k, v in top_5.items()}
            }

    # Target variable distribution
    target_summary = {}
    if "delay_status" in df.columns:
        delay_counts = df["delay_status"].value_counts().to_dict()
        target_summary["delay_status"] = {
            "counts": {str(k): int(v) for k, v in delay_counts.items()},
            "delay_rate": round(float(df["delay_status"].mean()), 4)
        }
    if "delay_days" in df.columns:
        valid_delay_days = df["delay_days"].dropna()
        target_summary["delay_days"] = {
            "mean": round(float(valid_delay_days.mean()), 2),
            "median": round(float(valid_delay_days.median()), 2),
            "max": round(float(valid_delay_days.max()), 2),
            "min": round(float(valid_delay_days.min()), 2)
        }

    profiling_result = {
        "file_analyzed": str(file_path),
        "total_rows": total_rows,
        "total_columns": total_cols,
        "duplicate_rows": duplicate_count,
        "columns_profile": columns_profile,
        "numerical_stats": numerical_stats,
        "categorical_distributions": categorical_distributions,
        "date_ranges": date_ranges,
        "outlier_summary": outlier_summary,
        "target_summary": target_summary
    }

    # Save JSON report
    VALIDATION_DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(PROFILING_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(profiling_result, f, indent=2)
    print(f"[SUCCESS] Saved profiling JSON report to {PROFILING_JSON_PATH}")

    # Generate Markdown report
    md_content = f"""# TerraTech - Data Profiling Report

- **Source File**: `{file_path}`
- **Total Records (Rows)**: {total_rows}
- **Total Features (Columns)**: {total_cols}
- **Duplicate Rows**: {duplicate_count}

---

## 1. Column Overview & Missing Value Analysis

| Column Name | Data Type | Missing Count | Missing % | Unique Values | Leakage Risk |
|-------------|-----------|---------------|-----------|---------------|--------------|
"""
    for col, meta in columns_profile.items():
        leakage_badge = "⚠️ HIGH" if meta["leakage_flag"] else "SAFE"
        md_content += f"| `{col}` | {meta['dtype']} | {meta['missing_count']} | {meta['missing_percentage']}% | {meta['unique_count']} | {leakage_badge} |\n"

    md_content += """
---

## 2. Numerical Feature Statistics

| Column | Min | 25% | Median | 75% | Max | Mean | Std | Skewness |
|--------|-----|-----|--------|-----|-----|------|-----|----------|
"""
    for col, st in numerical_stats.items():
        md_content += f"| `{col}` | {st['min']} | {st['q25']} | {st['median']} | {st['q75']} | {st['max']} | {st['mean']} | {st['std']} | {st['skew']} |\n"

    md_content += """
---

## 3. Potential Outlier Detection (Tukey's IQR 1.5x)

| Column | Outlier Count | Outlier % | Lower Bound | Upper Bound | Notes |
|--------|---------------|-----------|-------------|-------------|-------|
"""
    for col, out in outlier_summary.items():
        md_content += f"| `{col}` | {out['outlier_count']} | {out['outlier_percentage']}% | {out['lower_bound']} | {out['upper_bound']} | Retain valid domain values |\n"

    md_content += """
---

## 4. Date Fields Profile

| Column | Min Date | Max Date | Valid Records | Blank / Ongoing |
|--------|----------|----------|---------------|-----------------|
"""
    for col, dr in date_ranges.items():
        md_content += f"| `{col}` | {dr['min_date']} | {dr['max_date']} | {dr['valid_records']} | {dr['missing_or_blank']} |\n"

    md_content += """
---

## 5. Target Variable Distribution

"""
    if "delay_status" in target_summary:
        ts = target_summary["delay_status"]
        md_content += f"- **Target Classification (`delay_status`)**:\n"
        for label, count in ts["counts"].items():
            desc = "Delayed (> 90 days)" if label == "1" else "On-Schedule / No Significant Delay"
            md_content += f"  - Class `{label}` ({desc}): {count} records ({round(count/total_rows*100, 1)}%)\n"
        md_content += f"  - Overall Delay Incidence: {round(ts['delay_rate']*100, 1)}%\n\n"

    if "delay_days" in target_summary:
        td = target_summary["delay_days"]
        md_content += f"- **Target Continuous (`delay_days`)**:\n"
        md_content += f"  - Min: {td['min']} days | Median: {td['median']} days | Mean: {td['mean']} days | Max: {td['max']} days\n"

    with open(PROFILING_MD_PATH, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"[SUCCESS] Saved profiling Markdown report to {PROFILING_MD_PATH}")

    return profiling_result

if __name__ == "__main__":
    profile_dataset()
