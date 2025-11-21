import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { 
  createMarketRegimeManager, 
  type MarketRegime, 
  type MarketRegimeConfig 
} from '../utils/marketRegimeManager';

// Update intervals in milliseconds
const VOLATILITY_UPDATE_INTERVAL_MS = 30000; // 30 seconds
const TRANSITION_TIMER_UPDATE_INTERVAL_MS = 5000; // 5 seconds

interface MarketRegimeContextType {
  currentRegime: MarketRegime;
  regimeConfig: MarketRegimeConfig;
  volatilityScore: number;
  timeUntilNextTransition: number;
}

const MarketRegimeContext = createContext<MarketRegimeContextType | undefined>(undefined);

export const MarketRegimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Create singleton market regime manager
  const regimeManager = useMemo(() => createMarketRegimeManager('sideways'), []);
  
  const [currentRegime, setCurrentRegime] = useState<MarketRegime>(
    regimeManager.getCurrentRegime()
  );
  const [regimeConfig, setRegimeConfig] = useState<MarketRegimeConfig>(
    regimeManager.getCurrentConfig()
  );
  const [volatilityScore, setVolatilityScore] = useState(
    regimeManager.getCurrentConfig().volatilityScore
  );
  const [timeUntilNextTransition, setTimeUntilNextTransition] = useState(
    regimeManager.getTimeUntilNextTransition()
  );

  // Start market regime manager
  useEffect(() => {
    regimeManager.start((regime, config) => {
      setCurrentRegime(regime);
      setRegimeConfig(config);
      setVolatilityScore(config.volatilityScore);
      console.log(`[MarketRegime] Transitioned to: ${regime}`, {
        winRate: config.winRate,
        volatility: config.volatilityScore,
        activityMultiplier: config.activityMultiplier,
      });
    });
    
    return () => {
      regimeManager.stop();
    };
  }, [regimeManager]);

  // Update volatility score periodically (varies around regime's base)
  useEffect(() => {
    const updateVolatility = () => {
      // Vary volatility around the regime's base volatility (±0.15)
      const baseVolatility = regimeConfig.volatilityScore;
      const variance = 0.15;
      const newVolatility = Math.max(0, Math.min(1, 
        baseVolatility + (Math.random() - 0.5) * variance * 2
      ));
      setVolatilityScore(newVolatility);
    };
    
    const volatilityTimer = setInterval(updateVolatility, VOLATILITY_UPDATE_INTERVAL_MS);
    updateVolatility(); // Initial update
    
    return () => clearInterval(volatilityTimer);
  }, [regimeConfig]);

  // Update time until next transition periodically
  useEffect(() => {
    const updateTimer = () => {
      setTimeUntilNextTransition(regimeManager.getTimeUntilNextTransition());
    };
    
    const timerInterval = setInterval(updateTimer, TRANSITION_TIMER_UPDATE_INTERVAL_MS);
    updateTimer(); // Initial update
    
    return () => clearInterval(timerInterval);
  }, [regimeManager, currentRegime]); // Update when regime changes

  return (
    <MarketRegimeContext.Provider
      value={{
        currentRegime,
        regimeConfig,
        volatilityScore,
        timeUntilNextTransition,
      }}
    >
      {children}
    </MarketRegimeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMarketRegime = () => {
  const context = useContext(MarketRegimeContext);
  if (context === undefined) {
    throw new Error('useMarketRegime must be used within a MarketRegimeProvider');
  }
  return context;
};
