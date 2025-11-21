/**
 * Chart Rotation Manager
 * Manages rotation between different trading pairs for the chart display
 */

export interface TradingPair {
  symbol: string; // e.g., 'BTCUSDT'
  displayName: string; // e.g., 'BTC/USDT'
  basePrice: number; // Base price for simulation
}

export const TRADING_PAIRS: TradingPair[] = [
  { symbol: 'BTCUSDT', displayName: 'BTC/USDT', basePrice: 45000 },
  { symbol: 'ETHUSDT', displayName: 'ETH/USDT', basePrice: 2400 },
  { symbol: 'BNBUSDT', displayName: 'BNB/USDT', basePrice: 320 },
  { symbol: 'SOLUSDT', displayName: 'SOL/USDT', basePrice: 105 },
  { symbol: 'ADAUSDT', displayName: 'ADA/USDT', basePrice: 0.58 },
  { symbol: 'XRPUSDT', displayName: 'XRP/USDT', basePrice: 0.62 },
  { symbol: 'DOTUSDT', displayName: 'DOT/USDT', basePrice: 7.2 },
  { symbol: 'AVAXUSDT', displayName: 'AVAX/USDT', basePrice: 38 },
  { symbol: 'MATICUSDT', displayName: 'MATIC/USDT', basePrice: 0.88 },
  { symbol: 'LINKUSDT', displayName: 'LINK/USDT', basePrice: 15.5 },
];

export class ChartRotationManager {
  private currentIndex: number = 0;
  private rotationTimer: number | null = null;
  private onRotate: (pair: TradingPair) => void;
  private minInterval: number;
  private maxInterval: number;
  private isActive: boolean = false;

  constructor(
    onRotate: (pair: TradingPair) => void,
    minInterval: number = 8000,
    maxInterval: number = 15000
  ) {
    this.onRotate = onRotate;
    this.minInterval = minInterval;
    this.maxInterval = maxInterval;
  }

  /**
   * Start the rotation cycle
   */
  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    // Immediately show the first pair
    this.onRotate(TRADING_PAIRS[this.currentIndex]);
    this.scheduleNext();
  }

  /**
   * Stop the rotation cycle
   */
  stop() {
    this.isActive = false;
    if (this.rotationTimer !== null) {
      clearTimeout(this.rotationTimer);
      this.rotationTimer = null;
    }
  }

  /**
   * Get the current trading pair
   */
  getCurrentPair(): TradingPair {
    return TRADING_PAIRS[this.currentIndex];
  }

  /**
   * Manually rotate to the next pair (for activity bursts)
   */
  rotateNow() {
    if (!this.isActive) return;
    
    // Cancel the scheduled rotation
    if (this.rotationTimer !== null) {
      clearTimeout(this.rotationTimer);
      this.rotationTimer = null;
    }
    
    // Rotate immediately
    this.rotate();
  }

  /**
   * Schedule the next rotation with randomized timing
   */
  private scheduleNext() {
    if (!this.isActive) return;
    
    const interval = this.getRandomInterval();
    this.rotationTimer = setTimeout(() => {
      this.rotate();
    }, interval);
  }

  /**
   * Perform the rotation
   */
  private rotate() {
    if (!this.isActive) return;
    
    // Move to next pair
    this.currentIndex = (this.currentIndex + 1) % TRADING_PAIRS.length;
    
    // Notify callback
    this.onRotate(TRADING_PAIRS[this.currentIndex]);
    
    // Schedule next rotation
    this.scheduleNext();
  }

  /**
   * Get a random interval between min and max
   */
  private getRandomInterval(): number {
    return this.minInterval + Math.random() * (this.maxInterval - this.minInterval);
  }

  /**
   * Get all trading pairs
   */
  static getAllPairs(): TradingPair[] {
    return TRADING_PAIRS;
  }
}
