import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { ProjectTable } from '../components/projects/ProjectTable';
import { NewProjectModal } from '../components/projects/NewProjectModal';
import { Search, Filter, Plus, RotateCcw, FolderKanban } from 'lucide-react';

export const Projects: React.FC = () => {
  const {
    filteredProjects,
    searchQuery,
    setSearchQuery,
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    selectedCategory,
    setSelectedCategory,
    selectedProjectType,
    setSelectedProjectType,
    resetFilters,
  } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive unique states, districts, and project types for filter dropdowns
  const states = ['ALL', 'Maharashtra', 'Uttar Pradesh', 'Gujarat', 'Odisha', 'Tamil Nadu', 'Karnataka', 'Bihar', 'Rajasthan'];
  const categories = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const projectTypes = ['ALL', 'Highways', 'Railways', 'Solar Parks', 'Mining', 'Industrial Corridors', 'Water Resources'];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Land Acquisition Projects Repository</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, filter, and inspect project and parcel-level delay predictions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Parcel Prediction</span>
        </button>
      </div>

      {/* Multi-Filter Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Filter className="h-4 w-4 text-blue-400" />
            <span>Filter Repository</span>
          </div>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Box */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Search Keywords</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ID, Name, District..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-blue-600 focus:outline-none"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s === 'ALL' ? 'All States' : s}</option>
              ))}
            </select>
          </div>

          {/* Risk Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Risk Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-blue-600 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'ALL' ? 'All Risk Categories' : c}</option>
              ))}
            </select>
          </div>

          {/* Project Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1">Project Sector</label>
            <select
              value={selectedProjectType}
              onChange={(e) => setSelectedProjectType(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-blue-600 focus:outline-none"
            >
              {projectTypes.map((pt) => (
                <option key={pt} value={pt}>{pt === 'ALL' ? 'All Project Types' : pt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Project Table */}
      <ProjectTable projects={filteredProjects} />

      {/* New Project Prediction Modal */}
      {isModalOpen && <NewProjectModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
