import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { RiskCategoryDistributionItem } from '../../types/gis';

interface RiskCategoryDistributionProps {
  data: RiskCategoryDistributionItem[];
  title?: string;
}

export const RiskCategoryDistribution: React.FC<RiskCategoryDistributionProps> = ({
  data,
  title = "Risk Category Share (%)"
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex flex-col h-full">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        <p className="text-xs text-slate-400">Percentage breakdown of total land acquisition risk levels</p>
      </div>
      <div className="w-full h-64 flex items-center justify-center">
        {data.every(d => d.count === 0) ? (
          <div className="text-xs text-slate-500">No parcels match criteria</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="count"
                nameKey="name"
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                formatter={(value: number, name: string) => [`${value} Parcels`, `${name} Risk`]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '5px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
