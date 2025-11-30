// CapWheel Chart Component
// Enhanced trading chart with CapWheel branding

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { useMarketData } from '../../contexts/MarketDataContext';
import { useMarketRegime } from '../../contexts/MarketRegimeContext';
import { useCapWheel } from '../../contexts/CapWheelContext';

// Constants
const MILLISECONDS_TO_SECONDS = 1000;

const CapWheelChart: React.FC = () => {
  const { candles, currentPrice, connectionStatus, config, currentPair, chartRotationEnabled, setChartRotationEnabled } = useMarketData();
  const { currentRegime, volatilityScore } = useMarketRegime();
  const { portfolioMetrics } = useCapWheel();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  // Initialize chart with CapWheel styling
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9CA3AF',
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: 'rgba(212, 175, 55, 0.05)' },
        horzLines: { color: 'rgba(212, 175, 55, 0.05)' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: 'rgba(212, 175, 55, 0.5)',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: 'rgba(212, 175, 55, 0.5)',
          width: 1,
          style: 2,
        },
      },
      rightPriceScale: {
        borderColor: 'rgba(212, 175, 55, 0.2)',
      },
      timeScale: {
        borderColor: 'rgba(212, 175, 55, 0.2)',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00FF88',
      downColor: '#FF3366',
      borderVisible: false,
      wickUpColor: '#00FF88',
      wickDownColor: '#FF3366',
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Handle window resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Update chart data when candles change
  useEffect(() => {
    if (!candlestickSeriesRef.current || candles.length === 0) return;

    const chartData: CandlestickData[] = candles.map((candle) => ({
      time: Math.floor(candle.openTime / MILLISECONDS_TO_SECONDS) as CandlestickData['time'],
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    candlestickSeriesRef.current.setData(chartData);
    
    // Auto-scale to fit the data
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [candles]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-capwheel-profit';
      case 'connecting':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-capwheel-loss';
      default:
        return 'bg-gray-500';
    }
  };

  const getRegimeColor = () => {
    switch (currentRegime) {
      case 'bull':
        return 'text-capwheel-profit bg-capwheel-profit/10 border-capwheel-profit/30';
      case 'bear':
        return 'text-capwheel-loss bg-capwheel-loss/10 border-capwheel-loss/30';
      case 'volatile':
        return 'text-capwheel-gold bg-capwheel-gold/10 border-capwheel-gold/30';
      case 'sideways':
      default:
        return 'text-capwheel-electric bg-capwheel-electric/10 border-capwheel-electric/30';
    }
  };

  const getRegimeLabel = () => {
    switch (currentRegime) {
      case 'bull':
        return 'BULLISH';
      case 'bear':
        return 'BEARISH';
      case 'volatile':
        return 'HIGH VOL';
      case 'sideways':
      default:
        return 'RANGING';
    }
  };

  const toggleRotation = () => {
    setChartRotationEnabled(!chartRotationEnabled);
  };

  // Calculate price change
  const priceChange = candles.length >= 2 
    ? ((candles[candles.length - 1].close - candles[0].open) / candles[0].open) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="capwheel-card h-[600px] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-capwheel-border flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-white">
                {currentPair.displayName}
              </h3>
              {/* Regime Indicator Badge */}
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getRegimeColor()}`}>
                {getRegimeLabel()}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-gray-400">{config.timeframe}</span>
              {currentPrice > 0 && (
                <>
                  <span className="text-lg font-mono font-semibold text-white">
                    ${currentPrice.toFixed(currentPrice < 1 ? 4 : 2)}
                  </span>
                  <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-capwheel-profit' : 'text-capwheel-loss'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* RWA Correlation Indicator */}
            <div className="capwheel-card px-3 py-1.5 text-xs">
              <span className="text-gray-400">RWA Corr:</span>
              <span className="ml-2 font-medium text-capwheel-electric">
                {(portfolioMetrics.rwaAllocation / 100 * -0.42).toFixed(2)}
              </span>
            </div>

            {/* Volatility Score */}
            <div className="capwheel-card px-3 py-1.5 text-xs">
              <span className="text-gray-400">Vol:</span>
              <span className={`ml-2 font-medium ${volatilityScore > 0.5 ? 'text-capwheel-gold' : 'text-capwheel-electric'}`}>
                {(volatilityScore * 100).toFixed(1)}%
              </span>
            </div>

            {/* Chart Rotation Toggle */}
            <button
              onClick={toggleRotation}
              className="capwheel-card px-3 py-1.5 text-xs hover:border-capwheel-gold/50 transition-colors"
              title={chartRotationEnabled ? 'Disable chart rotation' : 'Enable chart rotation'}
            >
              {chartRotationEnabled ? '🔄 Auto' : '⏸️ Paused'}
            </button>

            {/* Connection Status */}
            <div className="flex items-center space-x-2 capwheel-card px-3 py-1.5">
              <div className={`w-2 h-2 ${getStatusColor()} rounded-full ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`} />
              <span className={`text-xs font-medium ${connectionStatus === 'connected' ? 'text-capwheel-profit' : 'text-gray-500'}`}>
                {connectionStatus === 'connected' ? 'LIVE' : connectionStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div
        ref={chartContainerRef}
        className="flex-1"
      />

      {/* Footer - CapWheel Branding */}
      <div className="p-2 border-t border-capwheel-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-gray-500">
          <span className="text-capwheel-gold">⚡</span>
          <span>CapWheel Enterprise Trading Platform</span>
        </div>
        <div className="text-gray-500">
          Real-time data · Multi-asset monitoring
        </div>
      </div>
    </motion.div>
  );
};

export default CapWheelChart;
