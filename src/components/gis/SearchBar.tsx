import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="search-input" className="text-xs font-semibold text-slate-400 flex items-center gap-1">
        <Search className="w-3.5 h-3.5 text-indigo-400" />
        Search Parcels
      </label>
      <div className="relative">
        <input
          id="search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Parcel ID, project, state..."
          className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
      </div>
    </div>
  );
};

interface ResetFilterProps {
  onReset: () => void;
  disabled?: boolean;
}

export const ResetFilter: React.FC<ResetFilterProps> = ({ onReset, disabled }) => {
  return (
    <button
      type="button"
      onClick={onReset}
      disabled={disabled}
      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:text-white"
      title="Reset all filters to default"
    >
      <RotateCcw className="w-4 h-4 text-indigo-400" />
      Reset
    </button>
  );
};
