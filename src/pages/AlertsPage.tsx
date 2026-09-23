import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { AlertCard } from '../components/projects/AlertCard';
import { Bell, ShieldAlert, Filter, CheckCircle2 } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { projects } = useProjects();
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('OPEN');

  const allAlerts = projects.flatMap((p) => p.alerts);

  const filteredAlerts = allAlerts.filter((a) => {
    const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'OPEN' && !a.isResolved) ||
      (statusFilter === 'RESOLVED' && a.isResolved);
    return matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight">Early-Warning Alerts Console</h1>
        <p className="text-xs text-slate-400 mt-1">
          Automated early-warning notifications for emerging legal, R&R, financial, and approval bottlenecks
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-bold text-white uppercase">Filter Alerts</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Severity Filter Buttons */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`rounded px-2.5 py-1 text-[11px] font-bold transition ${
                  severityFilter === sev ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Status Filter Buttons */}
          <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
            {['OPEN', 'RESOLVED', 'ALL'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded px-2.5 py-1 text-[11px] font-bold transition ${
                  statusFilter === st ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center text-xs text-slate-500">
            No alerts match the selected severity and status filters.
          </div>
        ) : (
          filteredAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        )}
      </div>
    </div>
  );
};
