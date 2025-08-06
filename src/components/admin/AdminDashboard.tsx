import React, { useState, useEffect } from 'react';
import { Header } from '../common/Header';
import { StatsOverview } from './StatsOverview';
import { LiveMap } from './LiveMap';
import { SystemLogs } from './SystemLogs';
import { TrafficControl } from './TrafficControl';
import { BarChart3, Map, Settings, FileText } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'traffic' | 'logs'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'map', label: 'Live Map', icon: Map },
    { id: 'traffic', label: 'Traffic Control', icon: Settings },
    { id: 'logs', label: 'System Logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="System Administration" />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <StatsOverview />}
            {activeTab === 'map' && <LiveMap />}
            {activeTab === 'traffic' && <TrafficControl />}
            {activeTab === 'logs' && <SystemLogs />}
          </div>
        </div>
      </div>
    </div>
  );
};