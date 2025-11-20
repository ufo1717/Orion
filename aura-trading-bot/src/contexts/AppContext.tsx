import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { UserTier, StrategyType } from '../types';
import type { UserProfile } from '../types';

interface AppContextType {
  userProfile: UserProfile;
  setUserTier: (tier: UserTier) => void;
  setActiveStrategy: (strategy: StrategyType | undefined) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    tier: UserTier.TIER_1, // Default tier, will be set during onboarding
    balance: 10000,
    activeStrategy: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);

  const setUserTier = (tier: UserTier) => {
    setUserProfile((prev) => ({ ...prev, tier }));
  };

  const setActiveStrategy = (strategy: StrategyType | undefined) => {
    setUserProfile((prev) => ({ ...prev, activeStrategy: strategy }));
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserTier,
        setActiveStrategy,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
