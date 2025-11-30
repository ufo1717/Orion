// RWA Hedge Panel Component
// Real World Asset hedging display with allocation breakdown

import React from 'react';
import { motion } from 'framer-motion';
import { useCapWheel } from '../../contexts/CapWheelContext';
import type { RWACategory } from '../../contexts/CapWheelContext';

// Donut chart constants
const DONUT_RADIUS = 70;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS; // ~439.82

const RWAHedgePanel: React.FC = () => {
  const { rwaPositions, hedgeMetrics, setAutoRebalance, totalRWAAllocation } = useCapWheel();

  const getCategoryColor = (category: RWACategory): string => {
    const colors: Record<RWACategory, string> = {
      'T-Bills': '#D4AF37',
      'Real Estate': '#00D4FF',
      'Gold': '#FFD700',
      'Commodities': '#00FF88',
      'Corporate Bonds': '#9B59B6',
    };
    return colors[category];
  };

  const getCategoryIcon = (category: RWACategory): string => {
    const icons: Record<RWACategory, string> = {
      'T-Bills': '📜',
      'Real Estate': '🏢',
      'Gold': '🥇',
      'Commodities': '🛢️',
      'Corporate Bonds': '📊',
    };
    return icons[category];
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  // Calculate total RWA value
  const totalRWAValue = rwaPositions.reduce((sum, pos) => sum + pos.value, 0);

  // Calculate weighted average yield
  const weightedYield = rwaPositions.reduce((sum, pos) => sum + (pos.yield * pos.allocation / 100), 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="capwheel-card h-full flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-capwheel-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-capwheel-gold">🛡️</span>
              RWA Hedge Panel
            </h3>
            <p className="text-xs text-gray-400 mt-1">Tokenized Real World Asset Positions</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Total Allocation</div>
            <div className="text-xl font-bold capwheel-text-gradient">{totalRWAAllocation}%</div>
          </div>
        </div>
      </div>

      {/* Donut Chart Visualization */}
      <div className="p-4 flex items-center justify-center">
        <div className="relative">
          <svg width="180" height="180" viewBox="0 0 180 180">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke="rgba(212, 175, 55, 0.1)"
              strokeWidth="20"
            />
            
            {/* Allocation segments */}
            {rwaPositions.reduce((acc, pos, index) => {
              const offset = acc.offset;
              const dashArray = (pos.allocation / 100) * DONUT_CIRCUMFERENCE;
              const dashOffset = -offset;
              
              acc.elements.push(
                <circle
                  key={pos.category}
                  cx="90"
                  cy="90"
                  r={DONUT_RADIUS}
                  fill="none"
                  stroke={getCategoryColor(pos.category)}
                  strokeWidth="20"
                  strokeDasharray={`${dashArray} ${DONUT_CIRCUMFERENCE}`}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 90 90)"
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  opacity={0.8 + (index * 0.05)}
                />
              );
              
              acc.offset += dashArray;
              return acc;
            }, { elements: [] as React.ReactNode[], offset: 0 }).elements}
            
            {/* Center text */}
            <text x="90" y="85" textAnchor="middle" className="fill-white text-2xl font-bold">
              {formatCurrency(totalRWAValue)}
            </text>
            <text x="90" y="105" textAnchor="middle" className="fill-gray-400 text-xs">
              Total RWA Value
            </text>
          </svg>
        </div>
      </div>

      {/* Position Breakdown */}
      <div className="flex-1 overflow-y-auto capwheel-scrollbar px-4 pb-4 space-y-2">
        {rwaPositions.map((position, index) => (
          <motion.div
            key={position.category}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-capwheel-navy/50 border border-capwheel-border/50 hover:border-capwheel-gold/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{getCategoryIcon(position.category)}</span>
              <div>
                <div className="text-sm font-medium text-white">{position.category}</div>
                <div className="text-xs text-gray-400">{formatCurrency(position.value)}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold" style={{ color: getCategoryColor(position.category) }}>
                {position.allocation}%
              </div>
              {position.yield > 0 && (
                <div className="text-xs text-capwheel-profit">
                  {position.yield.toFixed(1)}% APY
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hedge Metrics */}
      <div className="p-4 border-t border-capwheel-border space-y-3">
        {/* Efficiency Metric */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Hedge Efficiency</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-capwheel-navy/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${hedgeMetrics.efficiency}%` }}
                className="h-full bg-gradient-to-r from-capwheel-gold to-capwheel-electric rounded-full"
              />
            </div>
            <span className="text-sm font-medium text-capwheel-gold">{hedgeMetrics.efficiency.toFixed(1)}%</span>
          </div>
        </div>

        {/* Correlation Metric */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Crypto Correlation</span>
          <span className={`text-sm font-medium ${hedgeMetrics.correlation < 0 ? 'text-capwheel-profit' : 'text-capwheel-loss'}`}>
            {hedgeMetrics.correlation.toFixed(2)}
          </span>
        </div>

        {/* Volatility Reduction */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Volatility Reduction</span>
          <span className="text-sm font-medium text-capwheel-profit">
            -{hedgeMetrics.volatilityReduction.toFixed(1)}%
          </span>
        </div>

        {/* Weighted Yield */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Weighted Avg Yield</span>
          <span className="text-sm font-medium text-capwheel-gold">
            {weightedYield.toFixed(2)}% APY
          </span>
        </div>

        {/* Auto-Rebalance Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-capwheel-border/50">
          <div>
            <span className="text-sm text-gray-400">Auto-Rebalance</span>
            {hedgeMetrics.autoRebalanceEnabled && hedgeMetrics.nextRebalanceTime && (
              <div className="text-xs text-gray-500">
                Next: {hedgeMetrics.nextRebalanceTime.toLocaleTimeString()}
              </div>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setAutoRebalance(!hedgeMetrics.autoRebalanceEnabled)}
            className={`w-12 h-6 rounded-full transition-colors ${
              hedgeMetrics.autoRebalanceEnabled
                ? 'bg-capwheel-gold'
                : 'bg-capwheel-navy border border-capwheel-border'
            }`}
          >
            <motion.div
              animate={{ x: hedgeMetrics.autoRebalanceEnabled ? 26 : 2 }}
              className="w-5 h-5 rounded-full bg-white shadow-md"
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default RWAHedgePanel;
