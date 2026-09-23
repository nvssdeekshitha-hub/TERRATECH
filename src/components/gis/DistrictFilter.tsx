import React from 'react';
import { Navigation } from 'lucide-react';

interface DistrictFilterProps {
  value: string;
  options: string[];
  onChange: (district: string) => void;
}

export const DistrictFilter: React.FC<DistrictFilterProps> = ({ value, options, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="district-filter" className="text-xs font-semibold text-slate-400 flex items-center gap-1">
        <Navigation className="w-3.5 h-3.5 text-indigo-400" />
        District
      </label>
      <select
        id="district-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
        aria-label="Filter by District"
      >
        <option value="ALL">All Districts ({options.length})</option>
        {options.map((dist) => (
          <option key={dist} value={dist}>
            {dist}
          </option>
        ))}
      </select>
    </div>
  );
};
