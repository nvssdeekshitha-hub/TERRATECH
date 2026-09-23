import React from 'react';
import { AnalyticsSummary } from '../../types/gis';
import { MapPin, AlertOctagon, Clock, Layers, Users } from 'lucide-react';

interface StatCardsProps {
  summary: AnalyticsSummary;
}

export const StatCards: React.FC<StatCardsProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {/* Total Parcels */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Parcels</span>
          <span className="text-xl font-bold text-slate-100">{summary.totalParcels}</span>
        </div>
      </div>

      {/* Critical & High Risk */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
          <AlertOctagon className="w-5 h-5 text-rose-400" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">High/Critical</span>
          <span className="text-xl font-bold text-rose-400">
            {summary.highRiskCount + summary.criticalRiskCount}
            <span className="text-xs text-slate-400 font-normal ml-1">parcels</span>
          </span>
        </div>
      </div>

      {/* Avg Delay */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Avg Delay</span>
          <span className="text-xl font-bold text-slate-100">{summary.avgDelayDays} <span className="text-xs font-normal text-slate-400">days</span></span>
        </div>
      </div>

      {/* Total Land Area */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Area</span>
          <span className="text-xl font-bold text-slate-100">{summary.totalLandAreaAcres} <span className="text-xs font-normal text-slate-400">acres</span></span>
        </div>
      </div>

      {/* Affected Families */}
      <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl shadow-sm flex items-center gap-3 col-span-2 md:col-span-1">
        <div className="w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Affected Families</span>
          <span className="text-xl font-bold text-slate-100">{summary.totalAffectedFamilies}</span>
        </div>
      </div>
    </div>
  );
};
