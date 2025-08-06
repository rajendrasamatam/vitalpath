import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Clock, MapPin, CheckCircle, AlertCircle, Truck } from 'lucide-react';
import { EmergencyAlert } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export const AlertHistory: React.FC = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // In a real app, this would fetch user's alert history from Firestore
    // For demo purposes, showing mock data
    const mockAlerts: EmergencyAlert[] = [
      {
        id: '1',
        type: 'ambulance',
        location: {
          lat: 37.7749,
          lng: -122.4194,
          address: '123 Main St, San Francisco, CA'
        },
        timestamp: Date.now() - 3600000, // 1 hour ago
        status: 'completed',
        assignedDriverId: 'driver1',
        userId: currentUser?.uid || '',
        description: 'Medical emergency - chest pain',
        hospitalDestination: {
          id: 'h1',
          name: 'UCSF Medical Center',
          location: { lat: 37.7629, lng: -122.4577 },
          address: '505 Parnassus Ave, San Francisco, CA 94143',
          specialties: ['Cardiology', 'Emergency'],
          emergencyCapacity: 15
        }
      },
      {
        id: '2',
        type: 'fire',
        location: {
          lat: 37.7849,
          lng: -122.4094,
          address: '456 Oak St, San Francisco, CA'
        },
        timestamp: Date.now() - 7200000, // 2 hours ago
        status: 'completed',
        assignedDriverId: 'driver2',
        userId: currentUser?.uid || '',
        description: 'Kitchen fire reported'
      }
    ];

    setAlerts(mockAlerts);
    setLoading(false);
  }, [currentUser]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'en_route':
        return 'text-blue-600 bg-blue-50';
      case 'assigned':
        return 'text-yellow-600 bg-yellow-50';
      case 'pending':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'en_route':
        return <Truck className="h-4 w-4" />;
      case 'assigned':
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Emergency Requests</h3>
        <p className="text-gray-600">Your emergency request history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Emergency Requests</h3>
      
      {alerts.map((alert) => (
        <div key={alert.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-1 rounded-full ${alert.type === 'ambulance' ? 'bg-red-100' : 'bg-orange-100'}`}>
                  <Truck className={`h-4 w-4 ${alert.type === 'ambulance' ? 'text-red-600' : 'text-orange-600'}`} />
                </div>
                <span className="font-medium text-gray-900 capitalize">
                  {alert.type === 'ambulance' ? 'Ambulance' : 'Fire Engine'} Request
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(alert.status)}`}>
                  {getStatusIcon(alert.status)}
                  <span className="capitalize">{alert.status.replace('_', ' ')}</span>
                </span>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{format(alert.timestamp, 'MMM dd, yyyy at hh:mm a')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{alert.location.address}</span>
                </div>
                {alert.description && (
                  <p className="text-gray-700 mt-2">{alert.description}</p>
                )}
                {alert.hospitalDestination && (
                  <div className="mt-2 p-2 bg-white rounded border">
                    <p className="text-xs font-medium text-gray-900">Hospital Destination:</p>
                    <p className="text-xs text-gray-600">{alert.hospitalDestination.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};