import React from 'react';
import { Alert } from '../../types/project';
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { useProjects } from '../../context/ProjectContext';

interface AlertCardProps {
  alert: Alert;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  const { resolveAlert } = useProjects();

  const severityStyles = {
    CRITICAL: 'border-rose-800/80 bg-rose-950/40 text-rose-300',
    HIGH: 'border-orange-800/80 bg-orange-950/40 text-orange-300',
    MEDIUM: 'border-amber-800/80 bg-amber-950/40 text-amber-300',
    INFO: 'border-blue-800/80 bg-blue-950/40 text-blue-300',
  };

  const badgeStyles = {
    CRITICAL: 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse',
    HIGH: 'bg-orange-950 text-orange-300 border-orange-800',
    MEDIUM: 'bg-amber-950 text-amber-300 border-amber-800',
    INFO: 'bg-blue-950 text-blue-300 border-blue-800',
  };

  return (
    <div
      className={`rounded-xl border p-4 shadow-md transition ${
        alert.isResolved ? 'border-slate-800 bg-slate-900/40 opacity-60' : severityStyles[alert.severity]
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-2">
            <ShieldAlert className="h-4 w-4 text-rose-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              {alert.category} ALERT • {alert.projectName}
            </span>
            <h4 className="text-xs font-bold text-white leading-tight mt-0.5">{alert.title}</h4>
          </div>
        </div>

        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold ${badgeStyles[alert.severity]}`}>
          {alert.severity}
        </span>
      </div>

      <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">{alert.message}</p>

      <div className="mt-3.5 flex items-center justify-between border-t border-slate-800/60 pt-2.5 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 font-mono">
          <Clock className="h-3 w-3" />
          <span>{new Date(alert.createdAt).toLocaleString()}</span>
        </div>

        <div>
          {alert.isResolved ? (
            <span className="flex items-center gap-1 font-bold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Resolved</span>
            </span>
          ) : (
            <button
              onClick={() => resolveAlert(alert.id)}
              className="rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1 text-[11px] font-bold text-white transition"
            >
              Resolve Alert
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
