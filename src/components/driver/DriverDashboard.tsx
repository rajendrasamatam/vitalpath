import React, { useState, useEffect } from 'react';
import { Header } from '../common/Header';
import { MissionPanel } from './MissionPanel';
import { MapView } from '../common/MapView';
import { NotificationPanel } from './NotificationPanel';
import { useAuth } from '../../contexts/AuthContext';
import { emergencyService } from '../../services/emergencyService';
import { EmergencyAlert } from '../../types';

export const DriverDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentMission, setCurrentMission] = useState<EmergencyAlert | null>(null);
  const [pendingAlerts, setPendingAlerts] = useState<EmergencyAlert[]>([]);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number }>({
    lat: 37.7749,
    lng: -122.4194
  });

  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to new alerts assigned to this driver
    const unsubscribe = emergencyService.subscribeToAlerts((alerts) => {
      const driverAlerts = alerts.filter(alert => 
        alert.assignedDriverId === currentUser.uid && 
        ['assigned', 'en_route'].includes(alert.status)
      );
      
      const active = driverAlerts.find(alert => alert.status === 'en_route');
      const pending = driverAlerts.filter(alert => alert.status === 'assigned');
      
      setCurrentMission(active || null);
      setPendingAlerts(pending);
    });

    // Start location tracking
    const locationInterval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setDriverLocation(newLocation);
            
            // Update location in real-time database
            // emergencyService.updateDriverLocation(currentUser.uid, newLocation);
          },
          (error) => console.error('Error getting location:', error),
          { enableHighAccuracy: true }
        );
      }
    }, 10000); // Update every 10 seconds

    return () => {
      unsubscribe();
      clearInterval(locationInterval);
    };
  }, [currentUser]);

  const driverType = currentUser?.role === 'ambulance_driver' ? 'ambulance' : 'fire';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`${driverType === 'ambulance' ? 'Ambulance' : 'Fire Engine'} Driver Dashboard`} />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Mission & Notifications */}
          <div className="lg:col-span-1 space-y-6">
            <NotificationPanel 
              alerts={pendingAlerts}
              onAcceptMission={(alert) => setCurrentMission(alert)}
            />
            
            {currentMission && (
              <MissionPanel 
                mission={currentMission}
                driverType={driverType}
                onMissionComplete={() => setCurrentMission(null)}
              />
            )}
          </div>

          {/* Right Panel - Map */}
          <div className="lg:col-span-2">
            <MapView 
              driverLocation={driverLocation}
              currentMission={currentMission}
              driverType={driverType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};