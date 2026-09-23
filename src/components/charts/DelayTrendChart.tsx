import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DelayTrendChart: React.FC = () => {
  const data = [
    { month: 'Oct 2025', avgRiskScore: 68, avgDelayDays: 95 },
    { month: 'Nov 2025', avgRiskScore: 64, avgDelayDays: 88 },
    { month: 'Dec 2025', avgRiskScore: 71, avgDelayDays: 102 },
    { month: 'Jan 2026', avgRiskScore: 62, avgDelayDays: 82 },
    { month: 'Feb 2026', avgRiskScore: 59, avgDelayDays: 78 },
    { month: 'Mar 2026', avgRiskScore: 56, avgDelayDays: 70 },
    { month: 'Apr 2026', avgRiskScore: 63, avgDelayDays: 85 },
    { month: 'May 2026', avgRiskScore: 58, avgDelayDays: 74 },
    { month: 'Jun 2026', avgRiskScore: 52, avgDelayDays: 62 },
    { month: 'Jul 2026', avgRiskScore: 55, avgDelayDays: 68 },
    { month: 'Aug 2026', avgRiskScore: 49, avgDelayDays: 58 },
    { month: 'Sep 2026', avgRiskScore: 45, avgDelayDays: 52 },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            12-Month Historical Delay & Risk Trend
          </h3>
          <p className="text-[11px] text-slate-400">Macro reduction in delay duration following automated recommendations</p>
        </div>
        <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-800">
          -23% Delay Reduction
        </span>
      </div>

      <div className="h-60 w-full mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Area type="monotone" dataKey="avgRiskScore" name="Avg Risk Score" stroke="#2563eb" fillOpacity={1} fill="url(#colorRisk)" />
            <Area type="monotone" dataKey="avgDelayDays" name="Avg Delay (Days)" stroke="#d97706" fillOpacity={1} fill="url(#colorDays)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
