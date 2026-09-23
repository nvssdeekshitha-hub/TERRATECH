import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { RiskDistributionChart } from '../components/charts/RiskDistributionChart';
import { FactorList } from '../components/projects/FactorList';
import { RiskBadge } from '../components/common/RiskBadge';
import { ShieldAlert, AlertCircle, Layers, Sliders, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RiskAnalysis: React.FC = () => {
  const { projects } = useProjects();
  const navigate = useNavigate();

  // Aggregate SHAP factors across all projects to build top systemic delay drivers
  const allFactors = projects.flatMap((p) => p.prediction?.delay_factors || []);
  const factorMap: Record<string, { count: number; totalImpact: number }> = {};

  allFactors.forEach((f) => {
    if (!factorMap[f.feature]) {
      factorMap[f.feature] = { count: 0, totalImpact: 0 };
    }
    factorMap[f.feature].count += 1;
    factorMap[f.feature].totalImpact += f.impact_score;
  });

  const topSystemicFactors = Object.entries(factorMap)
    .map(([feature, val]) => ({
      feature,
      count: val.count,
      avgImpact: (val.totalImpact / val.count) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight">Predictive Risk & XAI Analysis</h1>
        <p className="text-xs text-slate-400 mt-1">
          Deep-dive analysis into systemic delay drivers, SHAP feature attributions, and risk quadrant matrix
        </p>
      </div>

      {/* Top Systemic Risk Drivers Grid */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldAlert className="h-4 w-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Systemic Delay Driver Frequency (Cross-Portfolio SHAP Analysis)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topSystemicFactors.map((f, idx) => (
            <div key={idx} className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase">{f.feature.replace(/_/g, ' ')}</span>
                <span className="font-mono text-xs font-bold text-amber-400">+{f.avgImpact.toFixed(1)}% Avg Impact</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Affected Projects:</span>
                <strong className="text-slate-200">{f.count} Parcels</strong>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${Math.min(100, (f.count / projects.length) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Quadrant Matrix (Impact vs Probability) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Land Acquisition Risk Matrix (Probability vs Severity)
            </h3>
            <p className="text-[11px] text-slate-400">Quadrant classification of land parcels</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* High Impact / High Probability (CRITICAL) */}
          <div className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-2">
              <span className="text-xs font-bold text-rose-300">CRITICAL QUADRANT (High Prob / High Days)</span>
              <span className="font-mono text-xs font-bold text-rose-400">
                {projects.filter((p) => p.prediction?.risk_category === 'CRITICAL').length} Projects
              </span>
            </div>
            <div className="space-y-1.5">
              {projects
                .filter((p) => p.prediction?.risk_category === 'CRITICAL')
                .slice(0, 3)
                .map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="flex items-center justify-between rounded bg-slate-900/80 p-2 text-xs cursor-pointer hover:bg-slate-800"
                  >
                    <span className="font-semibold text-white truncate max-w-[200px]">{p.name}</span>
                    <span className="font-mono text-rose-400 font-bold">{p.prediction?.risk_score}/100</span>
                  </div>
                ))}
            </div>
          </div>

          {/* High Impact / Moderate Probability (HIGH) */}
          <div className="rounded-xl border border-amber-900/60 bg-amber-950/20 p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
              <span className="text-xs font-bold text-amber-300">HIGH RISK QUADRANT</span>
              <span className="font-mono text-xs font-bold text-amber-400">
                {projects.filter((p) => p.prediction?.risk_category === 'HIGH').length} Projects
              </span>
            </div>
            <div className="space-y-1.5">
              {projects
                .filter((p) => p.prediction?.risk_category === 'HIGH')
                .slice(0, 3)
                .map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="flex items-center justify-between rounded bg-slate-900/80 p-2 text-xs cursor-pointer hover:bg-slate-800"
                  >
                    <span className="font-semibold text-white truncate max-w-[200px]">{p.name}</span>
                    <span className="font-mono text-amber-400 font-bold">{p.prediction?.risk_score}/100</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
