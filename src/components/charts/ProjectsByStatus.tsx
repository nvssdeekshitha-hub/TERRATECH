import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ProjectsByStatusItem } from '../../types/gis';

interface ProjectsByStatusProps {
  data: ProjectsByStatusItem[];
  title?: string;
}

export const ProjectsByStatus: React.FC<ProjectsByStatusProps> = ({
  data,
  title = "Acquisition Lifecycle Stage Breakdown"
}) => {
  const colors = ['#818cf8', '#a78bfa', '#c084fc', '#f472b6', '#fb7185', '#34d399'];

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex flex-col h-full">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        <p className="text-xs text-slate-400">Land acquisition workflow stages for active parcels</p>
      </div>
      <div className="w-full h-64">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            No stage data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
              <YAxis dataKey="status" type="category" stroke="#94a3b8" fontSize={10} width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                formatter={(value: number, _name: string, props: any) => [
                  `${value} Parcels (${props.payload.percentage}%)`,
                  'Stage Count'
                ]}
              />
              <Bar dataKey="count" fill="#818cf8" radius={[0, 4, 4, 0]}>
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
