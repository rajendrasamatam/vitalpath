import React, { useState } from 'react';
import { Settings, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

export const TrafficControl: React.FC = () => {
  const [signals, setSignals] = useState([
    { id: 'TS-001', location: 'Market & 1st St', status: 'green', isOverridden: false, lastUpdated: Date.now() - 120000 },
    { id: 'TS-002', location: 'Mission & 5th St', status: 'red', isOverridden: true, lastUpdated: Date.now() - 60000 },
    { id: 'TS-003', location: 'Van Ness & Geary', status: 'yellow', isOverridden: false, lastUpdated: Date.now() - 300000 },
    { id: 'TS-004', location: 'Lombard & Fillmore', status: 'green', isOverridden: false, lastUpdated: Date.now() - 180000 },
  ]);

  const handleSignalOverride = (signalId: string, newStatus: 'red' | 'green' | 'yellow') => {
    setSignals(prev => prev.map(signal => 
      signal.id === signalId 
        ? { ...signal, status: newStatus, isOverridden: true, lastUpdated: Date.now() }
        : signal
    ));
  };

  const handleRemoveOverride = (signalId: string) => {
    setSignals(prev => prev.map(signal => 
      signal.id === signalId 
        ? { ...signal, isOverridden: false, lastUpdated: Date.now() }
        : signal
    ));
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Traffic Signal Control</h3>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            {signals.filter(s => s.isOverridden).length} signals under manual control
          </span>
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh All</span>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-900">System Status</span>
          </div>
          <p className="text-2xl font-bold text-green-600">Online</p>
          <p className="text-sm text-gray-600">All systems operational</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900">Total Signals</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{signals.length}</p>
          <p className="text-sm text-gray-600">{signals.filter(s => s.isOverridden).length} under override</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="font-medium text-gray-900">Active Routes</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">3</p>
          <p className="text-sm text-gray-600">Emergency vehicles en route</p>
        </div>
      </div>

      {/* Traffic Signals List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Traffic Signal Management</h4>
        </div>
        <div className="divide-y divide-gray-200">
          {signals.map((signal) => (
            <div key={signal.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`h-6 w-6 rounded-full ${
                    signal.status === 'green' ? 'bg-green-500' :
                    signal.status === 'red' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <h5 className="font-medium text-gray-900">{signal.id}</h5>
                    <p className="text-sm text-gray-600">{signal.location}</p>
                  </div>
                  {signal.isOverridden && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                      Manual Override
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    Updated {getTimeAgo(signal.lastUpdated)}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleSignalOverride(signal.id, 'red')}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        signal.status === 'red' 
                          ? 'bg-red-500 border-red-500' 
                          : 'border-red-300 hover:border-red-500'
                      }`}
                      title="Set to Red"
                    />
                    <button
                      onClick={() => handleSignalOverride(signal.id, 'yellow')}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        signal.status === 'yellow' 
                          ? 'bg-yellow-500 border-yellow-500' 
                          : 'border-yellow-300 hover:border-yellow-500'
                      }`}
                      title="Set to Yellow"
                    />
                    <button
                      onClick={() => handleSignalOverride(signal.id, 'green')}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        signal.status === 'green' 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-green-300 hover:border-green-500'
                      }`}
                      title="Set to Green"
                    />
                  </div>

                  {signal.isOverridden && (
                    <button
                      onClick={() => handleRemoveOverride(signal.id)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Auto
                    </button>
                  )}
                </div>
              </div>

              {signal.isOverridden && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Manual Override Active</span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    This signal is under manual control and will not respond to automatic emergency routing.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Emergency Controls</h4>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <AlertTriangle className="h-5 w-5" />
              <span>Emergency All Stop</span>
            </button>
            <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle className="h-5 w-5" />
              <span>Clear All Overrides</span>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Emergency controls affect all traffic signals system-wide. Use with caution.
          </p>
        </div>
      </div>
    </div>
  );
};