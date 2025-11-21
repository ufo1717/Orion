import { StrategyType, UserTier } from '../types';
import type { Strategy } from '../types';

export const STRATEGIES: Record<StrategyType, Strategy> = {
  [StrategyType.FOUNDATIONAL]: {
    id: StrategyType.FOUNDATIONAL,
    name: 'FOUNDATIONAL',
    tier: UserTier.TIER_1,
    riskProfile: 'Low',
    weeklyYield: '~2.1%',
    description: 'The Anchor - Steady, reliable growth with minimal risk',
    color: {
      primary: '#3b82f6', // blue-500
      secondary: '#22c55e', // green-500
      glow: 'rgba(59, 130, 246, 0.5)',
    },
    speed: 'slow',
  },
  [StrategyType.ADVANCED]: {
    id: StrategyType.ADVANCED,
    name: 'ADVANCED',
    tier: UserTier.TIER_2,
    riskProfile: 'Moderate-High',
    weeklyYield: '~5.4%',
    description: 'The Hunter - Volatility scalping with strategic precision',
    color: {
      primary: '#a855f7', // purple-500
      secondary: '#ec4899', // pink-500
      glow: 'rgba(168, 85, 247, 0.5)',
    },
    speed: 'medium',
  },
  [StrategyType.PRIME]: {
    id: StrategyType.PRIME,
    name: 'PRIME',
    tier: UserTier.TIER_3,
    riskProfile: 'Aggressive/Algorithmic',
    weeklyYield: '~12-15%',
    description: 'The Apex - God Mode algorithmic trading at maximum velocity',
    color: {
      primary: '#eab308', // yellow-500
      secondary: '#f59e0b', // amber-500
      glow: 'rgba(234, 179, 8, 0.6)',
    },
    speed: 'fast',
  },
};

export const getAvailableStrategies = (tier: UserTier): Strategy[] => {
  return Object.values(STRATEGIES).filter((strategy) => strategy.tier <= tier);
};

export const canAccessStrategy = (userTier: UserTier, strategy: StrategyType): boolean => {
  return STRATEGIES[strategy].tier <= userTier;
};
