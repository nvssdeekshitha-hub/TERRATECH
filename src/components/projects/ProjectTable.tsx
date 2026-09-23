import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types/project';
import { RiskBadge } from '../common/RiskBadge';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  ArrowUpDown,
  Filter,
  MapPin,
  Clock,
  Users,
  Layers,
} from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
}

type SortField = 'id' | 'name' | 'state' | 'land_area_acres' | 'affected_families' | 'risk_score' | 'estimated_delay_days';
type SortOrder = 'asc' | 'desc';

export const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('risk_score');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    let aVal: any = a[sortField as keyof Project];
    let bVal: any = b[sortField as keyof Project];

    if (sortField === 'risk_score') {
      aVal = a.prediction?.risk_score ?? 0;
      bVal = b.prediction?.risk_score ?? 0;
    } else if (sortField === 'estimated_delay_days') {
      aVal = a.prediction?.estimated_delay_days ?? 0;
      bVal = b.prediction?.estimated_delay_days ?? 0;
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusStyles: Record<string, string> = {
    PLANNING: 'bg-blue-950 text-blue-400 border-blue-800',
    IN_PROGRESS: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    DELAYED: 'bg-amber-950 text-amber-400 border-amber-800',
    CRITICAL_HALT: 'bg-rose-950 text-rose-400 border-rose-800 animate-pulse',
    COMPLETED: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th
                onClick={() => handleSort('id')}
                className="cursor-pointer px-4 py-3.5 hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Project ID</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('name')}
                className="cursor-pointer px-4 py-3.5 hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Project Name</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('state')}
                className="cursor-pointer px-4 py-3.5 hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>State / District</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('land_area_acres')}
                className="cursor-pointer px-4 py-3.5 hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Area (Acres)</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('affected_families')}
                className="cursor-pointer px-4 py-3.5 hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Families</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('risk_score')}
                className="cursor-pointer px-4 py-3.5 hover:text-white text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Risk Score</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-4 py-3.5 text-center">Risk Category</th>
              <th className="px-4 py-3.5 text-right">Delay Propensity</th>
              <th
                onClick={() => handleSort('estimated_delay_days')}
                className="cursor-pointer px-4 py-3.5 hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Est. Delay</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-4 py-3.5 text-center">Status</th>
              <th className="px-4 py-3.5 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 font-medium">
            {paginatedProjects.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-slate-500">
                  No land acquisition projects matching active filters.
                </td>
              </tr>
            ) : (
              paginatedProjects.map((p) => {
                const score = p.prediction?.risk_score ?? 0;
                const category = p.prediction?.risk_category ?? 'LOW';
                const prob = p.prediction?.delay_probability ?? 0;
                const delayDays = p.prediction?.estimated_delay_days ?? 0;

                return (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="cursor-pointer transition hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3 font-mono text-blue-400 font-bold">{p.id}</td>
                    <td className="px-4 py-3 text-white font-semibold">
                      <div className="line-clamp-1">{p.name}</div>
                      <span className="text-[10px] text-slate-500 font-normal">{p.project_type}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        <span>{p.district}, {p.state}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-200">
                      {p.land_area_acres.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-200">
                      {p.affected_families.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono font-extrabold text-sm text-white">
                        {score}/100
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <RiskBadge category={category} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-200">
                      {(prob * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-amber-400">
                      +{delayDays} Days
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                          statusStyles[p.status] || statusStyles.IN_PROGRESS
                        }`}
                      >
                        {p.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/projects/${p.id}`)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-blue-400 hover:bg-slate-700 hover:text-white transition"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-400">
          <div>
            Showing <span className="font-bold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-bold text-white">
              {Math.min(currentPage * itemsPerPage, sortedProjects.length)}
            </span>{' '}
            of <span className="font-bold text-white">{sortedProjects.length}</span> projects
          </div>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1 font-semibold text-slate-300 disabled:opacity-40 hover:bg-slate-800"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1 font-semibold text-slate-300 disabled:opacity-40 hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
