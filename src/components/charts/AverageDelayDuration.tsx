import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { AverageDelayDurationItem } from '../../types/gis';

interface AverageDelayDurationProps {
  data: AverageDelayDurationItem[];
  title?: string;
}

export const AverageDelayDuration: React.FC<AverageDelayDurationProps> = ({
  data,
  title = "Average Delay Duration by Project Sector"
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex flex-col h-full">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        <p className="text-xs text-slate-400 font-normal">Average predicted delay (days) comparing infrastructure sectors</p>
      </div>
      <div className="w-full h-64">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            No sector data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="projectType" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '5px' }} />
              <Bar dataKey="avgDays" name="Avg Predicted Delay (Days)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="maxDays" name="Max Delay Case (Days)" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
