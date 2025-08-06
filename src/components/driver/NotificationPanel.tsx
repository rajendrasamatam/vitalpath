import React from 'react';
import { format } from 'date-fns';
import { Bell, MapPin, Clock, CheckCircle, X } from 'lucide-react';
import { EmergencyAlert } from '../../types';

interface NotificationPanelProps {
  alerts: EmergencyAlert[];
  onAcceptMission: (alert: EmergencyAlert) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  alerts, 
  onAcceptMission 
}) => {
  const handleAccept = (alert: EmergencyAlert) => {
    // In a real app, this would update the alert status in Firestore
    onAcceptMission(alert);
  };

  const handleReject = (alertId: string) => {
    // In a real app, this would update the alert status and reassign
    console.log('Rejecting alert:', alertId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">New Alerts</h3>
          {alerts.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {alerts.length}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No new emergency alerts</p>
            <p className="text-sm text-gray-400 mt-1">You'll be notified when assigned to a mission</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded-full ${
                      alert.type === 'ambulance' ? 'bg-red-100' : 'bg-orange-100'
                    }`}>
                      <Bell className={`h-4 w-4 ${
                        alert.type === 'ambulance' ? 'text-red-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <span className="font-semibold text-gray-900 capitalize">
                      {alert.type} Request
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(alert.timestamp, 'hh:mm a')}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <span>{alert.location.address}</span>
                  </div>
                  
                  {alert.description && (
                    <p className="text-sm text-gray-600 bg-white p-2 rounded border">
                      {alert.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Assigned {format(alert.timestamp, 'MMM dd, hh:mm a')}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAccept(alert)}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Accept Mission</span>
                  </button>
                  <button
                    onClick={() => handleReject(alert.id)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};