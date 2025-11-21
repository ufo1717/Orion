import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Candle, ConnectionStatus, MarketDataConfig } from '../types';
import { MultiSymbolMarketDataManager } from '../data/multiSymbolMarketData';
import { ChartRotationManager, TRADING_PAIRS, type TradingPair } from '../utils/chartRotation';

interface SymbolData {
  candles: Candle[];
  currentPrice: number;
  lastUpdate: number;
}

interface MarketDataContextType {
  candles: Candle[];
  currentPrice: number;
  connectionStatus: ConnectionStatus;
  config: MarketDataConfig;
  updateConfig: (config: Partial<MarketDataConfig>) => void;
  currentPair: TradingPair;
  chartRotationEnabled: boolean;
  setChartRotationEnabled: (enabled: boolean) => void;
  getPriceForSymbol: (symbol: string) => number;
  getAllPrices: () => Map<string, number>;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export const MarketDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<MarketDataConfig>({
    timeframe: '1m',
  });
  
  const [candles, setCandles] = useState<Candle[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [chartRotationEnabled, setChartRotationEnabled] = useState<boolean>(true);
  const [currentPair, setCurrentPair] = useState<TradingPair>(TRADING_PAIRS[0]);
  
  const managerRef = useRef<MultiSymbolMarketDataManager | null>(null);
  const rotationManagerRef = useRef<ChartRotationManager | null>(null);
  const symbolDataRef = useRef<Map<string, SymbolData>>(new Map());

  // Handle updates from the multi-symbol manager
  const handleSymbolUpdate = useCallback((symbol: string, data: SymbolData) => {
    symbolDataRef.current.set(symbol, data);
    
    // If this is the currently displayed pair, update the UI
    setCurrentPair((currentPairValue) => {
      if (symbol === currentPairValue.symbol) {
        setCandles(data.candles);
        setCurrentPrice(data.currentPrice);
      }
      return currentPairValue;
    });
  }, []);

  // Initialize real-time data for all symbols
  useEffect(() => {
    const symbols = TRADING_PAIRS.map(pair => pair.symbol);
    
    const manager = new MultiSymbolMarketDataManager(
      symbols,
      config.timeframe,
      handleSymbolUpdate,
      setConnectionStatus
    );

    managerRef.current = manager;

    // Fetch historical data for all symbols first
    manager.fetchHistoricalData(100).then(() => {
      // Set initial data for the first pair
      const initialData = manager.getSymbolData(currentPair.symbol);
      if (initialData) {
        setCandles(initialData.candles);
        setCurrentPrice(initialData.currentPrice);
      }
      
      // Then connect to WebSocket for live updates
      manager.connect();
    });

    return () => {
      manager.disconnect();
      managerRef.current = null;
    };
  }, [config.timeframe, currentPair.symbol, handleSymbolUpdate]);

  // Initialize chart rotation
  useEffect(() => {
    if (!chartRotationEnabled) {
      if (rotationManagerRef.current) {
        rotationManagerRef.current.stop();
      }
      return;
    }

    const rotationManager = new ChartRotationManager((pair: TradingPair) => {
      setCurrentPair(pair);
      
      // Load the candles for this pair from the manager
      if (managerRef.current) {
        const pairData = managerRef.current.getSymbolData(pair.symbol);
        if (pairData && pairData.candles.length > 0) {
          setCandles(pairData.candles);
          setCurrentPrice(pairData.currentPrice);
        }
      }
    });

    rotationManagerRef.current = rotationManager;
    rotationManager.start();

    return () => {
      rotationManager.stop();
      rotationManagerRef.current = null;
    };
  }, [chartRotationEnabled]);

  // Update current pair display when pair changes
  useEffect(() => {
    if (managerRef.current) {
      const pairData = managerRef.current.getSymbolData(currentPair.symbol);
      if (pairData) {
        setCandles(pairData.candles);
        setCurrentPrice(pairData.currentPrice);
      }
    }
  }, [currentPair.symbol]);

  const updateConfig = (newConfig: Partial<MarketDataConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Get price for any symbol
  const getPriceForSymbol = (symbol: string): number => {
    if (managerRef.current) {
      return managerRef.current.getCurrentPrice(symbol);
    }
    return 0;
  };

  // Get all prices
  const getAllPrices = (): Map<string, number> => {
    const prices = new Map<string, number>();
    if (managerRef.current) {
      const allData = managerRef.current.getAllSymbolData();
      allData.forEach((data, symbol) => {
        prices.set(symbol, data.currentPrice);
      });
    }
    return prices;
  };

  return (
    <MarketDataContext.Provider
      value={{
        candles,
        currentPrice,
        connectionStatus,
        config,
        updateConfig,
        currentPair,
        chartRotationEnabled,
        setChartRotationEnabled,
        getPriceForSymbol,
        getAllPrices,
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
