/**
 * Advanced Timing Manager for ORION Trading Bot
 * 
 * Provides randomized, organic timing for logs and alerts with:
 * - Configurable variance (±30% default)
 * - Burst/cluster behavior
 * - Time-of-day multipliers
 * - Prevention of predictable patterns (no 3+ consistent intervals)
 */

export interface TimingConfig {
  baseInterval: number;        // Base interval in milliseconds
  variancePercent?: number;     // Percentage variance (default: 30)
  burstProbability?: number;    // Probability of burst (0-1, default: 0.15)
  burstMinCount?: number;       // Minimum items in burst (default: 2)
  burstMaxCount?: number;       // Maximum items in burst (default: 5)
  burstIntervalMin?: number;    // Min interval during burst (default: 100ms)
  burstIntervalMax?: number;    // Max interval during burst (default: 500ms)
  slowdownProbability?: number; // Probability of slowdown (0-1, default: 0.1)
  slowdownMultiplier?: number;  // Multiplier for slowdown (default: 2.5)
  timeOfDayEnabled?: boolean;   // Enable time-of-day multipliers (default: true)
}

export interface TimingState {
  lastInterval: number;
  consistentCount: number;      // Count of similar intervals in a row
  inBurst: boolean;
  burstRemaining: number;
  lastTimestamp: number;
}

/**
 * Time-of-day multipliers based on simulated market activity
 * Morning (5-12): High activity - 0.8x (faster)
 * Midday (12-17): Peak activity - 0.7x (fastest)
 * Evening (17-22): Moderate activity - 1.0x (normal)
 * Night (22-5): Low activity - 1.5x (slower)
 */
export const getTimeOfDayMultiplier = (): number => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 0.8; // Morning - higher activity
  } else if (hour >= 12 && hour < 17) {
    return 0.7; // Midday - peak activity
  } else if (hour >= 17 && hour < 22) {
    return 1.0; // Evening - normal
  } else {
    return 1.5; // Night - lower activity
  }
};

/**
 * Get market condition multiplier based on volatility
 * High volatility = faster intervals
 * Low volatility = slower intervals
 */
export const getMarketConditionMultiplier = (volatilityScore: number): number => {
  // Volatility score 0-1
  // High volatility (>0.7) = 0.8x faster
  // Medium volatility (0.3-0.7) = 1.0x normal
  // Low volatility (<0.3) = 1.3x slower
  
  if (volatilityScore > 0.7) {
    return 0.8;
  } else if (volatilityScore < 0.3) {
    return 1.3;
  } else {
    return 1.0;
  }
};

/**
 * Check if two intervals are "similar" (within 15% of each other)
 */
const areSimilarIntervals = (interval1: number, interval2: number): boolean => {
  const ratio = Math.abs(interval1 - interval2) / Math.max(interval1, interval2);
  return ratio < 0.15; // Within 15% is considered "similar"
};

/**
 * Advanced interval generator with variance and organic behavior
 */
export class TimingManager {
  private config: Required<TimingConfig>;
  private state: TimingState;

  constructor(config: TimingConfig) {
    // Set defaults for optional parameters
    this.config = {
      baseInterval: config.baseInterval,
      variancePercent: config.variancePercent ?? 30,
      burstProbability: config.burstProbability ?? 0.15,
      burstMinCount: config.burstMinCount ?? 2,
      burstMaxCount: config.burstMaxCount ?? 5,
      burstIntervalMin: config.burstIntervalMin ?? 100,
      burstIntervalMax: config.burstIntervalMax ?? 500,
      slowdownProbability: config.slowdownProbability ?? 0.1,
      slowdownMultiplier: config.slowdownMultiplier ?? 2.5,
      timeOfDayEnabled: config.timeOfDayEnabled ?? true,
    };

    this.state = {
      lastInterval: 0,
      consistentCount: 0,
      inBurst: false,
      burstRemaining: 0,
      lastTimestamp: Date.now(),
    };
  }

