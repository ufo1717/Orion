import type { Candle, ConnectionStatus } from '../types';

/**
 * Multi-Symbol Market Data Manager
 * Manages real-time data for multiple trading pairs simultaneously using Binance API
 */

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/stream';
const BINANCE_REST_URL = 'https://api.binance.com/api/v3';

interface BinanceKline {
  t: number; // Kline start time
  T: number; // Kline close time
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  c: string; // Close price
  v: string; // Volume
  x: boolean; // Is this kline closed?
}

interface BinanceKlineEvent {
  stream: string;
  data: {
    e: string; // Event type
    E: number; // Event time
    s: string; // Symbol
    k: BinanceKline;
  };
}

interface BinanceRestKline {
  0: number; // Open time
  1: string; // Open
  2: string; // High
  3: string; // Low
  4: string; // Close
  5: string; // Volume
  6: number; // Close time
}

interface SymbolData {
  candles: Candle[];
  currentPrice: number;
  lastUpdate: number;
}

export class MultiSymbolMarketDataManager {
  private ws: WebSocket | null = null;
  private symbols: string[];
  private interval: string;
  private symbolData: Map<string, SymbolData> = new Map();
  private onUpdate: (symbol: string, data: SymbolData) => void;
  private onStatusChange: (status: ConnectionStatus) => void;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimeout: number | null = null;
  private isIntentionallyClosed = false;

  constructor(
    symbols: string[],
    interval: string,
    onUpdate: (symbol: string, data: SymbolData) => void,
    onStatusChange: (status: ConnectionStatus) => void
  ) {
    this.symbols = symbols;
    this.interval = interval;
    this.onUpdate = onUpdate;
    this.onStatusChange = onStatusChange;
  }

  // Fetch historical candles for all symbols
  async fetchHistoricalData(limit: number = 100): Promise<void> {
    const promises = this.symbols.map(async (symbol) => {
      try {
        const url = `${BINANCE_REST_URL}/klines?symbol=${symbol}&interval=${this.interval}&limit=${limit}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error(`HTTP error for ${symbol}! status: ${response.status}`);
          return;
        }
        
        const data: BinanceRestKline[] = await response.json();
        
        const candles: Candle[] = data.map((kline) => ({
          openTime: kline[0],
          closeTime: kline[6],
          open: parseFloat(kline[1]),
          high: parseFloat(kline[2]),
          low: parseFloat(kline[3]),
          close: parseFloat(kline[4]),
          volume: parseFloat(kline[5]),
        }));

        const symbolData: SymbolData = {
          candles,
          currentPrice: candles[candles.length - 1]?.close || 0,
          lastUpdate: Date.now(),
        };

        this.symbolData.set(symbol, symbolData);
        this.onUpdate(symbol, symbolData);
      } catch (error) {
        console.error(`Error fetching historical candles for ${symbol}:`, error);
      }
    });

    await Promise.all(promises);
  }

  // Connect to Binance WebSocket for all symbols
  connect() {
    this.isIntentionallyClosed = false;
    this.onStatusChange('connecting');

    // Create stream names for all symbols
    const streams = this.symbols.map(
      (symbol) => `${symbol.toLowerCase()}@kline_${this.interval}`
    );
    
    // Combine streams for multi-stream WebSocket
    const streamParams = streams.join('/');
    const wsUrl = `${BINANCE_WS_URL}?streams=${streamParams}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log(`WebSocket connected to Binance for ${this.symbols.length} symbols`);
        this.reconnectAttempts = 0;
        this.onStatusChange('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const message: BinanceKlineEvent = JSON.parse(event.data);
          
          if (message.data && message.data.e === 'kline') {
            const kline = message.data.k;
            const symbol = message.data.s;
            
            const candle: Candle = {
              openTime: kline.t,
              closeTime: kline.T,
              open: parseFloat(kline.o),
              high: parseFloat(kline.h),
              low: parseFloat(kline.l),
              close: parseFloat(kline.c),
              volume: parseFloat(kline.v),
            };
            
            // Update or add candle to symbol data
            const existingData = this.symbolData.get(symbol);
            if (existingData) {
              const candles = [...existingData.candles];
              
              // Check if updating last candle or adding new one
              if (candles.length > 0 && candles[candles.length - 1].openTime === candle.openTime) {
                candles[candles.length - 1] = candle;
              } else {
                candles.push(candle);
              }
              
              // Keep last 200 candles
              const updatedCandles = candles.slice(-200);
              
              const updatedData: SymbolData = {
                candles: updatedCandles,
                currentPrice: candle.close,
                lastUpdate: Date.now(),
              };
              
              this.symbolData.set(symbol, updatedData);
              this.onUpdate(symbol, updatedData);
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onStatusChange('error');
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.onStatusChange('disconnected');
        
        if (!this.isIntentionallyClosed) {
          this.reconnect();
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.onStatusChange('error');
      this.reconnect();
    }
  }

  // Reconnect with exponential backoff
  private reconnect() {
    if (this.isIntentionallyClosed || this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached or intentionally closed');
      this.onStatusChange('error');
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Disconnect WebSocket
  disconnect() {
    this.isIntentionallyClosed = true;
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.onStatusChange('disconnected');
  }

  // Get data for a specific symbol
  getSymbolData(symbol: string): SymbolData | undefined {
    return this.symbolData.get(symbol);
  }

  // Get all symbol data
  getAllSymbolData(): Map<string, SymbolData> {
    return new Map(this.symbolData);
  }

  // Get current price for a symbol
  getCurrentPrice(symbol: string): number {
    return this.symbolData.get(symbol)?.currentPrice || 0;
  }
}
