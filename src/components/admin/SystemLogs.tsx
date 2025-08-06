import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search, Filter, Download, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export const SystemLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'emergency' | 'traffic' | 'system'>('all');

  // Mock log data
  const logs = [
    {
      id: '1',
      timestamp: Date.now() - 300000,
      type: 'emergency',
      level: 'info',
      message: 'Emergency alert created - Ambulance request at Mission District',
      userId: 'user123',
      details: { alertId: 'alert-001', location: 'Mission & 5th St' }
    },
    {
      id: '2',
      timestamp: Date.now() - 600000,
      type: 'traffic',
      level: 'warning',
      message: 'Traffic signal TS-002 manually overridden to green',
      userId: 'admin456',
      details: { signalId: 'TS-002', previousStatus: 'red', newStatus: 'green' }
    },
    {
      id: '3',
      timestamp: Date.now() - 900000,
      type: 'system',
      level: 'success',
      message: 'Driver AMB-001 completed mission alert-001',
      userId: 'driver789',
      details: { vehicleId: 'AMB-001', alertId: 'alert-001', duration: '12 minutes' }
    },
    {
      id: '4',
      timestamp: Date.now() - 1200000,
      type: 'emergency',
      level: 'error',
      message: 'Failed to assign driver to alert - No available ambulances',
      userId: 'system',
      details: { alertId: 'alert-002', attemptCount: 3 }
    },
    {
      id: '5',
      timestamp: Date.now() - 1800000,
      type: 'traffic',
      level: 'info',
      message: 'Automatic signal control activated for route optimization',
      userId: 'system',
      details: { routeId: 'route-123', signalsAffected: 4 }
    }
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'traffic':
        return 'bg-orange-100 text-orange-800';
      case 'system':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">System Logs</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Download className="h-4 w-4" />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="emergency">Emergency</option>
              <option value="traffic">Traffic</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-2">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className={`border rounded-lg p-4 ${getLevelColor(log.level)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getLevelIcon(log.level)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                    {log.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {format(log.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                  </span>
                  <span className="text-sm text-gray-500">
                    User: {log.userId}
                  </span>
                </div>
                <p className="text-gray-900 font-medium mb-2">{log.message}</p>
                {log.details && (
                  <div className="bg-white bg-opacity-50 rounded p-2 text-sm">
                    <pre className="text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No logs found matching your criteria.</p>
        </div>
      )}

      {/* Pagination would go here in a real app */}
      <div className="flex justify-center pt-6">
        <div className="text-sm text-gray-500">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      </div>
    </div>
  );
};