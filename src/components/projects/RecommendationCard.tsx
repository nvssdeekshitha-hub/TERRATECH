import React from 'react';
import { Recommendation } from '../../types/project';
import { CheckSquare, ArrowRight, Zap } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const { updateRecommendationStatus } = useProjects();

  const priorityStyles = {
    URGENT: 'bg-rose-950 text-rose-300 border-rose-800',
    HIGH: 'bg-amber-950 text-amber-300 border-amber-800',
    MEDIUM: 'bg-blue-950 text-blue-300 border-blue-800',
  };

  const statusStyles = {
    PROPOSED: 'bg-slate-800 text-slate-300 border-slate-700',
    IN_IMPLEMENTATION: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    RESOLVED: 'bg-emerald-950 text-emerald-300 border-emerald-800',
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-md transition hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-blue-800/60 bg-blue-950 p-2 text-blue-400">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              {recommendation.category || 'Corrective Intervention'}
            </span>
            <p className="text-xs font-mono text-slate-500">{recommendation.projectName}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${priorityStyles[recommendation.priority]}`}>
            {recommendation.priority}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusStyles[recommendation.status]}`}>
            {recommendation.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs font-semibold text-white leading-relaxed">
        {recommendation.action}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
        <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono font-bold">
          <span>Est. Delay Reduction:</span>
          <span>-{recommendation.impactDelayReductionDays} Days</span>
        </div>

        <div className="flex gap-2">
          {recommendation.status === 'PROPOSED' && (
            <button
              onClick={() => updateRecommendationStatus(recommendation.id, 'IN_IMPLEMENTATION')}
              className="inline-flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-500 px-2.5 py-1 text-[11px] font-bold text-white transition"
            >
              <span>Initiate Action</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}

          {recommendation.status === 'IN_IMPLEMENTATION' && (
            <button
              onClick={() => updateRecommendationStatus(recommendation.id, 'RESOLVED')}
              className="inline-flex items-center gap-1 rounded bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white transition"
            >
              <CheckSquare className="h-3 w-3" />
              <span>Mark Implemented</span>
            </button>
          )}

          {recommendation.status === 'RESOLVED' && (
            <span className="text-[11px] font-bold text-emerald-400">Completed</span>
          )}
        </div>
      </div>
    </div>
  );
};
