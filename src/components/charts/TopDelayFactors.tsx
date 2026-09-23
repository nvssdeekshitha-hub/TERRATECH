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
import { TopDelayFactorItem } from '../../types/gis';

interface TopDelayFactorsProps {
  data: TopDelayFactorItem[];
  title?: string;
}

export const TopDelayFactors: React.FC<TopDelayFactorsProps> = ({
  data,
  title = "Top Primary Delay Factors & Bottlenecks"
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex flex-col h-full">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        <p className="text-xs text-slate-400">Leading root causes triggering land acquisition delay risks</p>
      </div>
      <div className="w-full h-64">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            No factor data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
              <YAxis
                dataKey="factor"
                type="category"
                stroke="#94a3b8"
                fontSize={10}
                width={130}
                tickFormatter={(value) => (value.length > 20 ? `${value.substring(0, 18)}...` : value)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                formatter={(value: number, _name: string, props: any) => [
                  `${value} Affected Parcels (Avg Risk Score: ${props.payload.impactScore})`,
                  'Frequency'
                ]}
              />
              <Bar dataKey="count" name="Frequency" fill="#f97316" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.impactScore > 80 ? '#ef4444' : entry.impactScore > 60 ? '#f97316' : '#f59e0b'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
