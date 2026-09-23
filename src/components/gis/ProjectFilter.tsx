import React from 'react';
import { Briefcase } from 'lucide-react';

interface ProjectFilterProps {
  value: string;
  options: string[];
  onChange: (project: string) => void;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({ value, options, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="project-filter" className="text-xs font-semibold text-slate-400 flex items-center gap-1">
        <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
        Project
      </label>
      <select
        id="project-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer max-w-xs truncate"
        aria-label="Filter by Project"
      >
        <option value="ALL">All Projects ({options.length})</option>
        {options.map((proj) => (
          <option key={proj} value={proj}>
            {proj}
          </option>
        ))}
      </select>
    </div>
  );
};
