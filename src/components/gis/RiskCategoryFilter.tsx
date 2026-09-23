import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { RiskCategory } from '../../types/gis';

interface RiskCategoryFilterProps {
  value: RiskCategory | 'ALL';
  onChange: (risk: RiskCategory | 'ALL') => void;
}

export const RiskCategoryFilter: React.FC<RiskCategoryFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="risk-category-filter" className="text-xs font-semibold text-slate-400 flex items-center gap-1">
        <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
        Risk Category
      </label>
      <select
        id="risk-category-filter"
        value={value}
        onChange={(e) => onChange(e.target.value as RiskCategory | 'ALL')}
        className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
        aria-label="Filter by Risk Category"
      >
        <option value="ALL">All Categories</option>
        <option value="LOW">✓ LOW Risk</option>
        <option value="MEDIUM">▲ MEDIUM Risk</option>
        <option value="HIGH">◆ HIGH Risk</option>
        <option value="CRITICAL">⯁ CRITICAL Risk</option>
      </select>
    </div>
  );
};
