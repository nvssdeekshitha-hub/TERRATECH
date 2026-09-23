import React from 'react';
import { RiskBadge } from './RiskBadge';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface RiskCardProps {
  score: number;
  category: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  delayProbability: number;
  estimatedDelayDays: number;
  projectName?: string;
  projectId?: string;
}

export const RiskCard: React.FC<RiskCardProps> = ({
  score,
  category,
  delayProbability,
  estimatedDelayDays,
  projectName,
  projectId,
}) => {
  const isHighOrCritical = category === 'HIGH' || category === 'CRITICAL';

  const gaugeColor =
    score >= 85
      ? '#dc2626'
      : score >= 60
      ? '#ea580c'
      : score >= 30
      ? '#d97706'
      : '#16a34a';

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          {projectName && <h4 className="text-sm font-bold text-white line-clamp-1">{projectName}</h4>}
          {projectId && <p className="text-xs font-mono text-slate-400">{projectId}</p>}
        </div>
        <RiskBadge category={category} score={score} size="md" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {/* Risk Score Circle / Dial */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-slate-800/80 bg-slate-950/60 p-3">
          <div className="relative flex items-center justify-center">
            <svg className="h-20 w-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke={gaugeColor}
                strokeWidth="6"
                strokeDasharray={201}
                strokeDashoffset={201 - (201 * score) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-lg font-black font-mono text-white">{score}</span>
              <span className="text-[10px] text-slate-400 font-bold block">/ 100</span>
            </div>
          </div>
          <span className="mt-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Risk Score
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="flex flex-col justify-center space-y-3">
          <div className="rounded-md border border-slate-800/60 bg-slate-950/40 p-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Delay Propensity</span>
              <span className="font-mono font-bold text-white">
                {(delayProbability * 100).toFixed(1)}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, delayProbability * 100)}%`,
                  backgroundColor: gaugeColor,
                }}
              />
            </div>
          </div>

          <div className="rounded-md border border-slate-800/60 bg-slate-950/40 p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-slate-400 font-medium">Est. Duration</span>
            </div>
            <span className="font-mono font-extrabold text-sm text-amber-400">
              +{estimatedDelayDays} Days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