  /**
   * Get next interval with all randomization and variance applied
   */
  getNextInterval(volatilityScore: number = 0.5): number {
    let interval: number;
    let isBurstInterval = false;

    // Check if we're in a burst
    if (this.state.inBurst && this.state.burstRemaining > 0) {
      interval = this.getBurstInterval();
      this.state.burstRemaining--;
      isBurstInterval = true;
      
      if (this.state.burstRemaining === 0) {
        this.state.inBurst = false;
      }
    } else {
      // Decide if we should start a burst
      if (Math.random() < this.config.burstProbability) {
        this.state.inBurst = true;
        this.state.burstRemaining = Math.floor(
          Math.random() * (this.config.burstMaxCount - this.config.burstMinCount + 1) +
          this.config.burstMinCount
        );
        interval = this.getBurstInterval();
        this.state.burstRemaining--;
        isBurstInterval = true;
      } else if (Math.random() < this.config.slowdownProbability) {
        // Occasional slowdown
        interval = this.getSlowdownInterval();
      } else {
        // Normal interval with variance
        interval = this.getVariedInterval();
      }

      // Apply time-of-day multiplier (not during bursts)
      if (!isBurstInterval && this.config.timeOfDayEnabled) {
        interval *= getTimeOfDayMultiplier();
      }

      // Apply market condition multiplier (not during bursts)
      if (!isBurstInterval) {
        interval *= getMarketConditionMultiplier(volatilityScore);
      }

      // Prevent 3+ consistent intervals in a row (not during bursts)
      if (!isBurstInterval && this.state.lastInterval > 0) {
        if (areSimilarIntervals(interval, this.state.lastInterval)) {
          this.state.consistentCount++;
          
          if (this.state.consistentCount >= 2) {
            // Force a different interval (add or subtract 25-50% randomly)
            const adjustment = (0.25 + Math.random() * 0.25) * (Math.random() > 0.5 ? 1 : -1);
            interval *= (1 + adjustment);
            this.state.consistentCount = 0;
          }
        } else {
          this.state.consistentCount = 0;
        }
      }
    }

    // Update state (only track non-burst intervals for pattern prevention)
    if (!isBurstInterval) {
      this.state.lastInterval = interval;
    }
    this.state.lastTimestamp = Date.now();

    // Ensure minimum interval of 50ms
    return Math.max(50, Math.round(interval));
  }

  /**
   * Get interval with configured variance
   */
  private getVariedInterval(): number {
    const variance = this.config.variancePercent / 100;
    const minMultiplier = 1 - variance;
    const maxMultiplier = 1 + variance;
    const randomMultiplier = minMultiplier + Math.random() * (maxMultiplier - minMultiplier);
    
    return this.config.baseInterval * randomMultiplier;
  }

  /**
   * Get burst interval (rapid succession)
   */
  private getBurstInterval(): number {
    return (
      this.config.burstIntervalMin +
      Math.random() * (this.config.burstIntervalMax - this.config.burstIntervalMin)
    );
  }

  /**
   * Get slowdown interval
   */
  private getSlowdownInterval(): number {
    return this.getVariedInterval() * this.config.slowdownMultiplier;
  }

  /**
   * Check if currently in burst mode
   */
  isInBurst(): boolean {
    return this.state.inBurst;
  }

  /**
   * Reset state (useful for testing or when strategy changes)
   */
  reset(): void {
    this.state = {
      lastInterval: 0,
      consistentCount: 0,
      inBurst: false,
      burstRemaining: 0,
      lastTimestamp: Date.now(),
    };
  }

  /**
   * Update base interval (e.g., when strategy changes)
   */
  updateBaseInterval(newBaseInterval: number): void {
    this.config.baseInterval = newBaseInterval;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<TimingConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
    };
  }
}

/**
 * Create a timing manager instance with preset configurations
 */
export const createTimingManager = (
  baseInterval: number,
  options?: Partial<TimingConfig>
): TimingManager => {
  return new TimingManager({
    baseInterval,
    ...options,
  });
};
