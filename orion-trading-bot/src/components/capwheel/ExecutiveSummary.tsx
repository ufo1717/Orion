// Executive Summary Component
// Top-level metrics cards for CapWheel dashboard

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCapWheel } from '../../contexts/CapWheelContext';

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
  accentColor?: 'gold' | 'electric' | 'profit' | 'loss';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subValue,
  trend,
  trendValue,
  icon,
  accentColor = 'gold'
}) => {
  const accentColors = {
    gold: 'border-capwheel-gold/30 hover:border-capwheel-gold/50',
    electric: 'border-capwheel-electric/30 hover:border-capwheel-electric/50',
    profit: 'border-capwheel-profit/30 hover:border-capwheel-profit/50',
    loss: 'border-capwheel-loss/30 hover:border-capwheel-loss/50',
  };

  const iconBgColors = {
    gold: 'bg-capwheel-gold/10',
    electric: 'bg-capwheel-electric/10',
    profit: 'bg-capwheel-profit/10',
    loss: 'bg-capwheel-loss/10',
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-capwheel-profit';
    if (trend === 'down') return 'text-capwheel-loss';
    return 'text-gray-400';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`capwheel-metric-card ${accentColors[accentColor]} transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${iconBgColors[accentColor]}`}>
          {icon}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
            <span>{getTrendIcon()}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="text-sm text-gray-400 mb-1">{title}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subValue && (
        <div className="text-xs text-gray-500 mt-1">{subValue}</div>
      )}
    </motion.div>
  );
};

// Metric animation constants
const METRIC_UPDATE_INTERVAL_MS = 3000;
const PNL_VOLATILITY_FACTOR = 1000;
const PNL_BIAS = 0.45; // Slight positive bias for realistic simulation
const WIN_RATE_CHANGE_RANGE = 0.5;
const VOLATILITY_CHANGE_RANGE = 0.2;

const ExecutiveSummary: React.FC = () => {
  const { portfolioMetrics } = useCapWheel();
  const [animatedMetrics, setAnimatedMetrics] = useState(portfolioMetrics);

  // Simulate real-time metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedMetrics(prev => ({
        ...prev,
        dailyPnL: prev.dailyPnL + (Math.random() - PNL_BIAS) * PNL_VOLATILITY_FACTOR,
        dailyPnLPercent: prev.dailyPnLPercent + (Math.random() - PNL_BIAS) * 0.01,
        winRate: Math.min(100, Math.max(0, prev.winRate + (Math.random() - 0.5) * WIN_RATE_CHANGE_RANGE)),
        volatilityCaptured: Math.max(0, prev.volatilityCaptured + (Math.random() - 0.5) * VOLATILITY_CHANGE_RANGE),
      }));
    }, METRIC_UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* Total Portfolio Value */}
      <MetricCard
        title="Total AUM"
        value={formatCurrency(animatedMetrics.totalAUM)}
        subValue="Assets Under Management"
        icon={
          <svg className="w-5 h-5 text-capwheel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        accentColor="gold"
      />

      {/* Daily P&L */}
      <MetricCard
        title="24h P&L"
        value={formatCurrency(animatedMetrics.dailyPnL)}
        trend={animatedMetrics.dailyPnL >= 0 ? 'up' : 'down'}
        trendValue={formatPercent(animatedMetrics.dailyPnLPercent)}
        icon={
          <svg className="w-5 h-5 text-capwheel-profit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
        accentColor={animatedMetrics.dailyPnL >= 0 ? 'profit' : 'loss'}
      />

      {/* Sharpe Ratio */}
      <MetricCard
        title="Sharpe Ratio"
        value={animatedMetrics.sharpeRatio.toFixed(2)}
        subValue="Risk-Adjusted Return"
        trend={animatedMetrics.sharpeRatio > 2 ? 'up' : animatedMetrics.sharpeRatio > 1 ? 'neutral' : 'down'}
        trendValue={animatedMetrics.sharpeRatio > 2 ? 'Excellent' : animatedMetrics.sharpeRatio > 1 ? 'Good' : 'Review'}
        icon={
          <svg className="w-5 h-5 text-capwheel-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
        accentColor="electric"
      />

      {/* Win Rate */}
      <MetricCard
        title="Win Rate"
        value={`${animatedMetrics.winRate.toFixed(1)}%`}
        subValue="Profitable Trades"
        trend={animatedMetrics.winRate > 60 ? 'up' : animatedMetrics.winRate > 50 ? 'neutral' : 'down'}
        icon={
          <svg className="w-5 h-5 text-capwheel-profit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        accentColor="profit"
      />

      {/* Volatility Captured */}
      <MetricCard
        title="Vol Captured"
        value={`${animatedMetrics.volatilityCaptured.toFixed(1)}%`}
        subValue="Volatility Harvested"
        trend="up"
        icon={
          <svg className="w-5 h-5 text-capwheel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
        accentColor="gold"
      />

      {/* Time-Weighted Return */}
      <MetricCard
        title="TWR"
        value={formatPercent(animatedMetrics.timeWeightedReturn)}
        subValue="Time-Weighted Return"
        trend={animatedMetrics.timeWeightedReturn > 0 ? 'up' : 'down'}
        icon={
          <svg className="w-5 h-5 text-capwheel-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        accentColor="electric"
      />
    </div>
  );
};

export default ExecutiveSummary;
