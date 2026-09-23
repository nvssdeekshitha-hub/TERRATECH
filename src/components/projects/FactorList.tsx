import React from 'react';
import { DelayFactor } from '../../types/predict';
import { AlertCircle, HelpCircle } from 'lucide-react';

interface FactorListProps {
  factors: DelayFactor[];
}

export const FactorList: React.FC<FactorListProps> = ({ factors }) => {
  if (!factors || factors.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-center text-xs text-slate-400">
        No critical risk factors identified by SHAP TreeExplainer. Operational indicators are optimal.
      </div>
    );
  }

  // Max impact score for scaling relative progress bar width
  const maxImpact = Math.max(...factors.map((f) => f.impact_score), 0.05);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            SHAP Explainable AI: Key Delay Factors
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Model Feature Attribution</span>
      </div>

      <div className="space-y-3.5">
        {factors.map((f, idx) => {
          const percentVal = (f.impact_score * 100).toFixed(1);
          const relativeWidth = Math.min(100, Math.max(10, (f.impact_score / maxImpact) * 100));

          return (
            <div key={idx} className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-200 capitalize">
                  {f.feature.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-400 text-[11px]">Value: {f.current_value}</span>
                  <span className="font-bold text-amber-400">+{percentVal}% Impact</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-600 transition-all duration-700"
                  style={{ width: `${relativeWidth}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">{f.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
