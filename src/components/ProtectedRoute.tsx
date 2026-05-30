import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show a basic Tailwind loading spinner while auth context rehydrates
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect unauthenticated users strictly to the public landing page (/)
    // and remember the intended location so we can redirect them back after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Render a strict 403 Forbidden message if their role profile is incompatible
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403 Forbidden</h1>
        <p className="text-gray-600 text-lg max-w-md">
          You do not have the required permissions to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="mt-6 flex gap-4">
          <a href="/" className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors font-semibold">
            Return to Home
          </a>
          <button 
            onClick={() => {
              logout();
              window.location.href = '/login';
            }} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-semibold"
          >
            Sign Out & Try Again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
