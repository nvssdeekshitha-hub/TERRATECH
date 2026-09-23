import React from 'react';
import { Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LandParcel } from '../../types/gis';
import { RiskPopup } from './RiskPopup';
import { getRiskMetadata } from '../../utils/gisUtils';

interface ParcelLayerProps {
  parcels: LandParcel[];
  selectedParcelId?: string | null;
  onSelectParcel: (parcel: LandParcel) => void;
  onOpenFullDetail?: (parcel: LandParcel) => void;
}

export const ParcelLayer: React.FC<ParcelLayerProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
  onOpenFullDetail
}) => {
  const map = useMap();

  // Create custom accessible marker divIcons
  const createMarkerIcon = (parcel: LandParcel) => {
    const meta = getRiskMetadata(parcel.riskCategory);
    const isSelected = selectedParcelId === parcel.id;

    const html = `
      <div class="risk-marker-container">
        <div class="risk-marker-badge ${meta.badgeClass} ${isSelected ? 'ring-4 ring-indigo-400 ring-offset-2 ring-offset-slate-900 scale-110' : ''}" role="img" aria-label="${meta.ariaLabel}">
          <span>${meta.symbol}</span>
          <span style="font-size: 10px; margin-left: 2px; opacity: 0.9;">${parcel.id}</span>
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-leaflet-marker',
      iconSize: [85, 30],
      iconAnchor: [42, 15],
      popupAnchor: [0, -15]
    });
  };

  // Get GeoJSON styling based on risk category
  const getGeoJSONStyle = (parcel: LandParcel): L.PathOptions => {
    const meta = getRiskMetadata(parcel.riskCategory);
    const isSelected = selectedParcelId === parcel.id;

    let dashArray: string | undefined = undefined;
    if (parcel.riskCategory === 'MEDIUM') dashArray = '6, 6';
    if (parcel.riskCategory === 'HIGH') dashArray = '8, 4';
    if (parcel.riskCategory === 'CRITICAL') dashArray = '4, 4';

    return {
      color: meta.color,
      weight: isSelected ? 4 : 2,
      opacity: isSelected ? 1 : 0.8,
      fillColor: meta.color,
      fillOpacity: isSelected ? 0.45 : 0.25,
      dashArray
    };
  };

  return (
    <>
      {parcels.map((parcel) => (
        <React.Fragment key={parcel.id}>
          {/* GeoJSON Polygon Boundary Layer */}
          {parcel.geojson && (
            <GeoJSON
              key={`polygon-${parcel.id}-${selectedParcelId}`}
              data={parcel.geojson as any}
              style={() => getGeoJSONStyle(parcel)}
              eventHandlers={{
                click: () => {
                  onSelectParcel(parcel);
                  map.panTo([parcel.latitude, parcel.longitude], { animate: true });
                },
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({ fillOpacity: 0.55, weight: 3 });
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle(getGeoJSONStyle(parcel));
                }
              }}
            />
          )}

          {/* Accessible Marker Layer */}
          <Marker
            position={[parcel.latitude, parcel.longitude]}
            icon={createMarkerIcon(parcel)}
            eventHandlers={{
              click: () => {
                onSelectParcel(parcel);
                map.panTo([parcel.latitude, parcel.longitude], { animate: true });
              }
            }}
          >
            <Popup autoPan={true} keepInView={true}>
              <RiskPopup parcel={parcel} onOpenFullDetail={onOpenFullDetail} />
            </Popup>
          </Marker>
        </React.Fragment>
      ))}
    </>
  );
};
