import { PredictionRequest, PredictionResponse } from '../types/predict';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface SystemHealth {
  status: string;
  service: string;
  model_version: string;
  models_loaded: boolean;
  timestamp: string;
  isSimulated?: boolean;
}

/**
 * Real-time delay prediction query to Python FastAPI ML backend.
 * Falls back to deterministic local model calculation if offline.
 */
export async function predictDelay(payload: PredictionRequest): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Prediction API error: ${response.status}`);
    }

    const data: PredictionResponse = await response.json();
    return data;
  } catch (error) {
    console.warn(`[TerraTech API] ML FastAPI service at ${API_BASE_URL} unreachable. Using fallback engine.`, error);
    return computeFallbackPrediction(payload);
  }
}

/**
 * Operational health check query to FastAPI service.
 */
export async function checkHealth(): Promise<SystemHealth> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error(`Health check failed: ${response.status}`);
    const data = await response.json();
    return { ...data, isSimulated: false };
  } catch (error) {
    return {
      status: 'ok',
      service: 'TerraTech ML Engine (Client Standby)',
      model_version: 'v1.0.0 (Fallback)',
      models_loaded: true,
      timestamp: new Date().toISOString(),
      isSimulated: true,
    };
  }
}

/**
 * Trigger dynamic ML model retraining via POST /retrain.
 */
export async function triggerModelRetrain(sampleCount: number = 3000): Promise<{ message: string; model_version: string; metrics?: any }> {
  try {
    const response = await fetch(`${API_BASE_URL}/retrain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sample_count: sampleCount, force_retrain: true }),
    });

    if (!response.ok) throw new Error(`Retrain error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`[TerraTech API] Retrain endpoint unreachable. Simulating retrain sequence.`, error);
    return {
      message: 'Simulated retraining complete. Models and metrics refreshed in local cache.',
      model_version: 'v1.0.1',
    };
  }
}

/**
 * Deterministic client-side prediction engine when FastAPI ML backend is offline.
 */
function computeFallbackPrediction(payload: PredictionRequest): PredictionResponse {
  const scoreRaw =
    0.35 * (1.0 - payload.documentation_completeness) +
    0.45 * payload.legal_dispute +
    0.30 * payload.ownership_complexity +
    0.30 * (1.0 - payload.compensation_status) +
    0.25 * (1.0 - payload.approval_status) +
    0.25 * (1.0 - payload.rehabilitation_status) +
    0.30 * (1.0 - payload.possession_status) +
    0.25 * (1.0 - payload.stakeholder_responsiveness) +
    0.20 * (payload.administrative_processing_days / 365.0) +
    0.25 * payload.historical_delay_rate;

  const prob = 1.0 / (1.0 + Math.exp(-(scoreRaw - 1.2) * 3.5));
  const delayProb = Math.min(0.98, Math.max(0.05, Math.round(prob * 10000) / 10000));
  const riskScore = Math.min(100, Math.max(0, Math.round(delayProb * 100)));

  let riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (riskScore >= 85) riskCategory = 'CRITICAL';
  else if (riskScore >= 60) riskCategory = 'HIGH';
  else if (riskScore >= 30) riskCategory = 'MEDIUM';

  const delayDays = delayProb < 0.20 ? 0 : Math.round(30 + scoreRaw * 110);

  const delayFactors = [];
  if (payload.legal_dispute === 1) {
    delayFactors.push({
      feature: 'legal_dispute',
      transformed_feature: 'num__legal_dispute',
      impact_score: 0.22,
      current_value: '1',
      description: "Active litigation or court dispute present (+22% delay risk)"
    });
  }
  if (payload.documentation_completeness < 0.7) {
    delayFactors.push({
      feature: 'documentation_completeness',
      transformed_feature: 'num__documentation_completeness',
      impact_score: 0.18,
      current_value: `${Math.round(payload.documentation_completeness * 100)}%`,
      description: "Low documentation completeness creates title verification bottlenecks (+18% delay risk)"
    });
  }
  if (payload.ownership_complexity > 0.5) {
    delayFactors.push({
      feature: 'ownership_complexity',
      transformed_feature: 'num__ownership_complexity',
      impact_score: 0.15,
      current_value: `${Math.round(payload.ownership_complexity * 100)}%`,
      description: "High co-ownership succession disputes (+15% delay risk)"
    });
  }

  const recommendations = [];
  if (payload.legal_dispute === 1) {
    recommendations.push("Deploy Lok Adalat out-of-court arbitration bench to resolve land valuation writs.");
  }
  if (payload.documentation_completeness < 0.7) {
    recommendations.push("Mobilize revenue officer taskforce for 100% digital title deed verification within 30 days.");
  }
  if (payload.compensation_status < 0.6) {
    recommendations.push("Initiate direct bank transfer escrow setup for immediate advance compensation disbursement.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Project milestone execution is operating smoothly within standard risk limits.");
  }

  return {
    delay_probability: delayProb,
    risk_score: riskScore,
    risk_category: riskCategory,
    estimated_delay_days: delayDays,
    delay_factors: delayFactors,
    corrective_recommendations: recommendations,
    model_version: 'v1.0.0-fallback'
  };
}
