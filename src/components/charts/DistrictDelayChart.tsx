import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Project } from '../../types/project';

interface DistrictDelayChartProps {
  projects: Project[];
}

export const DistrictDelayChart: React.FC<DistrictDelayChartProps> = ({ projects }) => {
  const districtDelays: Record<string, { totalDelay: number; count: number }> = {};

  projects.forEach((p) => {
    const delay = p.prediction?.estimated_delay_days || 0;
    if (!districtDelays[p.district]) {
      districtDelays[p.district] = { totalDelay: 0, count: 0 };
    }
    districtDelays[p.district].totalDelay += delay;
    districtDelays[p.district].count += 1;
  });

  const data = Object.entries(districtDelays).map(([district, val]) => ({
    district,
    avgDelay: Math.round(val.totalDelay / val.count),
  })).sort((a, b) => b.avgDelay - a.avgDelay).slice(0, 8);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <div className="border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          District-Wise Average Delay Duration
        </h3>
        <p className="text-[11px] text-slate-400">Predicted average delay days by district</p>
      </div>

      <div className="h-56 w-full mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" stroke="#64748b" fontSize={11} />
            <YAxis dataKey="district" type="category" stroke="#64748b" fontSize={11} width={80} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="avgDelay" name="Avg Delay (Days)" fill="#ea580c" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
