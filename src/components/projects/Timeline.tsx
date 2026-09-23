import React from 'react';
import { Milestone } from '../../types/project';
import { CheckCircle2, Clock, AlertTriangle, Circle } from 'lucide-react';

interface TimelineProps {
  milestones: Milestone[];
}

export const Timeline: React.FC<TimelineProps> = ({ milestones }) => {
  const statusIcons = {
    COMPLETED: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    IN_PROGRESS: <Clock className="h-4 w-4 text-blue-400 animate-pulse" />,
    OVERDUE: <AlertTriangle className="h-4 w-4 text-rose-400" />,
    PENDING: <Circle className="h-4 w-4 text-slate-600" />,
  };

  const statusColors = {
    COMPLETED: 'border-emerald-500 bg-emerald-950 text-emerald-300',
    IN_PROGRESS: 'border-blue-500 bg-blue-950 text-blue-300',
    OVERDUE: 'border-rose-500 bg-rose-950 text-rose-300',
    PENDING: 'border-slate-700 bg-slate-900 text-slate-500',
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
        Land Acquisition Milestone Timeline
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-800">
        {milestones.map((m) => (
          <div key={m.id} className="relative flex items-start gap-4">
            {/* Timeline node icon */}
            <div className="absolute -left-6 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900">
              {statusIcons[m.status]}
            </div>

            <div className="flex-1 rounded-lg border border-slate-800/80 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{m.name}</span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold border ${statusColors[m.status]}`}
                >
                  {m.status.replace('_', ' ')}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Target Completion: <strong className="text-slate-200">{m.targetDate}</strong></span>
                <span className="font-mono font-bold text-blue-400">{m.completionPercentage}% Done</span>
              </div>

              {/* Progress bar */}
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    m.status === 'COMPLETED'
                      ? 'bg-emerald-500'
                      : m.status === 'OVERDUE'
                      ? 'bg-rose-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${m.completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
