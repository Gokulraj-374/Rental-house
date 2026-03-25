import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatCurrency } from '@/utils/helpers';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (isSelected = false, isTopRated = false) => {
  const color = isTopRated ? '#10B981' : isSelected ? '#0F766E' : '#0369A1';
  const size = isSelected ? 40 : 30;
  
  return L.divIcon({
    html: `
      <div style="position: relative;">
        ${isSelected ? '<div class="radar-ping" style="position: absolute; inset: 0; background: ' + color + '; border-radius: 50%; opacity: 0.5;"></div>' : ''}
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 6px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
        ">
          <svg width="${size / 2}" height="${size / 2}" viewBox="0 0 24 24" fill="white">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </div>
      </div>
    `,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size]
  });
};

const RecenterMap = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

export const MapView = ({ properties, selectedProperty, onPropertySelect, center, userLocation }) => {
  const navigate = useNavigate();
  const defaultCenter = center || [13.0827, 80.2707]; // Default to Chennai
  const defaultZoom = 12;

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden" data-testid="map-view">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <RecenterMap center={center} />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              html: `
                <div style="
                  width: 20px;
                  height: 20px;
                  background: #3B82F6;
                  border: 3px solid white;
                  border-radius: 50%;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                "></div>
              `,
              className: '',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
          >
            <Popup>
              <div className="text-sm font-medium">Your Location</div>
            </Popup>
          </Marker>
        )}

        {/* Property markers */}
        {properties.map((property, index) => {
          const position = [property.location?.lat || 13.0827, property.location?.lng || 80.2707];
          const isSelected = selectedProperty?.id === property.id;
          const isTopRated = property.aiScore && property.aiScore >= 80;

          return (
            <Marker
              key={property.id}
              position={position}
              icon={createCustomIcon(isSelected, isTopRated)}
              eventHandlers={{
                click: () => {
                  onPropertySelect?.(property);
                }
              }}
            >
              <Popup>
                <div className="min-w-[200px]" data-testid={`map-popup-${property.id}`}>
                  <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'}
                    alt={property.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h4 className="font-heading font-bold text-sm mb-1">{property.title}</h4>
                  <p className="font-mono text-primary font-bold text-lg mb-2">
                    {formatCurrency(property.price)}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">{property.address}</p>
                  <button
                    onClick={() => navigate(`/property/${property.id}`)}
                    className="w-full bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};