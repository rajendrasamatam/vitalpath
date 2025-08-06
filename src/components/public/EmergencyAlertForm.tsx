import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Truck, Users, CheckCircle } from 'lucide-react';
import { emergencyService } from '../../services/emergencyService';
import { useAuth } from '../../contexts/AuthContext';

export const EmergencyAlertForm: React.FC = () => {
  const [emergencyType, setEmergencyType] = useState<'ambulance' | 'fire'>('ambulance');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [locationError, setLocationError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });

          try {
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
            );
            const data = await response.json();

            if (data.status === 'OK' && data.results.length > 0) {
              const area = data.results[0].formatted_address;
              setAddress(area);
              setLocationError('');
            } else {
              setAddress('');
              setLocationError('Unable to fetch address from location.');
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            setAddress('');
            setLocationError('Failed to fetch location address.');
          }
        },
        (error) => {
          setLocationError('Unable to detect location. Please enter manually.');
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !currentUser) return;

    setLoading(true);
    try {
      await emergencyService.createEmergencyAlert({
        type: emergencyType,
        location: {
          ...location,
          address
        },
        userId: currentUser.uid,
        description
      });

      setSuccess(true);
      setDescription('');

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error creating alert:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Alert Sent!</h3>
        <p className="text-gray-600 mb-4">
          Your request has been received and the nearest available {emergencyType} has been notified.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-medium mb-1">What happens next:</p>
          <ul className="text-left space-y-1">
            <li>1. Driver accepts the mission</li>
            <li>2. You'll see real-time tracking</li>
            <li>3. Traffic signals will be optimized</li>
            <li>4. Estimated arrival time provided</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Emergency Service</h3>

        {/* Emergency Type Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setEmergencyType('ambulance')}
            className={`p-4 border-2 rounded-lg transition-all ${
              emergencyType === 'ambulance'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <Truck className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">Ambulance</div>
              <div className="text-sm text-gray-500">Medical Emergency</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setEmergencyType('fire')}
            className={`p-4 border-2 rounded-lg transition-all ${
              emergencyType === 'fire'
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">Fire Engine</div>
              <div className="text-sm text-gray-500">Fire Emergency</div>
            </div>
          </button>
        </div>
      </div>

      {/* Location Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Emergency Location
        </label>
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className={`text-sm ${location ? 'text-green-600' : 'text-gray-500'}`}>
            {location ? 'Location detected' : 'Detecting location...'}
          </span>
        </div>

        {locationError && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-3 py-2 rounded-md text-sm mb-2">
            {locationError}
          </div>
        )}

        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address or landmark"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />

        <button
          type="button"
          onClick={getCurrentLocation}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Use current location
        </button>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Brief Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Briefly describe the emergency situation..."
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !location}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          emergencyType === 'ambulance'
            ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            : 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Sending Alert...
          </span>
        ) : (
          `Request ${emergencyType === 'ambulance' ? 'Ambulance' : 'Fire Engine'}`
        )}
      </button>

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 mb-1">Important Notice:</p>
            <p>This service complements but does not replace emergency hotlines. For immediate life-threatening situations, always call 911 first.</p>
          </div>
        </div>
      </div>
    </form>
  );
};
