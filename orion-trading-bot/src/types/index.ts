// Core type definitions for ORION Trading Bot

export const UserTier = {
  TIER_1: 1,
  TIER_2: 2,
  TIER_3: 3,
} as const;

export type UserTier = typeof UserTier[keyof typeof UserTier];

export const StrategyType = {
  FOUNDATIONAL: 'FOUNDATIONAL',
  ADVANCED: 'ADVANCED',
  PRIME: 'PRIME',
} as const;

export type StrategyType = typeof StrategyType[keyof typeof StrategyType];

export interface Strategy {
  id: StrategyType;
  name: string;
  tier: UserTier;
  riskProfile: string;
  weeklyYield: string;
  description: string;
  color: {
    primary: string;
    secondary: string;
    glow: string;
  };
  speed: 'slow' | 'medium' | 'fast';
}

export interface TradeLog {
  id: string;
  timestamp: Date;
  pair: string;
  action: 'BUY' | 'SELL' | 'SCAN' | 'EXECUTE';
  message: string;
  profit?: number;
}

export interface ProfitTicker {
  current: number;
  change: number;
  percentage: number;
  isPositive: boolean;
}

export interface UserProfile {
  tier: UserTier;
  balance: number;
  activeStrategy?: StrategyType;
}

export interface Alert {
  id: string;
  type: 'info' | 'success' | 'warning';
  message: string;
  timestamp: Date;
}

// Market Data Types
export interface Candle {
  openTime: number;
  closeTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export interface MarketDataConfig {
  timeframe: string;
}
