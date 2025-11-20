import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { STRATEGIES } from '../utils/strategies';
import type { TradeLog } from '../types';

const TRADING_PAIRS = [
  'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'ADA/USDT',
  'XRP/USDT', 'DOT/USDT', 'AVAX/USDT', 'MATIC/USDT', 'LINK/USDT'
];

const LOG_MESSAGES = [
  (pair: string) => `Scanning ${pair} pair... Volatility detected`,
  (pair: string) => `Arbitrage opportunity detected on ${pair} (0.04s window)`,
  (pair: string) => `EXECUTING BUY order for ${pair}`,
  (pair: string) => `EXECUTING SELL order for ${pair}`,
  (pair: string) => `Order filled on ${pair} - Profit locked`,
  (pair: string) => `Analyzing ${pair} trend patterns...`,
  (pair: string) => `${pair} support level identified at current price`,
  (pair: string) => `${pair} resistance breakthrough detected`,
  (pair: string) => `Hedging parameters adjusted for ${pair}`,
  (pair: string) => `Stop-loss triggered on ${pair} position`,
];

const ActiveLogs: React.FC = () => {
  const { userProfile } = useApp();
  const [logs, setLogs] = useState<TradeLog[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    if (!userProfile.activeStrategy) return;

    const strategy = STRATEGIES[userProfile.activeStrategy];
    const interval = strategy.speed === 'fast' ? 800 : strategy.speed === 'medium' ? 1500 : 3000;

    const generateLog = () => {
      const pair = TRADING_PAIRS[Math.floor(Math.random() * TRADING_PAIRS.length)];
      const message = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)](pair);
      
      const newLog: TradeLog = {
        id: Date.now().toString() + Math.random(),
        timestamp: new Date(),
        pair,
        action: message.includes('BUY') ? 'BUY' : message.includes('SELL') ? 'SELL' : message.includes('EXECUTING') ? 'EXECUTE' : 'SCAN',
        message,
        profit: Math.random() > 0.7 ? parseFloat((Math.random() * 150).toFixed(2)) : undefined,
      };

      setLogs((prev) => {
        const updated = [...prev, newLog];
        return updated.slice(-50); // Keep only last 50 logs
      });
    };

    // Generate initial logs
    for (let i = 0; i < 5; i++) {
      setTimeout(generateLog, i * 200);
    }

    // Continue generating logs
    const timer = setInterval(generateLog, interval);

    return () => clearInterval(timer);
  }, [userProfile.activeStrategy]);

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
              <span className="text-purple-400">[AURA-BOT]:</span>{' '}
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
