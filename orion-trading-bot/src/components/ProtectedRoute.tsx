// Protected Route component for role-based access control
import React from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { UserRole } from '../config/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute - Renders children only if user is authenticated and has required role
 * @param children - Components to render if authorized
 * @param requiredRole - Optional role requirement
 * @param fallback - Optional fallback component to show if not authorized
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback = null,
}) => {
  const { isAuthenticated, isLoading, hasRole } = useAuthContext();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  // Check role if required
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h2>
          <p className="text-gray-400">
            You don't have permission to access this resource.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
