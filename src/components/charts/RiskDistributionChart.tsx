import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Project } from '../../types/project';

interface RiskDistributionChartProps {
  projects: Project[];
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ projects }) => {
  const counts = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
  };

  projects.forEach((p) => {
    const cat = (p.prediction?.risk_category || 'LOW') as keyof typeof counts;
    if (counts[cat] !== undefined) counts[cat]++;
  });

  const data = [
    { name: 'LOW RISK', value: counts.LOW, color: '#16a34a' },
    { name: 'MEDIUM RISK', value: counts.MEDIUM, color: '#ca8a04' },
    { name: 'HIGH RISK', value: counts.HIGH, color: '#ea580c' },
    { name: 'CRITICAL RISK', value: counts.CRITICAL, color: '#dc2626' },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg flex flex-col justify-between">
      <div className="border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Risk Category Distribution
        </h3>
        <p className="text-[11px] text-slate-400">Share of projects categorized by delay severity</p>
      </div>

      <div className="h-56 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
