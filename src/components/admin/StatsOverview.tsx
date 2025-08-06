import React from 'react';
import { Truck, AlertTriangle, CheckCircle, Clock, TrendingUp, Users } from 'lucide-react';

export const StatsOverview: React.FC = () => {
  // Mock data - in a real app, this would come from Firebase
  const stats = {
    activeVehicles: {
      ambulances: 12,
      fireEngines: 8,
      total: 20
    },
    todayAlerts: {
      total: 45,
      completed: 38,
      active: 4,
      pending: 3
    },
    responseTime: {
      average: 4.2, // minutes
      improvement: 12 // percentage
    },
    systemHealth: {
      uptime: 99.8,
      signals: 156,
      signalsOnline: 152
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
    trend?: { value: number; positive: boolean };
  }> = ({ title, value, subtitle, icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend.positive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`h-4 w-4 ${trend.positive ? '' : 'rotate-180'}`} />
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Vehicles"
            value={stats.activeVehicles.total}
            subtitle={`${stats.activeVehicles.ambulances} Ambulances, ${stats.activeVehicles.fireEngines} Fire Engines`}
            icon={<Truck className="h-5 w-5 text-blue-600" />}
            color="bg-blue-100"
          />
          
          <StatCard
            title="Today's Alerts"
            value={stats.todayAlerts.total}
            subtitle={`${stats.todayAlerts.completed} completed, ${stats.todayAlerts.active} active`}
            icon={<AlertTriangle className="h-5 w-5 text-orange-600" />}
            color="bg-orange-100"
          />
          
          <StatCard
            title="Avg Response Time"
            value={`${stats.responseTime.average} min`}
            icon={<Clock className="h-5 w-5 text-green-600" />}
            color="bg-green-100"
            trend={{ value: stats.responseTime.improvement, positive: true }}
          />
          
          <StatCard
            title="System Uptime"
            value={`${stats.systemHealth.uptime}%`}
            subtitle={`${stats.systemHealth.signalsOnline}/${stats.systemHealth.signals} signals online`}
            icon={<CheckCircle className="h-5 w-5 text-purple-600" />}
            color="bg-purple-100"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">Recent Emergency Alerts</h4>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { id: 1, type: 'ambulance', location: 'Mission District', time: '2 min ago', status: 'en_route' },
                { id: 2, type: 'fire', location: 'Financial District', time: '15 min ago', status: 'completed' },
                { id: 3, type: 'ambulance', location: 'Castro', time: '23 min ago', status: 'completed' },
                { id: 4, type: 'fire', location: 'Richmond', time: '1 hour ago', status: 'completed' },
              ].map((alert) => (
                <div key={alert.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded-full ${
                      alert.type === 'ambulance' ? 'bg-red-100' : 'bg-orange-100'
                    }`}>
                      <Truck className={`h-4 w-4 ${
                        alert.type === 'ambulance' ? 'text-red-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {alert.type} - {alert.location}
                      </p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : alert.status === 'en_route'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">Vehicle Status</h4>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { id: 'AMB-001', type: 'Ambulance', driver: 'John Smith', status: 'en_route', location: 'Mission St' },
                { id: 'AMB-002', type: 'Ambulance', driver: 'Sarah Johnson', status: 'available', location: 'Station 1' },
                { id: 'FIRE-001', type: 'Fire Engine', driver: 'Mike Wilson', status: 'available', location: 'Station 2' },
                { id: 'AMB-003', type: 'Ambulance', driver: 'Lisa Davis', status: 'busy', location: 'UCSF Medical' },
              ].map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded-full ${
                      vehicle.type === 'Ambulance' ? 'bg-red-100' : 'bg-orange-100'
                    }`}>
                      <Truck className={`h-4 w-4 ${
                        vehicle.type === 'Ambulance' ? 'text-red-600' : 'text-orange-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {vehicle.id} - {vehicle.driver}
                      </p>
                      <p className="text-xs text-gray-500">{vehicle.location}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    vehicle.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : vehicle.status === 'en_route'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vehicle.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};