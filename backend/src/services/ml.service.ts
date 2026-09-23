import axios from 'axios';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { isDbAvailable, dbQuery } from '../config/database.js';
import { PredictionInputFeatures, PredictionResult } from '../models/prediction.model.js';
import { RiskCategory } from '../models/project.model.js';

export class MLService {
  async predictDelay(features: PredictionInputFeatures): Promise<PredictionResult> {
    const mlEndpoint = `${config.mlServiceUrl}/predict`;

    try {
      logger.info(`[ML Service] Forwarding features to Python ML service: ${mlEndpoint}`);
      const response = await axios.post<PredictionResult>(mlEndpoint, features, {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      });

      const prediction = response.data;
      await this.savePredictionHistory(features, prediction);
      return prediction;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.warn(`[ML Service] Python ML service unreachable at ${mlEndpoint} (${errMsg}). Utilizing development fallback prediction.`);

      // Graceful fallback response when ML service is offline
      const fallbackPrediction = this.calculateFallbackPrediction(features);
      await this.savePredictionHistory(features, fallbackPrediction);
      return fallbackPrediction;
    }
  }

  private calculateFallbackPrediction(features: PredictionInputFeatures): PredictionResult {
    let score = 20;

    // Weight indicators
    if (features.legal_disputes && features.legal_disputes !== 'NONE') {
      score += 35;
    }
    if (features.ownership_complexity && features.ownership_complexity.includes('HIGH')) {
      score += 20;
    }
    if (features.compensation_status && features.compensation_status !== 'DISBURSED') {
      score += 15;
    }
    if (features.approval_status && features.approval_status !== 'APPROVED') {
      score += 10;
    }
    if (features.stakeholder_responsiveness === 'LOW') {
      score += 10;
    }

    score = Math.min(99, Math.max(5, score));
    const delay_probability = parseFloat((score / 100).toFixed(2));

    let risk_category: RiskCategory = 'LOW';
    if (score >= 75) risk_category = 'CRITICAL';
    else if (score >= 60) risk_category = 'HIGH';
    else if (score >= 40) risk_category = 'MEDIUM';

    const estimated_delay_days = Math.round(score * 2.2);

    return {
      delay_probability,
      risk_score: score,
      risk_category,
      estimated_delay_days,
      explainable_ai: {
        method: 'SHAP (Simulated Fallback Proxy)',
        factor_contributions: [
          {
            factor: 'Legal Disputes',
            weight: features.legal_disputes !== 'NONE' ? 0.38 : 0.05,
            impact: features.legal_disputes !== 'NONE' ? 'INCREASES_DELAY' : 'NEUTRAL',
            description: `Parcel has status: ${features.legal_disputes}`
          },
          {
            factor: 'Ownership Complexity',
            weight: 0.22,
            impact: features.ownership_complexity.includes('HIGH') ? 'INCREASES_DELAY' : 'NEUTRAL',
            description: `Complexity assessed as: ${features.ownership_complexity}`
          },
          {
            factor: 'Compensation Disbursement',
            weight: 0.18,
            impact: features.compensation_status !== 'DISBURSED' ? 'INCREASES_DELAY' : 'DECREASES_DELAY',
            description: `Compensation: ${features.compensation_status}`
          }
        ],
        summary: `Estimated ${estimated_delay_days} days delay primarily driven by legal disputes and ownership complexity.`
      },
      recommendations: [
        'Initiate pre-litigation mediation with district revenue authority',
        'Verify revenue record title mutations before final award disbursement'
      ],
      is_simulated_fallback: true
    };
  }

  private async savePredictionHistory(features: PredictionInputFeatures, result: PredictionResult): Promise<void> {
    if (!isDbAvailable()) return;

    try {
      const id = `pred_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const sql = `
        INSERT INTO predictions (
          id, parcel_id, project_id, delay_probability, risk_score,
          risk_category, estimated_delay_days, factor_contributions,
          recommendations, input_features
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;
      await dbQuery(sql, [
        id,
        features.parcel_id || null,
        features.project_id || null,
        result.delay_probability,
        result.risk_score,
        result.risk_category,
        result.estimated_delay_days,
        JSON.stringify(result.explainable_ai?.factor_contributions || {}),
        JSON.stringify(result.recommendations || []),
        JSON.stringify(features)
      ]);
    } catch (err) {
      logger.error('[ML Service] Failed to persist prediction history:', err);
    }
  }
}

export const mlService = new MLService();
