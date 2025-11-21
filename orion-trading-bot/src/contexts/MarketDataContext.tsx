import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Candle, ConnectionStatus, DataMode, MarketDataConfig } from '../types';
import { MarketDataManager, generateSimulatedCandle } from '../data/marketData';
import { ChartRotationManager, TRADING_PAIRS, type TradingPair } from '../utils/chartRotation';

interface MarketDataContextType {
  candles: Candle[];
  currentPrice: number;
  connectionStatus: ConnectionStatus;
  config: MarketDataConfig;
  updateConfig: (config: Partial<MarketDataConfig>) => void;
  setDataMode: (mode: DataMode) => void;
  currentPair: TradingPair;
  chartRotationEnabled: boolean;
  setChartRotationEnabled: (enabled: boolean) => void;
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
  const [chartRotationEnabled, setChartRotationEnabled] = useState<boolean>(true);
  const [currentPair, setCurrentPair] = useState<TradingPair>(TRADING_PAIRS[0]);
  
  const managerRef = useRef<MarketDataManager | null>(null);
  const simulationIntervalRef = useRef<number | null>(null);
  const rotationManagerRef = useRef<ChartRotationManager | null>(null);
  const candleDataBySymbol = useRef<Map<string, Candle[]>>(new Map());

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

  // Initialize simulated data mode with chart rotation
  useEffect(() => {
    if (config.mode !== 'simulated') return;

    const intervalMs = config.timeframe === '1m' ? 60000 : 
                       config.timeframe === '5m' ? 300000 : 60000;
    
    // Initialize data for all pairs
    const initializePairData = (pair: TradingPair) => {
      const initialCandles: Candle[] = [];
      let lastCandle: Candle | undefined;
      
      // Generate historical candles with proper time spacing
      for (let i = 0; i < 100; i++) {
        const candle = generateSimulatedCandle(lastCandle, intervalMs, pair.basePrice);
        initialCandles.push(candle);
        lastCandle = candle;
      }
      
      candleDataBySymbol.current.set(pair.symbol, initialCandles);
      return lastCandle;
    };

    // Initialize all pairs
    const lastCandles = new Map<string, Candle>();
    TRADING_PAIRS.forEach(pair => {
      const lastCandle = initializePairData(pair);
      if (lastCandle) {
        lastCandles.set(pair.symbol, lastCandle);
      }
    });

    // Set initial state for the first pair
    const initialPairData = candleDataBySymbol.current.get(currentPair.symbol);
    if (initialPairData) {
      setCandles(initialPairData);
      setCurrentPrice(initialPairData[initialPairData.length - 1].close);
      setConnectionStatus('connected');
    }

    // Continue generating candles for all pairs
    simulationIntervalRef.current = setInterval(() => {
      TRADING_PAIRS.forEach(pair => {
        const lastCandle = lastCandles.get(pair.symbol);
        const newCandle = generateSimulatedCandle(lastCandle, intervalMs, pair.basePrice);
        lastCandles.set(pair.symbol, newCandle);
        
        // Update the stored data for this pair
        const existingData = candleDataBySymbol.current.get(pair.symbol) || [];
        const updatedData = [...existingData, newCandle].slice(-200); // Keep last 200
        candleDataBySymbol.current.set(pair.symbol, updatedData);
        
        // If this is the currently displayed pair, update the UI
        if (pair.symbol === currentPair.symbol) {
          setCandles(updatedData);
          setCurrentPrice(newCandle.close);
        }
      });
    }, intervalMs);

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
    };
  }, [config.mode, config.timeframe, currentPair.symbol]);

  // Initialize chart rotation
  useEffect(() => {
    if (config.mode !== 'simulated' || !chartRotationEnabled) {
      // Stop rotation if it's running
      if (rotationManagerRef.current) {
        rotationManagerRef.current.stop();
      }
      return;
    }

    // Create rotation manager
    const rotationManager = new ChartRotationManager((pair: TradingPair) => {
      setCurrentPair(pair);
      
      // Load the candles for this pair
      const pairData = candleDataBySymbol.current.get(pair.symbol);
      if (pairData && pairData.length > 0) {
        setCandles(pairData);
        setCurrentPrice(pairData[pairData.length - 1].close);
      }
    });

    rotationManagerRef.current = rotationManager;
    rotationManager.start();

    return () => {
      rotationManager.stop();
      rotationManagerRef.current = null;
    };
  }, [config.mode, chartRotationEnabled]);

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
        currentPair,
        chartRotationEnabled,
        setChartRotationEnabled,
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
