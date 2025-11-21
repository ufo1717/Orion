import type { Candle, ConnectionStatus } from '../types';

// Binance WebSocket endpoint
const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws';
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
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  k: BinanceKline;
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

export class MarketDataManager {
  private ws: WebSocket | null = null;
  private symbol: string;
  private interval: string;
  private onCandle: (candle: Candle) => void;
  private onStatusChange: (status: ConnectionStatus) => void;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimeout: number | null = null;
  private isIntentionallyClosed = false;

  constructor(
    symbol: string,
    interval: string,
    onCandle: (candle: Candle) => void,
    onStatusChange: (status: ConnectionStatus) => void
  ) {
    this.symbol = symbol;
    this.interval = interval;
    this.onCandle = onCandle;
    this.onStatusChange = onStatusChange;
  }

  // Fetch historical candles via REST API
  async fetchHistoricalCandles(limit: number = 100): Promise<Candle[]> {
    try {
      const url = `${BINANCE_REST_URL}/klines?symbol=${this.symbol}&interval=${this.interval}&limit=${limit}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: BinanceRestKline[] = await response.json();
      
      return data.map((kline) => ({
        openTime: kline[0],
        closeTime: kline[6],
        open: parseFloat(kline[1]),
        high: parseFloat(kline[2]),
        low: parseFloat(kline[3]),
        close: parseFloat(kline[4]),
        volume: parseFloat(kline[5]),
      }));
    } catch (error) {
      console.error('Error fetching historical candles:', error);
      return [];
    }
  }

  // Connect to Binance WebSocket
  connect() {
    this.isIntentionallyClosed = false;
    this.onStatusChange('connecting');

    const stream = `${this.symbol.toLowerCase()}@kline_${this.interval}`;
    const wsUrl = `${BINANCE_WS_URL}/${stream}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected to Binance');
        this.reconnectAttempts = 0;
        this.onStatusChange('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data: BinanceKlineEvent = JSON.parse(event.data);
          
          if (data.e === 'kline') {
            const kline = data.k;
            const candle: Candle = {
              openTime: kline.t,
              closeTime: kline.T,
              open: parseFloat(kline.o),
              high: parseFloat(kline.h),
              low: parseFloat(kline.l),
              close: parseFloat(kline.c),
              volume: parseFloat(kline.v),
            };
            
            this.onCandle(candle);
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

    // Clear any existing timeout
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

  // Update symbol and interval
  updateConfig(symbol: string, interval: string) {
    const needsReconnect = this.symbol !== symbol || this.interval !== interval;
    
    this.symbol = symbol;
    this.interval = interval;
    
    if (needsReconnect && this.ws) {
      this.disconnect();
      this.connect();
    }
  }
}

// Generate simulated candles for fallback mode
export function generateSimulatedCandle(previousCandle?: Candle, interval: number = 60000, defaultBasePrice: number = 45000): Candle {
  const now = Date.now();
  const basePrice = previousCandle?.close ?? defaultBasePrice;
  
  // Calculate the proper time for the new candle
  const openTime = previousCandle ? previousCandle.closeTime : now - interval;
  const closeTime = openTime + interval;
  
  // Random walk with slight upward bias
  const change = (Math.random() - 0.48) * basePrice * 0.001;
  const close = basePrice + change;
  
  // Generate OHLC with realistic relationships
  const volatility = Math.random() * basePrice * 0.0008;
  const high = Math.max(basePrice, close) + volatility;
  const low = Math.min(basePrice, close) - volatility;
  const open = basePrice;
  
  const volume = 10 + Math.random() * 50;
  
  return {
    openTime,
    closeTime,
    open,
    high,
    low,
    close,
    volume,
  };
}
