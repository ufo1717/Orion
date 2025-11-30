// CapWheel Enterprise Context
// Enterprise-specific state management for CapWheel trading platform

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// RWA (Real World Asset) Categories
export type RWACategory = 'T-Bills' | 'Real Estate' | 'Gold' | 'Commodities' | 'Corporate Bonds';

export interface RWAPosition {
  category: RWACategory;
  allocation: number; // Percentage (0-100)
  value: number; // USD value
  yield: number; // Annual yield percentage
  lastRebalance: Date;
}

export interface HedgeMetrics {
  efficiency: number; // 0-100 percentage
  correlation: number; // -1 to 1
  volatilityReduction: number; // Percentage
  autoRebalanceEnabled: boolean;
  nextRebalanceTime: Date | null;
}

// Enterprise user roles
export type EnterpriseRole = 'analyst' | 'trader' | 'portfolio_manager' | 'admin' | 'executive';

export interface EnterpriseUser {
  id: string;
  name: string;
  email: string;
  role: EnterpriseRole;
  desk?: string;
  permissions: string[];
}

// Portfolio metrics
export interface PortfolioMetrics {
  totalAUM: number;
  dailyPnL: number;
  dailyPnLPercent: number;
  sharpeRatio: number;
  winRate: number;
  volatilityCaptured: number;
  timeWeightedReturn: number;
  maxDrawdown: number;
  cryptoAllocation: number;
  rwaAllocation: number;
}

// Firm settings
export interface FirmSettings {
  name: string;
  maxRiskExposure: number;
  autoHedgeThreshold: number;
  rebalanceFrequency: 'hourly' | 'daily' | 'weekly';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

interface CapWheelContextType {
  // User state
  enterpriseUser: EnterpriseUser | null;
  setEnterpriseUser: (user: EnterpriseUser | null) => void;
  
  // RWA state
  rwaPositions: RWAPosition[];
  updateRWAPosition: (category: RWACategory, allocation: number) => void;
  totalRWAAllocation: number;
  
  // Hedge metrics
  hedgeMetrics: HedgeMetrics;
  setAutoRebalance: (enabled: boolean) => void;
  
  // Portfolio metrics
  portfolioMetrics: PortfolioMetrics;
  updatePortfolioMetrics: (metrics: Partial<PortfolioMetrics>) => void;
  
  // Firm settings
  firmSettings: FirmSettings;
  updateFirmSettings: (settings: Partial<FirmSettings>) => void;
  
  // UI state
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const CapWheelContext = createContext<CapWheelContextType | undefined>(undefined);

// Mock initial data
const initialRWAPositions: RWAPosition[] = [
  { category: 'T-Bills', allocation: 40, value: 4000000, yield: 5.2, lastRebalance: new Date() },
  { category: 'Real Estate', allocation: 25, value: 2500000, yield: 4.8, lastRebalance: new Date() },
  { category: 'Gold', allocation: 20, value: 2000000, yield: 0, lastRebalance: new Date() },
  { category: 'Commodities', allocation: 10, value: 1000000, yield: 3.1, lastRebalance: new Date() },
  { category: 'Corporate Bonds', allocation: 5, value: 500000, yield: 6.5, lastRebalance: new Date() },
];

const initialHedgeMetrics: HedgeMetrics = {
  efficiency: 87.5,
  correlation: -0.42,
  volatilityReduction: 34.2,
  autoRebalanceEnabled: true,
  nextRebalanceTime: new Date(Date.now() + 3600000), // 1 hour from now
};

const initialPortfolioMetrics: PortfolioMetrics = {
  totalAUM: 25000000,
  dailyPnL: 127500,
  dailyPnLPercent: 0.51,
  sharpeRatio: 2.34,
  winRate: 68.5,
  volatilityCaptured: 12.8,
  timeWeightedReturn: 23.4,
  maxDrawdown: 8.2,
  cryptoAllocation: 60,
  rwaAllocation: 40,
};

const initialFirmSettings: FirmSettings = {
  name: 'CapWheel Capital',
  maxRiskExposure: 25,
  autoHedgeThreshold: 15,
  rebalanceFrequency: 'daily',
  riskTolerance: 'moderate',
};

export const CapWheelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [enterpriseUser, setEnterpriseUser] = useState<EnterpriseUser | null>(null);
  const [rwaPositions, setRWAPositions] = useState<RWAPosition[]>(initialRWAPositions);
  const [hedgeMetrics, setHedgeMetrics] = useState<HedgeMetrics>(initialHedgeMetrics);
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics>(initialPortfolioMetrics);
  const [firmSettings, setFirmSettings] = useState<FirmSettings>(initialFirmSettings);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const totalRWAAllocation = rwaPositions.reduce((sum, pos) => sum + pos.allocation, 0);

  const updateRWAPosition = useCallback((category: RWACategory, allocation: number) => {
    setRWAPositions(prev => 
      prev.map(pos => 
        pos.category === category 
          ? { ...pos, allocation, lastRebalance: new Date() }
          : pos
      )
    );
  }, []);

  const setAutoRebalance = useCallback((enabled: boolean) => {
    setHedgeMetrics(prev => ({
      ...prev,
      autoRebalanceEnabled: enabled,
      nextRebalanceTime: enabled ? new Date(Date.now() + 3600000) : null,
    }));
  }, []);

  const updatePortfolioMetrics = useCallback((metrics: Partial<PortfolioMetrics>) => {
    setPortfolioMetrics(prev => ({ ...prev, ...metrics }));
  }, []);

  const updateFirmSettings = useCallback((settings: Partial<FirmSettings>) => {
    setFirmSettings(prev => ({ ...prev, ...settings }));
  }, []);

  const login = useCallback(() => {
    // Mock login - in production, this would integrate with enterprise SSO
    setEnterpriseUser({
      id: 'cw-001',
      name: 'Enterprise User',
      email: 'user@capwheel.capital',
      role: 'portfolio_manager',
      desk: 'Crypto Alpha',
      permissions: ['view_portfolio', 'execute_trades', 'manage_hedges'],
    });
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setEnterpriseUser(null);
    setIsAuthenticated(false);
  }, []);

  const value: CapWheelContextType = {
    enterpriseUser,
    setEnterpriseUser,
    rwaPositions,
    updateRWAPosition,
    totalRWAAllocation,
    hedgeMetrics,
    setAutoRebalance,
    portfolioMetrics,
    updatePortfolioMetrics,
    firmSettings,
    updateFirmSettings,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <CapWheelContext.Provider value={value}>
      {children}
    </CapWheelContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCapWheel = () => {
  const context = useContext(CapWheelContext);
  if (context === undefined) {
    throw new Error('useCapWheel must be used within a CapWheelProvider');
  }
  return context;
};
