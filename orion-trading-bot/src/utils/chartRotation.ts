/**
 * Chart Rotation Manager
 * Manages rotation between different trading pairs for the chart display
 */

export interface TradingPair {
  symbol: string; // e.g., 'BTCUSDT'
  displayName: string; // e.g., 'BTC/USDT'
}

// 35 major, mid-cap, and trending crypto trading pairs
// All data is sourced from live Binance API
export const TRADING_PAIRS: TradingPair[] = [
  // Top 10 by market cap
  { symbol: 'BTCUSDT', displayName: 'BTC/USDT' },
  { symbol: 'ETHUSDT', displayName: 'ETH/USDT' },
  { symbol: 'BNBUSDT', displayName: 'BNB/USDT' },
  { symbol: 'SOLUSDT', displayName: 'SOL/USDT' },
  { symbol: 'XRPUSDT', displayName: 'XRP/USDT' },
  { symbol: 'ADAUSDT', displayName: 'ADA/USDT' },
  { symbol: 'AVAXUSDT', displayName: 'AVAX/USDT' },
  { symbol: 'DOTUSDT', displayName: 'DOT/USDT' },
  { symbol: 'MATICUSDT', displayName: 'MATIC/USDT' },
  { symbol: 'LINKUSDT', displayName: 'LINK/USDT' },
  
  // Major DeFi and Layer 1s
  { symbol: 'UNIUSDT', displayName: 'UNI/USDT' },
  { symbol: 'LTCUSDT', displayName: 'LTC/USDT' },
  { symbol: 'ATOMUSDT', displayName: 'ATOM/USDT' },
  { symbol: 'ETCUSDT', displayName: 'ETC/USDT' },
  { symbol: 'XLMUSDT', displayName: 'XLM/USDT' },
  { symbol: 'NEARUSDT', displayName: 'NEAR/USDT' },
  { symbol: 'ALGOUSDT', displayName: 'ALGO/USDT' },
  { symbol: 'VETUSDT', displayName: 'VET/USDT' },
  { symbol: 'ICPUSDT', displayName: 'ICP/USDT' },
  { symbol: 'FILUSDT', displayName: 'FIL/USDT' },
  
  // Trending and mid-caps
  { symbol: 'APTUSDT', displayName: 'APT/USDT' },
  { symbol: 'ARBUSDT', displayName: 'ARB/USDT' },
  { symbol: 'OPUSDT', displayName: 'OP/USDT' },
  { symbol: 'INJUSDT', displayName: 'INJ/USDT' },
  { symbol: 'SUIUSDT', displayName: 'SUI/USDT' },
  { symbol: 'LDOUSDT', displayName: 'LDO/USDT' },
  { symbol: 'AAVEUSDT', displayName: 'AAVE/USDT' },
  { symbol: 'MKRUSDT', displayName: 'MKR/USDT' },
  { symbol: 'GRTUSDT', displayName: 'GRT/USDT' },
  { symbol: 'SUSHIUSDT', displayName: 'SUSHI/USDT' },
  
  // Additional liquid pairs
  { symbol: 'FTMUSDT', displayName: 'FTM/USDT' },
  { symbol: 'SANDUSDT', displayName: 'SAND/USDT' },
  { symbol: 'MANAUSDT', displayName: 'MANA/USDT' },
  { symbol: 'AXSUSDT', displayName: 'AXS/USDT' },
  { symbol: 'THETAUSDT', displayName: 'THETA/USDT' },
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
