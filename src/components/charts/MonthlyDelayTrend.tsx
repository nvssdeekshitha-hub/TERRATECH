import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { MonthlyDelayTrendItem } from '../../types/gis';

interface MonthlyDelayTrendProps {
  data: MonthlyDelayTrendItem[];
  title?: string;
}

export const MonthlyDelayTrend: React.FC<MonthlyDelayTrendProps> = ({
  data,
  title = "6-Month Predicted vs Actual Delay Evolution"
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex flex-col h-full">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        <p className="text-xs text-slate-400">Historical progression of delay predictions vs ground reality</p>
      </div>
      <div className="w-full h-64">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            No monthly trend data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 15 }}>
              <defs>
                <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '5px' }} />
              <Area
                type="monotone"
                dataKey="predictedDelayDays"
                name="AI Predicted Delay (Days)"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#predictedGrad)"
              />
              <Area
                type="monotone"
                dataKey="actualDelayDays"
                name="Actual Recorded Delay (Days)"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#actualGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
