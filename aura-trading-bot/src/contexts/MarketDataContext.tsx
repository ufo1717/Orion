import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Candle, ConnectionStatus, DataMode, MarketDataConfig } from '../types';
import { MarketDataManager, generateSimulatedCandle } from '../data/marketData';

interface MarketDataContextType {
  candles: Candle[];
  currentPrice: number;
  connectionStatus: ConnectionStatus;
  config: MarketDataConfig;
  updateConfig: (config: Partial<MarketDataConfig>) => void;
  setDataMode: (mode: DataMode) => void;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

// Read environment variable for default mode
const getDefaultMode = (): DataMode => {
  const envMode = import.meta.env.VITE_USE_REAL_DATA;
  if (envMode === 'true' || envMode === '1') {
    return 'real';
  }
  return 'simulated';
};

export const MarketDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<MarketDataConfig>({
    symbol: 'BTCUSDT',
    timeframe: '1m',
    mode: getDefaultMode(),
  });
  
  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  
  const managerRef = useRef<MarketDataManager | null>(null);
  const simulationIntervalRef = useRef<number | null>(null);

  // Handle incoming candles from WebSocket or simulation
  const handleNewCandle = (candle: Candle) => {
    setCandles((prev) => {
      const updated = [...prev];
      
      // Check if we're updating the last candle or adding a new one
      if (updated.length > 0) {
        const lastCandle = updated[updated.length - 1];
        // If the candle is for the same time period, update it
        if (lastCandle.openTime === candle.openTime) {
          updated[updated.length - 1] = candle;
        } else {
          updated.push(candle);
        }
      } else {
        updated.push(candle);
      }
      
      // Keep last 200 candles
      return updated.slice(-200);
    });
    
    setCurrentPrice(candle.close);
  };

  // Initialize real data mode
  useEffect(() => {
    if (config.mode !== 'real') return;

    const manager = new MarketDataManager(
      config.symbol,
      config.timeframe,
      handleNewCandle,
      setConnectionStatus
    );

    managerRef.current = manager;

    // Fetch historical data first
    manager.fetchHistoricalCandles(100).then((historicalCandles) => {
      if (historicalCandles.length > 0) {
        setCandles(historicalCandles);
        setCurrentPrice(historicalCandles[historicalCandles.length - 1].close);
      }
      // Then connect to WebSocket for live updates
      manager.connect();
    });

    return () => {
      manager.disconnect();
      managerRef.current = null;
    };
  }, [config.mode, config.symbol, config.timeframe]);

  // Initialize simulated data mode
  useEffect(() => {
    if (config.mode !== 'simulated') return;

    // Generate initial candles
    const initialCandles: Candle[] = [];
    let lastCandle: Candle | undefined;
    
    for (let i = 0; i < 100; i++) {
      const candle = generateSimulatedCandle(lastCandle);
      initialCandles.push(candle);
      lastCandle = candle;
    }
    
    // Batch all state updates together
    Promise.resolve().then(() => {
      setCandles(initialCandles);
      setCurrentPrice(initialCandles[initialCandles.length - 1].close);
      setConnectionStatus('connected');
    });

    // Continue generating candles
    const intervalMs = config.timeframe === '1m' ? 60000 : 
                       config.timeframe === '5m' ? 300000 : 60000;
    
    simulationIntervalRef.current = setInterval(() => {
      const newCandle = generateSimulatedCandle(lastCandle);
      lastCandle = newCandle;
      handleNewCandle(newCandle);
    }, intervalMs);

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
    };
  }, [config.mode, config.timeframe]);

  const updateConfig = (newConfig: Partial<MarketDataConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const setDataMode = (mode: DataMode) => {
    updateConfig({ mode });
  };

  return (
    <MarketDataContext.Provider
      value={{
        candles,
        currentPrice,
        connectionStatus,
        config,
        updateConfig,
        setDataMode,
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
};
