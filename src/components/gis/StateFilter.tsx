import React from 'react';
import { MapPin } from 'lucide-react';

interface StateFilterProps {
  value: string;
  options: string[];
  onChange: (state: string) => void;
}

export const StateFilter: React.FC<StateFilterProps> = ({ value, options, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="state-filter" className="text-xs font-semibold text-slate-400 flex items-center gap-1">
        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
        State
      </label>
      <select
        id="state-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
        aria-label="Filter by State"
      >
        <option value="ALL">All States ({options.length})</option>
        {options.map((st) => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </select>
    </div>
  );
};
