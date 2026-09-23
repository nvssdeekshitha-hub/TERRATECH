import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { GISMap } from '../components/gis/GISMap';
import { MapPin, Layers } from 'lucide-react';

export const GISRiskMapPage: React.FC = () => {
  const { projects } = useProjects();

  return (
    <div className="space-y-4 pb-8 flex flex-col h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">GIS Spatial Risk Intelligence Map</h1>
          <p className="text-xs text-slate-400 mt-1">
            Interactive spatial visualization of land acquisition parcels, risk categories, and delay severity across India
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <MapPin className="h-4 w-4 text-blue-400" />
          <span>Active GIS Parcels: <strong className="text-white">{projects.length}</strong></span>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 w-full min-h-[500px]">
        <GISMap projects={projects} />
      </div>
    </div>
  );
};
