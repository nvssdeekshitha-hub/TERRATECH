import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  icon: LucideIcon;
  colorTheme?: 'blue' | 'amber' | 'rose' | 'emerald' | 'indigo';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  colorTheme = 'blue',
  onClick,
}) => {
  const themeClasses = {
    blue: 'border-blue-800/40 bg-slate-800/80 text-blue-400 hover:border-blue-600/60',
    amber: 'border-amber-800/40 bg-slate-800/80 text-amber-400 hover:border-amber-600/60',
    rose: 'border-rose-800/40 bg-slate-800/80 text-rose-400 hover:border-rose-600/60',
    emerald: 'border-emerald-800/40 bg-slate-800/80 text-emerald-400 hover:border-emerald-600/60',
    indigo: 'border-indigo-800/40 bg-slate-800/80 text-indigo-400 hover:border-indigo-600/60',
  };

  const iconBgClasses = {
    blue: 'bg-blue-950 text-blue-400 border-blue-800/60',
    amber: 'bg-amber-950 text-amber-400 border-amber-800/60',
    rose: 'bg-rose-950 text-rose-400 border-rose-800/60',
    emerald: 'bg-emerald-950 text-emerald-400 border-emerald-800/60',
    indigo: 'bg-indigo-950 text-indigo-400 border-indigo-800/60',
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border p-5 shadow-lg transition-all duration-200 ${
        themeClasses[colorTheme]
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="text-2xl font-extrabold tracking-tight text-white font-mono">{value}</p>
        </div>
        <div className={`rounded-lg border p-2.5 ${iconBgClasses[colorTheme]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`font-semibold ${
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
