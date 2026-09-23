import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LandParcel } from '../../types/gis';
import { ParcelLayer } from './ParcelLayer';
import { Layers, Eye, Info } from 'lucide-react';
import { getRiskMetadata } from '../../utils/gisUtils';

interface TerraTechRiskMapProps {
  parcels: LandParcel[];
  selectedParcel: LandParcel | null;
  onSelectParcel: (parcel: LandParcel) => void;
  onOpenFullDetail?: (parcel: LandParcel) => void;
}

// Controller component to re-center map bounds whenever parcels update
const MapBoundsController: React.FC<{ parcels: LandParcel[]; selectedParcel: LandParcel | null }> = ({
  parcels,
  selectedParcel
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedParcel) {
      map.setView([selectedParcel.latitude, selectedParcel.longitude], 12, { animate: true });
    } else if (parcels.length > 0) {
      const bounds = L.latLngBounds(parcels.map((p) => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13, animate: true });
    }
  }, [parcels, selectedParcel, map]);

  return null;
};

export const TerraTechRiskMap: React.FC<TerraTechRiskMapProps> = ({
  parcels,
  selectedParcel,
  onSelectParcel,
  onOpenFullDetail
}) => {
  const [mapType, setMapType] = useState<'dark' | 'satellite'>('dark');
  const [showLegend, setShowLegend] = useState(true);

  // India center default coordinates
  const defaultCenter: [number, number] = [18.5, 79.5];
  const defaultZoom = 5;

  const tileUrls = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  const tileAttributions = {
    dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  };

  return (
    <div className="relative w-full h-[540px] md:h-[620px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 flex flex-col">
      {/* Map Header Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg shadow-md">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
          <span className="text-xs font-semibold text-slate-200">
            TerraTech GIS Layer ({parcels.length} Parcels Displayed)
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* Map Layer Switcher */}
          <button
            type="button"
            onClick={() => setMapType(mapType === 'dark' ? 'satellite' : 'dark')}
            className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-colors shadow-md"
            title="Toggle Map Style"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{mapType === 'dark' ? 'Satellite View' : 'Dark Canvas'}</span>
          </button>

          {/* Toggle Legend */}
          <button
            type="button"
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-colors shadow-md"
            title="Toggle Accessibility Legend"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>{showLegend ? 'Hide Legend' : 'Legend'}</span>
          </button>
        </div>
      </div>

      {/* Leaflet Core Map Container */}
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer url={tileUrls[mapType]} attribution={tileAttributions[mapType]} maxZoom={19} />
        <ZoomControl position="bottomright" />

        <MapBoundsController parcels={parcels} selectedParcel={selectedParcel} />

        <ParcelLayer
          parcels={parcels}
          selectedParcelId={selectedParcel?.id}
          onSelectParcel={onSelectParcel}
          onOpenFullDetail={onOpenFullDetail}
        />
      </MapContainer>

      {/* Accessibility Legend Overlay */}
      {showLegend && (
        <div className="absolute bottom-6 left-4 z-[1000] bg-slate-900/95 backdrop-blur border border-slate-800 p-3 rounded-xl shadow-2xl max-w-xs text-xs font-sans">
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800">
            <span className="font-semibold text-slate-200 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              Risk & Accessibility Legend
            </span>
            <span className="text-[10px] text-slate-400">Shapes + Colors</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((cat) => {
              const meta = getRiskMetadata(cat);
              return (
                <div key={cat} className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded border border-slate-800">
                  <span className={`w-3 h-3 rounded-sm flex items-center justify-center font-bold text-[9px] ${meta.badgeClass}`}>
                    {meta.symbol.charAt(0)}
                  </span>
                  <div>
                    <div className={`font-bold ${meta.textTailwind}`}>{meta.symbol}</div>
                    <div className="text-[9px] text-slate-400">{meta.shapeName}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
