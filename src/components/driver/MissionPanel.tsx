import React, { useState } from 'react';
import { format } from 'date-fns';
import { MapPin, Navigation, Guitar as Hospital, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { EmergencyAlert, Hospital as HospitalType } from '../../types';

interface MissionPanelProps {
  mission: EmergencyAlert;
  driverType: 'ambulance' | 'fire';
  onMissionComplete: () => void;
}

export const MissionPanel: React.FC<MissionPanelProps> = ({ 
  mission, 
  driverType, 
  onMissionComplete 
}) => {
  const [missionPhase, setMissionPhase] = useState<'en_route' | 'arrived' | 'pickup' | 'transport'>('en_route');
  const [selectedHospital, setSelectedHospital] = useState<HospitalType | null>(null);

  // Mock nearby hospitals for ambulance missions
  const nearbyHospitals: HospitalType[] = [
    {
      id: 'h1',
      name: 'UCSF Medical Center',
      location: { lat: 37.7629, lng: -122.4577 },
      address: '505 Parnassus Ave, San Francisco, CA 94143',
      specialties: ['Cardiology', 'Emergency', 'Trauma'],
      emergencyCapacity: 8
    },
    {
      id: 'h2',
      name: 'SF General Hospital',
      location: { lat: 37.7576, lng: -122.4078 },
      address: '1001 Potrero Ave, San Francisco, CA 94110',
      specialties: ['Emergency', 'Trauma', 'Surgery'],
      emergencyCapacity: 12
    }
  ];

  const handlePhaseChange = (newPhase: typeof missionPhase) => {
    setMissionPhase(newPhase);
    if (newPhase === 'transport' && !selectedHospital) {
      // Auto-select nearest hospital
      setSelectedHospital(nearbyHospitals[0]);
    }
  };

  const handleMissionComplete = () => {
    // In a real app, this would update the mission status in Firestore
    onMissionComplete();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded-full ${
            driverType === 'ambulance' ? 'bg-red-100' : 'bg-orange-100'
          }`}>
            <AlertTriangle className={`h-5 w-5 ${
              driverType === 'ambulance' ? 'text-red-600' : 'text-orange-600'
            }`} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Active Mission</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {/* Mission Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Destination</span>
            </div>
            <p className="text-sm text-gray-700">{mission.location.address}</p>
            {mission.description && (
              <p className="text-sm text-gray-600 mt-2">{mission.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Assigned: {format(mission.timestamp, 'MMM dd, hh:mm a')}
            </p>
          </div>

          {/* Mission Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Mission Progress</span>
              <span className="text-xs text-gray-500 capitalize">{missionPhase.replace('_', ' ')}</span>
            </div>

            <div className="space-y-2">
              {/* En Route */}
              <div className={`flex items-center space-x-3 p-2 rounded ${
                missionPhase === 'en_route' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}>
                <div className={`h-3 w-3 rounded-full ${
                  missionPhase === 'en_route' ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                <span className="text-sm font-medium">En Route to Location</span>
              </div>

              {/* Arrived */}
              <button
                onClick={() => handlePhaseChange('arrived')}
                disabled={missionPhase === 'en_route'}
                className={`w-full flex items-center space-x-3 p-2 rounded transition-colors ${
                  missionPhase === 'arrived' ? 'bg-green-50 border border-green-200' : 
                  missionPhase === 'en_route' ? 'hover:bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                }`}
              >
                <div className={`h-3 w-3 rounded-full ${
                  missionPhase === 'arrived' ? 'bg-green-500' : 
                  missionPhase === 'en_route' ? 'bg-yellow-400' : 'bg-gray-300'
                }`} />
                <span className="text-sm font-medium">Arrived at Scene</span>
              </button>

              {driverType === 'ambulance' && (
                <>
                  {/* Patient Pickup */}
                  <button
                    onClick={() => handlePhaseChange('pickup')}
                    disabled={missionPhase !== 'arrived'}
                    className={`w-full flex items-center space-x-3 p-2 rounded transition-colors ${
                      missionPhase === 'pickup' ? 'bg-green-50 border border-green-200' : 
                      missionPhase === 'arrived' ? 'hover:bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`h-3 w-3 rounded-full ${
                      missionPhase === 'pickup' ? 'bg-green-500' : 
                      missionPhase === 'arrived' ? 'bg-yellow-400' : 'bg-gray-300'
                    }`} />
                    <span className="text-sm font-medium">Patient Secured</span>
                  </button>

                  {/* Hospital Selection */}
                  {missionPhase === 'pickup' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <div className="flex items-center space-x-2 mb-3">
                        <Hospital className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Select Hospital</span>
                      </div>
                      <div className="space-y-2">
                        {nearbyHospitals.map((hospital) => (
                          <button
                            key={hospital.id}
                            onClick={() => {
                              setSelectedHospital(hospital);
                              handlePhaseChange('transport');
                            }}
                            className={`w-full text-left p-2 rounded border transition-colors ${
                              selectedHospital?.id === hospital.id 
                                ? 'bg-blue-100 border-blue-300' 
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="text-sm font-medium text-gray-900">{hospital.name}</div>
                            <div className="text-xs text-gray-600">{hospital.address}</div>
                            <div className="text-xs text-green-600 mt-1">
                              Capacity: {hospital.emergencyCapacity} available
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200">
            {driverType === 'fire' && missionPhase === 'arrived' && (
              <button
                onClick={handleMissionComplete}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Mark Fire Handled</span>
              </button>
            )}

            {driverType === 'ambulance' && missionPhase === 'transport' && selectedHospital && (
              <div className="space-y-2">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Navigation className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Transporting to:</span>
                  </div>
                  <p className="text-sm text-green-700">{selectedHospital.name}</p>
                </div>
                <button
                  onClick={handleMissionComplete}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Patient Delivered</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};