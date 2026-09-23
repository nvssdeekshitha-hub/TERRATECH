import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types/project';
import { RiskBadge } from '../common/RiskBadge';
import { ExternalLink, Layers, Filter, MapPin, AlertCircle } from 'lucide-react';

interface GISMapProps {
  projects: Project[];
}

// Custom Leaflet pin icon generator
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #0f172a; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

export const GISMap: React.FC<GISMapProps> = ({ projects }) => {
  const navigate = useNavigate();
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');

  const filteredProjects = projects.filter((p) => {
    if (selectedRiskFilter === 'ALL') return true;
    return p.prediction?.risk_category === selectedRiskFilter;
  });

  const getMarkerColor = (category?: string) => {
    switch (category) {
      case 'CRITICAL':
        return '#dc2626';
      case 'HIGH':
        return '#ea580c';
      case 'MEDIUM':
        return '#ca8a04';
      default:
        return '#16a34a';
    }
  };

  // Center coordinates over India (Default center around Central India / Maharashtra)
  const defaultCenter: [number, number] = [20.5937, 78.9629];

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* GIS Floating Filter Bar */}
      <div className="absolute top-4 right-4 z-[400] rounded-xl border border-slate-800 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md max-w-xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-white border-b border-slate-800 pb-1.5">
          <Filter className="h-3.5 w-3.5 text-blue-400" />
          <span>GIS Risk Category Layer Filter</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedRiskFilter(cat)}
              className={`rounded px-2 py-1 text-center font-bold transition border ${
                selectedRiskFilter === cat
                  ? 'bg-blue-600 text-white border-blue-500 shadow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* React-Leaflet Map Component */}
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', minHeight: '550px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredProjects.map((p) => {
          const lat = p.coordinates?.lat || 20.0;
          const lng = p.coordinates?.lng || 78.0;
          const category = p.prediction?.risk_category || 'LOW';
          const score = p.prediction?.risk_score || 0;
          const delayDays = p.prediction?.estimated_delay_days || 0;
          const color = getMarkerColor(category);

          return (
            <React.Fragment key={p.id}>
              {/* Outer Risk Radius Circle */}
              <CircleMarker
                center={[lat, lng]}
                radius={category === 'CRITICAL' ? 24 : category === 'HIGH' ? 18 : 12}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.25,
                  weight: 1.5,
                }}
              />

              {/* Pin Marker */}
              <Marker position={[lat, lng]} icon={createCustomIcon(color)}>
                <Popup>
                  <div className="space-y-2 min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                      <span className="font-mono text-[10px] text-blue-400 font-bold">{p.id}</span>
                      <RiskBadge category={category} score={score} size="sm" />
                    </div>

                    <h4 className="text-xs font-bold text-white leading-tight">{p.name}</h4>

                    <div className="text-[11px] text-slate-300 space-y-1">
                      <p className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{p.district}, {p.state}</span>
                      </p>
                      <p>Type: <strong className="text-slate-100">{p.project_type}</strong></p>
                      <p>Land Area: <strong className="text-slate-100">{p.land_area_acres} Acres</strong></p>
                      <p className="text-amber-400 font-bold">Predicted Delay: +{delayDays} Days</p>
                    </div>

                    <button
                      onClick={() => navigate(`/projects/${p.id}`)}
                      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded bg-blue-600 hover:bg-blue-500 py-1.5 text-xs font-bold text-white transition"
                    >
                      <span>Full Parcel Analysis</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};
