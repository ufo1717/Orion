/**
 * Market Regime Manager for ORION Trading Bot
 * 
 * Manages simulated market regimes (bull, bear, sideways, volatile)
 * with randomized transitions every 30-60 minutes to create realistic
 * market behavior variations.
 */

export type MarketRegime = 'bull' | 'bear' | 'sideways' | 'volatile';

export interface MarketRegimeConfig {
  regime: MarketRegime;
  winRate: number;           // 0-1 probability of winning trades
  volatilityScore: number;   // 0-1 volatility level
  activityMultiplier: number; // Speed multiplier for trading activity
  messageWeight: {           // Relative weights for message types
    bullish: number;
    bearish: number;
    neutral: number;
  };
}

// Market regime configurations
const REGIME_CONFIGS: Record<MarketRegime, MarketRegimeConfig> = {
  bull: {
    regime: 'bull',
    winRate: 0.72,              // 72% win rate in bull markets
    volatilityScore: 0.45,       // Moderate volatility
    activityMultiplier: 1.2,     // 20% more activity
    messageWeight: {
      bullish: 3.0,
      bearish: 0.5,
      neutral: 1.0,
    },
  },
  bear: {
    regime: 'bear',
    winRate: 0.58,              // 58% win rate in bear markets (harder)
    volatilityScore: 0.65,       // Higher volatility
    activityMultiplier: 0.85,    // 15% less activity (more cautious)
    messageWeight: {
      bullish: 0.5,
      bearish: 3.0,
      neutral: 1.0,
    },
  },
  sideways: {
    regime: 'sideways',
    winRate: 0.65,              // 65% win rate in range-bound markets
    volatilityScore: 0.25,       // Low volatility
    activityMultiplier: 0.95,    // Slightly less activity
    messageWeight: {
      bullish: 1.0,
      bearish: 1.0,
      neutral: 2.0,
    },
  },
  volatile: {
    regime: 'volatile',
    winRate: 0.68,              // 68% win rate but with bigger swings
    volatilityScore: 0.85,       // Very high volatility
    activityMultiplier: 1.4,     // 40% more activity (more opportunities)
    messageWeight: {
      bullish: 1.5,
      bearish: 1.5,
      neutral: 0.5,
    },
  },
};

/**
 * Market Regime Manager
 * Handles automatic regime transitions with random intervals
 */
export class MarketRegimeManager {
  private currentRegime: MarketRegime;
  private currentConfig: MarketRegimeConfig;
  private nextTransitionTime: number;
  private transitionCallback?: (regime: MarketRegime, config: MarketRegimeConfig) => void;
  private timerHandle?: ReturnType<typeof setTimeout>;

  constructor(initialRegime: MarketRegime = 'sideways') {
    this.currentRegime = initialRegime;
    this.currentConfig = REGIME_CONFIGS[initialRegime];
    this.nextTransitionTime = this.calculateNextTransitionTime();
  }

  /**
   * Calculate next transition time (30-60 minutes from now)
   */
  private calculateNextTransitionTime(): number {
    const minMinutes = 30;
    const maxMinutes = 60;
    const randomMinutes = minMinutes + Math.random() * (maxMinutes - minMinutes);
    return Date.now() + randomMinutes * 60 * 1000;
  }

  /**
   * Select next regime randomly, avoiding immediate repetition
   */
  private selectNextRegime(): MarketRegime {
    const allRegimes: MarketRegime[] = ['bull', 'bear', 'sideways', 'volatile'];
    
    // Remove current regime to avoid staying in same regime
    const availableRegimes = allRegimes.filter(r => r !== this.currentRegime);
    
    // Weighted random selection (bull and sideways slightly more common)
    const weights = {
      bull: 1.2,
      bear: 1.0,
      sideways: 1.3,
      volatile: 0.8,
    };
    
    const availableWithWeights = availableRegimes.map(regime => ({
      regime,
      weight: weights[regime],
    }));
    
    const totalWeight = availableWithWeights.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of availableWithWeights) {
      random -= item.weight;
      if (random <= 0) {
        return item.regime;
      }
    }
    
    // Fallback
    return availableRegimes[0];
  }

  /**
   * Transition to a new regime
   */
  private transition(): void {
    const newRegime = this.selectNextRegime();
    this.currentRegime = newRegime;
    this.currentConfig = REGIME_CONFIGS[newRegime];
    this.nextTransitionTime = this.calculateNextTransitionTime();
    
    // Notify callback if set
    if (this.transitionCallback) {
      this.transitionCallback(this.currentRegime, this.currentConfig);
    }
    
    // Schedule next transition
    this.scheduleNextTransition();
  }

  /**
   * Schedule the next regime transition
   */
  private scheduleNextTransition(): void {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
    }
    
    const timeUntilTransition = this.nextTransitionTime - Date.now();
    
    // Ensure we don't set negative or very small timeouts
    const safeTimeout = Math.max(1000, timeUntilTransition);
    
    this.timerHandle = setTimeout(() => {
      this.transition();
    }, safeTimeout);
  }

  /**
   * Start automatic regime transitions
   */
  start(callback?: (regime: MarketRegime, config: MarketRegimeConfig) => void): void {
    this.transitionCallback = callback;
    this.scheduleNextTransition();
  }

  /**
   * Stop automatic regime transitions
   */
  stop(): void {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = undefined;
    }
  }

  /**
   * Get current regime
   */
  getCurrentRegime(): MarketRegime {
    return this.currentRegime;
  }

  /**
   * Get current regime configuration
   */
  getCurrentConfig(): MarketRegimeConfig {
    return this.currentConfig;
  }

  /**
   * Get time until next transition (in milliseconds)
   */
  getTimeUntilNextTransition(): number {
    return Math.max(0, this.nextTransitionTime - Date.now());
  }

  /**
   * Manually force a regime change (for testing)
   */
  forceTransition(regime?: MarketRegime): void {
    if (regime) {
      this.currentRegime = regime;
      this.currentConfig = REGIME_CONFIGS[regime];
    } else {
      this.transition();
    }
  }
}

/**
 * Create a market regime manager instance
 */
export const createMarketRegimeManager = (
  initialRegime?: MarketRegime
): MarketRegimeManager => {
  return new MarketRegimeManager(initialRegime);
};
