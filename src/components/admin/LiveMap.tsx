import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Truck } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

export const LiveMap: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const activeVehicles = [
    { id: 'AMB-001', type: 'ambulance', lat: 37.7749, lng: -122.4194, status: 'en_route', mission: 'Emergency at Mission St' },
    { id: 'AMB-002', type: 'ambulance', lat: 37.7849, lng: -122.4094, status: 'available' },
    { id: 'FIRE-001', type: 'fire', lat: 37.7649, lng: -122.4294, status: 'available' },
    { id: 'AMB-003', type: 'ambulance', lat: 37.7549, lng: -122.4394, status: 'busy', mission: 'Transport to UCSF' },
  ];

  const trafficSignals = [
    { id: 'TS-001', lat: 37.7749, lng: -122.4194, status: 'green', controlled: true },
    { id: 'TS-002', lat: 37.7849, lng: -122.4094, status: 'red', controlled: false },
    { id: 'TS-003', lat: 37.7649, lng: -122.4294, status: 'yellow', controlled: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live System Map</h3>

        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
            {activeVehicles.map(vehicle => (
              <Marker
                key={vehicle.id}
                position={{ lat: vehicle.lat, lng: vehicle.lng }}
                label={{
                  text: vehicle.id,
                  className: 'text-xs font-semibold bg-white px-1 py-0.5 rounded',
                }}
              />
            ))}
            {trafficSignals.map(signal => (
              <Marker
                key={signal.id}
                position={{ lat: signal.lat, lng: signal.lng }}
                icon={{
                  url:
                    signal.status === 'green'
                      ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                      : signal.status === 'red'
                      ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                      : 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};
