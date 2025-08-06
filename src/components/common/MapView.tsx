import React from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { EmergencyAlert } from '../../types';

interface MapViewProps {
  driverLocation: { lat: number; lng: number };
  currentMission?: EmergencyAlert | null;
  driverType: 'ambulance' | 'fire';
}

export const MapView: React.FC<MapViewProps> = ({ 
  driverLocation, 
  currentMission, 
  driverType 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Navigation & Route</h3>
      </div>
      
      <div className="p-4">
        {/* Map Placeholder */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">Live Map View</h4>
          <p className="text-gray-500 mb-4">
            Real-time GPS tracking and route navigation
          </p>
          <div className="text-sm text-gray-400">
            Google Maps integration would be loaded here
          </div>
        </div>

        {/* Current Status */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`p-1 rounded-full ${
                driverType === 'ambulance' ? 'bg-red-100' : 'bg-orange-100'
              }`}>
                <Navigation className={`h-4 w-4 ${
                  driverType === 'ambulance' ? 'text-red-600' : 'text-orange-600'
                }`} />
              </div>
              <span className="font-medium text-gray-900">Your Location</span>
            </div>
            <p className="text-sm text-gray-600">
              {driverLocation.lat.toFixed(6)}, {driverLocation.lng.toFixed(6)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>

          {currentMission && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-gray-900">Mission Destination</span>
              </div>
              <p className="text-sm text-gray-600">{currentMission.location.address}</p>
              <p className="text-xs text-gray-500 mt-1">
                ETA: 8 minutes (estimated)
              </p>
            </div>
          )}
        </div>

        {/* Traffic Signal Status */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Nearby Traffic Signals</h4>
          <div className="space-y-2">
            {[
              { id: 'TS-001', location: 'Mission & 5th St', distance: '0.2 mi', status: 'green', controlled: true },
              { id: 'TS-002', location: 'Market & 6th St', distance: '0.5 mi', status: 'red', controlled: false },
              { id: 'TS-003', location: 'Howard & 7th St', distance: '0.8 mi', status: 'yellow', controlled: false },
            ].map((signal) => (
              <div key={signal.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${
                    signal.status === 'green' ? 'bg-green-500' :
                    signal.status === 'red' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{signal.location}</p>
                    <p className="text-xs text-gray-500">{signal.distance} away</p>
                  </div>
                </div>
                {signal.controlled && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Auto-controlled
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};