/**
 * Chart Rotation Manager
 * Manages rotation between different trading pairs for the chart display
 */

export interface TradingPair {
  symbol: string; // e.g., 'BTCUSDT'
  displayName: string; // e.g., 'BTC/USDT'
  basePrice: number; // Base price for simulation
}

// 30+ major, mid-cap, and trending crypto trading pairs
// basePrice field removed as all data is now sourced from live APIs
export const TRADING_PAIRS: TradingPair[] = [
  // Top 10 by market cap
  { symbol: 'BTCUSDT', displayName: 'BTC/USDT', basePrice: 0 },
  { symbol: 'ETHUSDT', displayName: 'ETH/USDT', basePrice: 0 },
  { symbol: 'BNBUSDT', displayName: 'BNB/USDT', basePrice: 0 },
  { symbol: 'SOLUSDT', displayName: 'SOL/USDT', basePrice: 0 },
  { symbol: 'XRPUSDT', displayName: 'XRP/USDT', basePrice: 0 },
  { symbol: 'ADAUSDT', displayName: 'ADA/USDT', basePrice: 0 },
  { symbol: 'AVAXUSDT', displayName: 'AVAX/USDT', basePrice: 0 },
  { symbol: 'DOTUSDT', displayName: 'DOT/USDT', basePrice: 0 },
  { symbol: 'MATICUSDT', displayName: 'MATIC/USDT', basePrice: 0 },
  { symbol: 'LINKUSDT', displayName: 'LINK/USDT', basePrice: 0 },
  
  // Major DeFi and Layer 1s
  { symbol: 'UNIUSDT', displayName: 'UNI/USDT', basePrice: 0 },
  { symbol: 'LTCUSDT', displayName: 'LTC/USDT', basePrice: 0 },
  { symbol: 'ATOMUSDT', displayName: 'ATOM/USDT', basePrice: 0 },
  { symbol: 'ETCUSDT', displayName: 'ETC/USDT', basePrice: 0 },
  { symbol: 'XLMUSDT', displayName: 'XLM/USDT', basePrice: 0 },
  { symbol: 'NEARUSDT', displayName: 'NEAR/USDT', basePrice: 0 },
  { symbol: 'ALGOUSDT', displayName: 'ALGO/USDT', basePrice: 0 },
  { symbol: 'VETUSDT', displayName: 'VET/USDT', basePrice: 0 },
  { symbol: 'ICPUSDT', displayName: 'ICP/USDT', basePrice: 0 },
  { symbol: 'FILUSDT', displayName: 'FIL/USDT', basePrice: 0 },
  
  // Trending and mid-caps
  { symbol: 'APTUSDT', displayName: 'APT/USDT', basePrice: 0 },
  { symbol: 'ARBUSDT', displayName: 'ARB/USDT', basePrice: 0 },
  { symbol: 'OPUSDT', displayName: 'OP/USDT', basePrice: 0 },
  { symbol: 'INJUSDT', displayName: 'INJ/USDT', basePrice: 0 },
  { symbol: 'SUIUSDT', displayName: 'SUI/USDT', basePrice: 0 },
  { symbol: 'LDOUSDT', displayName: 'LDO/USDT', basePrice: 0 },
  { symbol: 'AAVEUSDT', displayName: 'AAVE/USDT', basePrice: 0 },
  { symbol: 'MKRUSDT', displayName: 'MKR/USDT', basePrice: 0 },
  { symbol: 'GRTUSDT', displayName: 'GRT/USDT', basePrice: 0 },
  { symbol: 'SUSHIUSDT', displayName: 'SUSHI/USDT', basePrice: 0 },
  
  // Additional liquid pairs
  { symbol: 'FTMUSDT', displayName: 'FTM/USDT', basePrice: 0 },
  { symbol: 'SANDUSDT', displayName: 'SAND/USDT', basePrice: 0 },
  { symbol: 'MANAUSDT', displayName: 'MANA/USDT', basePrice: 0 },
  { symbol: 'AXSUSDT', displayName: 'AXS/USDT', basePrice: 0 },
  { symbol: 'THETAUSDT', displayName: 'THETA/USDT', basePrice: 0 },
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
