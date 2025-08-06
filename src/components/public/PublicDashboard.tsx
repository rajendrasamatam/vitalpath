import React, { useState } from 'react';
import { Header } from '../common/Header';
import { EmergencyAlertForm } from './EmergencyAlertForm';
import { AlertHistory } from './AlertHistory';
import { Phone, AlertTriangle, Activity } from 'lucide-react';

export const PublicDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alert' | 'history'>('alert');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Emergency Services" />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Emergency Contact Banner */}
        <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Phone className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Emergency Hotline</h3>
                <p className="text-blue-100">For immediate life-threatening emergencies, call 911</p>
              </div>
            </div>
            <a
              href="tel:911"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Call 911
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('alert')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'alert'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Request Emergency</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>My Requests</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'alert' && <EmergencyAlertForm />}
            {activeTab === 'history' && <AlertHistory />}
          </div>
        </div>

        {/* Service Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Ambulance Services</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Request immediate medical assistance with automatic routing to the nearest hospital.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• GPS-based location detection</li>
              <li>• Nearest ambulance dispatch</li>
              <li>• Hospital routing assistance</li>
              <li>• Real-time tracking</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-sky-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-sky-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Fire Services</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Report fires and emergencies with rapid response coordination.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Immediate fire department alert</li>
              <li>• Optimized route planning</li>
              <li>• Traffic signal coordination</li>
              <li>• Multi-unit dispatch capability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
