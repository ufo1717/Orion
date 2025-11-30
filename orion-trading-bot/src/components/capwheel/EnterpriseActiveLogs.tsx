// Enterprise Active Logs Component
// Institutional-grade execution log with CapWheel branding

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMarketData } from '../../contexts/MarketDataContext';
import { useMarketRegime } from '../../contexts/MarketRegimeContext';
import { useCapWheel } from '../../contexts/CapWheelContext';
import { TRADING_PAIRS } from '../../utils/chartRotation';

interface EnterpriseLog {
  id: string;
  timestamp: Date;
  type: 'TRADE' | 'HEDGE' | 'REBALANCE' | 'ALERT' | 'SYSTEM';
  action: 'BUY' | 'SELL' | 'EXECUTE' | 'ADJUST' | 'INFO';
  asset: string;
  message: string;
  profit?: number;
  hedgeRelated?: boolean;
  expanded?: boolean;
  details?: {
    price?: number;
    quantity?: number;
    slippage?: number;
    fees?: number;
    executionTime?: number;
  };
}

const EnterpriseActiveLogs: React.FC = () => {
  const { getPriceForSymbol } = useMarketData();
  const { currentRegime, regimeConfig, volatilityScore } = useMarketRegime();
  const { hedgeMetrics, portfolioMetrics } = useCapWheel();
  const [logs, setLogs] = useState<EnterpriseLog[]>([]);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'ALL' | 'TRADE' | 'HEDGE' | 'SYSTEM'>('ALL');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Enterprise message templates
  const enterpriseMessages = useMemo(() => ({
    TRADE: [
      (asset: string, price: number) => `Executing long position on ${asset} at $${price.toFixed(2)}`,
      (asset: string, price: number) => `Opening short hedge on ${asset} @ ${price.toFixed(2)}`,
      (asset: string, price: number) => `Smart order routing: ${asset} filled at $${price.toFixed(2)}`,
      (asset: string, price: number) => `Position scaling: Added to ${asset} position @ ${price.toFixed(2)}`,
      (asset: string, price: number) => `Take profit triggered: ${asset} closed at $${price.toFixed(2)}`,
      (asset: string, price: number) => `Stop loss executed: ${asset} @ ${price.toFixed(2)}`,
      (asset: string, price: number) => `TWAP execution: ${asset} tranche at $${price.toFixed(2)}`,
      (asset: string, price: number) => `Arbitrage opportunity: ${asset} spread at ${price.toFixed(2)}`,
    ],
    HEDGE: [
      () => `RWA rebalance: Adjusting T-Bills allocation`,
      () => `Hedge efficiency optimized to ${hedgeMetrics.efficiency.toFixed(1)}%`,
      () => `Correlation hedge: Increasing gold position`,
      () => `Volatility protection: RWA buffer increased`,
      () => `Auto-hedge: Real Estate tokenized position adjusted`,
      () => `Risk mitigation: Corporate bonds allocation updated`,
      () => `Hedge trigger: Portfolio delta-neutral adjustment`,
    ],
    SYSTEM: [
      () => `Market regime detected: ${currentRegime.toUpperCase()}`,
      () => `Volatility spike: ${(volatilityScore * 100).toFixed(1)}% - Adjusting exposure`,
      () => `Portfolio sync: All positions reconciled`,
      () => `Risk metrics: Sharpe ratio at ${portfolioMetrics.sharpeRatio.toFixed(2)}`,
      () => `Win rate update: ${portfolioMetrics.winRate.toFixed(1)}% over last 100 trades`,
      () => `Multi-desk sync: All desks aligned`,
    ],
  }), [currentRegime, volatilityScore, hedgeMetrics.efficiency, portfolioMetrics.sharpeRatio, portfolioMetrics.winRate]);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // Generate enterprise logs
  useEffect(() => {
    const baseInterval = 1500;
    const regimeAdjustedInterval = baseInterval / regimeConfig.activityMultiplier;
    
    let timeoutId: ReturnType<typeof setTimeout>;

    const generateLog = () => {
      const pairIndex = Math.floor(Math.random() * TRADING_PAIRS.length);
      const tradingPair = TRADING_PAIRS[pairIndex];
      const price = getPriceForSymbol(tradingPair.symbol);
      
      // Determine log type based on weighted random
      const rand = Math.random();
      let logType: 'TRADE' | 'HEDGE' | 'SYSTEM';
      if (rand < 0.6) {
        logType = 'TRADE';
      } else if (rand < 0.85) {
        logType = 'HEDGE';
      } else {
        logType = 'SYSTEM';
      }

      const messages = enterpriseMessages[logType];
      const messageGenerator = messages[Math.floor(Math.random() * messages.length)];
      const message = logType === 'TRADE' 
        ? messageGenerator(tradingPair.displayName, price)
        : messageGenerator(tradingPair.displayName, price);

      // Determine action based on message content
      let action: EnterpriseLog['action'] = 'INFO';
      if (message.toLowerCase().includes('buy') || message.toLowerCase().includes('long')) {
        action = 'BUY';
      } else if (message.toLowerCase().includes('sell') || message.toLowerCase().includes('short') || message.toLowerCase().includes('closed')) {
        action = 'SELL';
      } else if (message.toLowerCase().includes('execut') || message.toLowerCase().includes('filled')) {
        action = 'EXECUTE';
      } else if (message.toLowerCase().includes('adjust') || message.toLowerCase().includes('rebalance')) {
        action = 'ADJUST';
      }

      // Calculate potential profit
      const isWin = Math.random() < regimeConfig.winRate;
      const hasProfit = logType === 'TRADE' && Math.random() > 0.5;
      const profit = hasProfit && isWin ? parseFloat((Math.random() * 500 + 50).toFixed(2)) : undefined;

      const newLog: EnterpriseLog = {
        id: Date.now().toString() + Math.random(),
        timestamp: new Date(),
        type: logType,
        action,
        asset: tradingPair.displayName,
        message,
        profit,
        hedgeRelated: logType === 'HEDGE',
        details: logType === 'TRADE' ? {
          price: price || undefined,
          quantity: parseFloat((Math.random() * 10 + 0.1).toFixed(4)),
          slippage: parseFloat((Math.random() * 0.05).toFixed(4)),
          fees: parseFloat((Math.random() * 5).toFixed(2)),
          executionTime: Math.floor(Math.random() * 50 + 10),
        } : undefined,
      };

      setLogs((prev) => {
        const updated = [...prev, newLog];
        return updated.slice(-100); // Keep last 100 logs
      });

      // Schedule next log
      const variance = 0.3;
      const nextInterval = regimeAdjustedInterval * (1 + (Math.random() - 0.5) * variance * 2);
      timeoutId = setTimeout(generateLog, nextInterval);
    };

    // Generate initial logs
    for (let i = 0; i < 5; i++) {
      setTimeout(generateLog, i * 300);
    }

    // Start continuous generation
    timeoutId = setTimeout(generateLog, regimeAdjustedInterval);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [getPriceForSymbol, regimeConfig, enterpriseMessages]);

  const toggleExpand = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const getLogColor = (log: EnterpriseLog) => {
    if (log.type === 'HEDGE') return 'text-capwheel-gold';
    if (log.type === 'SYSTEM') return 'text-capwheel-electric';
    
    switch (log.action) {
      case 'BUY':
        return 'text-capwheel-profit';
      case 'SELL':
        return 'text-capwheel-loss';
      case 'EXECUTE':
        return 'text-capwheel-electric';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: EnterpriseLog['type']) => {
    switch (type) {
      case 'TRADE': return '📈';
      case 'HEDGE': return '🛡️';
      case 'REBALANCE': return '⚖️';
      case 'ALERT': return '🔔';
      case 'SYSTEM': return '⚡';
      default: return '📋';
    }
  };

  const filteredLogs = filter === 'ALL' 
    ? logs 
    : logs.filter(log => log.type === filter);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="capwheel-card h-[600px] flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-capwheel-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center text-white">
            <span className="w-2 h-2 bg-capwheel-gold rounded-full mr-2 animate-pulse" />
            Enterprise Execution Log
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">Export</span>
            <button className="capwheel-card p-1.5 hover:border-capwheel-gold/50 transition-colors" title="Export Logs">
              <svg className="w-4 h-4 text-capwheel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['ALL', 'TRADE', 'HEDGE', 'SYSTEM'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                filter === f
                  ? 'bg-capwheel-gold/20 text-capwheel-gold border border-capwheel-gold/30'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Container */}
      <div className="flex-1 overflow-y-auto capwheel-scrollbar p-4 font-mono text-xs space-y-1">
        <AnimatePresence initial={false}>
          {filteredLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`${getLogColor(log)} leading-relaxed`}
            >
              <div 
                className="flex items-start gap-2 cursor-pointer hover:bg-capwheel-navy/30 rounded p-1 -m-1"
                onClick={() => log.details && toggleExpand(log.id)}
              >
                <span className="text-gray-500 whitespace-nowrap">
                  [{log.timestamp.toLocaleTimeString()}]
                </span>
                <span>{getTypeIcon(log.type)}</span>
                <span className="text-capwheel-gold font-semibold">[CAPWHEEL]:</span>
                <span className="flex-1">{log.message}</span>
                {log.profit && (
                  <span className="text-capwheel-profit font-semibold">
                    +${log.profit.toFixed(2)}
                  </span>
                )}
                {log.details && (
                  <span className="text-gray-500">{expandedLogs.has(log.id) ? '▼' : '▶'}</span>
                )}
              </div>
              
              {/* Expanded Details */}
              {log.details && expandedLogs.has(log.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-6 mt-1 p-2 bg-capwheel-navy/50 rounded-lg border border-capwheel-border/50 text-gray-400"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {log.details.price && (
                      <div>Price: <span className="text-white">${log.details.price.toFixed(2)}</span></div>
                    )}
                    {log.details.quantity && (
                      <div>Qty: <span className="text-white">{log.details.quantity}</span></div>
                    )}
                    {log.details.slippage !== undefined && (
                      <div>Slippage: <span className="text-capwheel-electric">{(log.details.slippage * 100).toFixed(2)}%</span></div>
                    )}
                    {log.details.fees !== undefined && (
                      <div>Fees: <span className="text-gray-300">${log.details.fees}</span></div>
                    )}
                    {log.details.executionTime && (
                      <div>Exec Time: <span className="text-capwheel-profit">{log.details.executionTime}ms</span></div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={logsEndRef} />
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-capwheel-border flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>Total: {logs.length}</span>
          <span className="text-capwheel-profit">Trades: {logs.filter(l => l.type === 'TRADE').length}</span>
          <span className="text-capwheel-gold">Hedges: {logs.filter(l => l.type === 'HEDGE').length}</span>
        </div>
        <div className="text-capwheel-gold">
          ⚡ Live Execution Feed
        </div>
      </div>
    </motion.div>
  );
};

export default EnterpriseActiveLogs;
