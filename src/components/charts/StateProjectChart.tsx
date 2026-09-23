import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Project } from '../../types/project';

interface StateProjectChartProps {
  projects: Project[];
}

export const StateProjectChart: React.FC<StateProjectChartProps> = ({ projects }) => {
  const stateCounts: Record<string, number> = {};

  projects.forEach((p) => {
    stateCounts[p.state] = (stateCounts[p.state] || 0) + 1;
  });

  const data = Object.entries(stateCounts).map(([state, count]) => ({
    state,
    count,
  }));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <div className="border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          State-Wise Project Distribution
        </h3>
        <p className="text-[11px] text-slate-400">Total active land acquisition infrastructure projects by state</p>
      </div>

      <div className="h-56 w-full mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="state" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="count" name="Projects" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
