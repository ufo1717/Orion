import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { useMarketData } from '../contexts/MarketDataContext';
import { STRATEGIES } from '../utils/strategies';
import type { TradeLog } from '../types';
import {
  ALL_MESSAGE_TEMPLATES,
  MessageTracker,
  getTimeOfDay,
  getMarketCondition,
  filterMessagesByConditions,
  selectWeightedRandom,
  type MarketRegime,
} from '../data/messageTemplates';
import { createTimingManager } from '../utils/timingManager';
import { createMarketRegimeManager, type MarketRegimeConfig } from '../utils/marketRegimeManager';

const TRADING_PAIRS = [
  'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT',
  'XRP/USDT', 'DOT/USDT', 'AVAX/USDT', 'MATIC/USDT', 'LINK/USDT'
];

const ActiveLogs: React.FC = () => {
  const { userProfile } = useApp();
  const { currentPrice, config } = useMarketData();
  const [logs, setLogs] = useState<TradeLog[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  // Create message tracker instance that persists across renders
  const messageTracker = useMemo(() => new MessageTracker(20), []);
  
  // Create market regime manager instance
  const regimeManager = useMemo(() => createMarketRegimeManager('sideways'), []);
  
  // Track current market regime and config
  const [currentRegime, setCurrentRegime] = useState<MarketRegime>('sideways');
  const [regimeConfig, setRegimeConfig] = useState<MarketRegimeConfig>(
    regimeManager.getCurrentConfig()
  );
  
  // Track volatility for market condition (now influenced by regime)
  const [volatilityScore, setVolatilityScore] = useState(0.5);
  
  // Create timing manager instance that persists across renders
  const timingManagerRef = useRef(createTimingManager(1000, {
    variancePercent: 35, // Slightly higher than default 30% for more organic feel
    burstProbability: 0.18, // 18% chance of bursts
    burstMinCount: 2,
    burstMaxCount: 6,
    slowdownProbability: 0.12, // 12% chance of slowdowns
  }));

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);
  
  // Start market regime manager
  useEffect(() => {
    regimeManager.start((regime, config) => {
      setCurrentRegime(regime);
      setRegimeConfig(config);
      setVolatilityScore(config.volatilityScore);
      console.log(`Market regime changed to: ${regime}`, config);
    });
    
    return () => {
      regimeManager.stop();
    };
  }, [regimeManager]);
  
  // Update volatility score periodically (within regime bounds)
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
    
    const volatilityTimer = setInterval(updateVolatility, 30000); // Update every 30 seconds
    return () => clearInterval(volatilityTimer);
  }, [regimeConfig]);

  useEffect(() => {
    if (!userProfile.activeStrategy) return;

    const strategy = STRATEGIES[userProfile.activeStrategy];
    const baseInterval = strategy.speed === 'fast' ? 800 : strategy.speed === 'medium' ? 1500 : 3000;
    
    // Apply regime activity multiplier to base interval
    const regimeAdjustedInterval = baseInterval / regimeConfig.activityMultiplier;
    
    // Update timing manager with regime-adjusted interval
    timingManagerRef.current.updateBaseInterval(regimeAdjustedInterval);
    
    let timeoutId: ReturnType<typeof setTimeout>;

    const generateLog = () => {
      const pair = TRADING_PAIRS[Math.floor(Math.random() * TRADING_PAIRS.length)];
      const useRealPrice = pair === config.symbol.replace('USDT', '/USDT') && currentPrice > 0;
      const price = useRealPrice ? currentPrice : undefined;
      
      // Get current time and market conditions (regime-aware)
      const timeOfDay = getTimeOfDay();
      const marketCondition = getMarketCondition(volatilityScore, currentRegime);
      
      // Filter messages based on conditions including regime
      const availableMessages = filterMessagesByConditions(
        ALL_MESSAGE_TEMPLATES,
        timeOfDay,
        marketCondition,
        currentRegime
      );
      
      // Try to find a non-repeated message
      let selectedTemplate = selectWeightedRandom(availableMessages);
      let message = selectedTemplate.generator(pair, price);
      let attempts = 0;
      const maxAttempts = 10;
      
      // Try to avoid recently used messages
      while (messageTracker.isRecentlyUsed(message) && attempts < maxAttempts) {
        selectedTemplate = selectWeightedRandom(availableMessages);
        message = selectedTemplate.generator(pair, price);
        attempts++;
      }
      
      // Track the message
      messageTracker.addMessage(message);
      
      // Determine if this trade is a win based on regime win rate
      const isWin = Math.random() < regimeConfig.winRate;
      const hasProfit = Math.random() > 0.65; // 35% of trades show profit
      
      const newLog: TradeLog = {
        id: Date.now().toString() + Math.random(),
        timestamp: new Date(),
        pair,
        action: message.includes('BUY') ? 'BUY' : message.includes('SELL') ? 'SELL' : message.includes('EXECUTING') ? 'EXECUTE' : 'SCAN',
        message,
        profit: (hasProfit && isWin) ? parseFloat((Math.random() * 150).toFixed(2)) : undefined,
      };

      setLogs((prev) => {
        const updated = [...prev, newLog];
        return updated.slice(-50); // Keep only last 50 logs
      });
      
      // Schedule next log with randomized interval (includes regime multiplier via base interval)
      const nextInterval = timingManagerRef.current.getNextInterval(volatilityScore);
      timeoutId = setTimeout(generateLog, nextInterval);
    };

    // Generate initial logs with varied delays
    for (let i = 0; i < 5; i++) {
      setTimeout(generateLog, i * (200 + Math.random() * 100));
    }

    // Start the continuous log generation
    const firstInterval = timingManagerRef.current.getNextInterval(volatilityScore);
    timeoutId = setTimeout(generateLog, firstInterval);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [userProfile.activeStrategy, currentPrice, config.symbol, messageTracker, volatilityScore, currentRegime, regimeConfig]);

  const getLogColor = (action: string) => {
    switch (action) {
      case 'BUY':
        return 'text-green-400';
      case 'SELL':
        return 'text-red-400';
      case 'EXECUTE':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card h-[600px] flex flex-col"
    >
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
          Real-Time Execution
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 font-mono text-xs space-y-2">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`${getLogColor(log.action)} leading-relaxed`}
            >
              <span className="text-gray-500">
                [{log.timestamp.toLocaleTimeString()}]
              </span>{' '}
              <span className="text-purple-400">[ORION-BOT]:</span>{' '}
              {log.message}
              {log.profit && (
                <span className="text-green-500 ml-2">
                  +${log.profit.toFixed(2)}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={logsEndRef} />
      </div>
    </motion.div>
  );
};

export default ActiveLogs;
