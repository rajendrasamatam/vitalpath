import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Shield, Truck, Users } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { currentUser, logout } = useAuth();

  const getRoleIcon = () => {
    switch (currentUser?.role) {
      case 'admin':
        return <Shield className="h-5 w-5" />;
      case 'ambulance_driver':
      case 'fire_driver':
        return <Truck className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getRoleColor = () => {
    switch (currentUser?.role) {
      case 'admin':
        return 'bg-blue-500';
      case 'ambulance_driver':
        return 'bg-red-500';
      case 'fire_driver':
        return 'bg-orange-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">VitalRoute</h1>
            </div>
            <div className="ml-8">
              <h2 className="text-lg font-medium text-gray-700">{title}</h2>
            </div>
          </div>

          {currentUser && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-full text-white ${getRoleColor()}`}>
                  {getRoleIcon()}
                </div>
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{currentUser.name}</p>
                  <p className="text-gray-500 capitalize">{currentUser.role.replace('_', ' ')}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};