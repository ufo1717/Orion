// Enhanced Authentication Context with Auth0 integration
import React, { createContext, useContext, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { User } from '@auth0/auth0-react';
import { isDemoMode, UserRole } from '../config/auth';
import { UserTier } from '../types';

interface AuthContextType {
  // Auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  // Auth actions
  login: () => void;
  logout: () => void;
  // Role-based access
  hasRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  // User tier (from Auth0 metadata or app state)
  userTier: UserTier;
  setUserTier: (tier: UserTier) => void;
  // Demo mode
  demoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get initial tier from storage or Auth0
const getInitialTier = (user: User | null): UserTier => {
  if (!user) return UserTier.TIER_1;
  
  // Try Auth0 metadata first
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metadata = (user as any)['https://orion.trading/user_metadata'];
  if (metadata?.tier) {
    return metadata.tier;
  }
  
  // Fallback to localStorage
  const storedTier = localStorage.getItem(`orion_user_tier_${user.sub}`);
  return storedTier ? (parseInt(storedTier, 10) as UserTier) : UserTier.TIER_1;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  // Local state for demo mode
  const [demoModeActive] = useState(isDemoMode);
  
  // Memoize user to prevent dependency changes
  const user = useMemo(() => {
    return demoModeActive ? { 
      sub: 'demo-user',
      email: 'demo@orion.trading',
      name: 'Demo User',
    } as User : auth0User || null;
  }, [demoModeActive, auth0User]);

  // Initialize tier from storage or Auth0
  const [userTier, setUserTier] = useState<UserTier>(() => getInitialTier(user));
  
  // Update userTier when user changes (e.g., from null to actual user)
  React.useEffect(() => {
    if (user) {
      const tier = getInitialTier(user);
      setUserTier(tier);
    }
  }, [user]);

  // In demo mode, treat user as authenticated
  const isAuthenticated = demoModeActive ? true : auth0IsAuthenticated;
  const isLoading = demoModeActive ? false : auth0IsLoading;

  // Update tier setter to persist to localStorage
  const handleSetUserTier = (tier: UserTier) => {
    setUserTier(tier);
    if (user?.sub) {
      localStorage.setItem(`orion_user_tier_${user.sub}`, tier.toString());
    }
  };

  const login = () => {
    if (demoModeActive) {
      console.log('Demo mode: Login simulated');
      return;
    }
    loginWithRedirect();
  };

  const logout = () => {
    if (demoModeActive) {
      console.log('Demo mode: Logout simulated');
      // Clear demo data
      if (user?.sub) {
        localStorage.removeItem(`orion_user_tier_${user.sub}`);
      }
      return;
    }
    auth0Logout({ 
      logoutParams: {
        returnTo: window.location.origin 
      }
    });
  };

  // Check if user has a specific role
  const hasRole = (role: UserRole): boolean => {
    if (demoModeActive) {
      // In demo mode, grant admin role
      return role === UserRole.ADMIN || role === UserRole.USER;
    }
    
    if (!user) return false;
    
    // Get roles from Auth0 user metadata or app_metadata
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roles = (user as any)['https://orion.trading/roles'] || (user as any)['app_metadata']?.roles || [];
    
    return roles.includes(role);
  };

  const isAdmin = hasRole(UserRole.ADMIN);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    hasRole,
    isAdmin,
    userTier,
    setUserTier: handleSetUserTier,
    demoMode: demoModeActive,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
