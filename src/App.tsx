import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { PublicDashboard } from './components/public/PublicDashboard';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: string[] }> = ({ 
  children, 
  requiredRole 
}) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !requiredRole.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();

  const getDashboardPath = () => {
    if (!currentUser) return '/login';

    switch (currentUser.role) {
      case 'admin':
        return '/admin';
      case 'ambulance_driver':
      case 'fire_driver':
        return '/driver';
      case 'public':
      default:
        return '/public';
    }
  };

  return (
    <Router>
      <Routes>
        {/* Root path */}
        <Route path="/" element={<Navigate to={getDashboardPath()} replace />} />

        {/* Signup and Login */}
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />

        {/* Dashboards with role protection */}
        <Route 
          path="/public" 
          element={
            <ProtectedRoute requiredRole={['public', 'admin']}>
              <PublicDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/driver" 
          element={
            <ProtectedRoute requiredRole={['ambulance_driver', 'fire_driver']}>
              <DriverDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/unauthorized" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                <p className="text-gray-600">You don't have permission to access this resource.</p>
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
