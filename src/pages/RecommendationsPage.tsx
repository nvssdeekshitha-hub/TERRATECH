import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { RecommendationCard } from '../components/projects/RecommendationCard';
import { CheckSquare, Filter, Zap } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const { projects } = useProjects();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const allRecommendations = projects.flatMap((p) => p.recommendations || []);

  const filteredRecommendations = allRecommendations.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white tracking-tight">AI Corrective Recommendations</h1>
        <p className="text-xs text-slate-400 mt-1">
          Prescriptive administrative interventions designed to eliminate land acquisition delay drivers
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-bold text-white uppercase">Filter Action Status</span>
        </div>

        <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1 text-xs">
          {['ALL', 'PROPOSED', 'IN_IMPLEMENTATION', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded px-3 py-1 text-[11px] font-bold transition ${
                statusFilter === st ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecommendations.length === 0 ? (
          <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center text-xs text-slate-500">
            No corrective recommendations match the active filter.
          </div>
        ) : (
          filteredRecommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))
        )}
      </div>
    </div>
  );
};
