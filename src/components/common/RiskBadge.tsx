import React from 'react';
import { RiskCategory } from '../../types/project';

interface RiskBadgeProps {
  category: RiskCategory | string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ category, score, size = 'md' }) => {
  const normalized = (category || 'LOW').toUpperCase();

  const colorStyles: Record<string, string> = {
    LOW: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60',
    MEDIUM: 'bg-amber-950/80 text-amber-400 border-amber-800/60',
    HIGH: 'bg-orange-950/80 text-orange-400 border-orange-800/60',
    CRITICAL: 'bg-rose-950/80 text-rose-400 border-rose-800/60 animate-pulse-red',
  };

  const dotColors: Record<string, string> = {
    LOW: 'bg-emerald-400',
    MEDIUM: 'bg-amber-400',
    HIGH: 'bg-orange-400',
    CRITICAL: 'bg-rose-400',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs font-bold',
    lg: 'px-3.5 py-1.5 text-sm font-extrabold',
  };

  const style = colorStyles[normalized] || colorStyles.LOW;
  const dotStyle = dotColors[normalized] || dotColors.LOW;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${style} ${sizeStyles[size]}`}>
      <span className={`h-2 w-2 rounded-full ${dotStyle}`} />
      <span>{normalized} RISK</span>
      {score !== undefined && <span className="opacity-80 font-normal">({score})</span>}
    </span>
  );
};
