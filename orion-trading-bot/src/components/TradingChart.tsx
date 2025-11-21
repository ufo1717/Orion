import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { useMarketData } from '../contexts/MarketDataContext';

// Constants
const MILLISECONDS_TO_SECONDS = 1000;

const TradingChart: React.FC = () => {
  const { candles, currentPrice, connectionStatus, config, setDataMode, currentPair, chartRotationEnabled, setChartRotationEnabled } = useMarketData();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.06)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.06)' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
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
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    if (config.mode === 'simulated') {
      return 'SIMULATED';
    }
    switch (connectionStatus) {
      case 'connected':
        return 'LIVE';
      case 'connecting':
        return 'CONNECTING';
      case 'error':
        return 'ERROR';
      default:
        return 'DISCONNECTED';
    }
  };

  const toggleMode = () => {
    setDataMode(config.mode === 'real' ? 'simulated' : 'real');
  };

  const toggleRotation = () => {
    setChartRotationEnabled(!chartRotationEnabled);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card h-[600px] overflow-hidden flex flex-col"
    >
      <div className="p-4 border-b border-white/10 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Live Market Feed</h3>
            <div className="text-sm text-gray-400 mt-1">
              {currentPair.displayName} · {config.timeframe}
              {currentPrice > 0 && (
                <span className="ml-2 text-white font-mono">
                  ${currentPrice.toFixed(currentPrice < 1 ? 4 : 2)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {config.mode === 'simulated' && (
              <button
                onClick={toggleRotation}
                className="text-xs px-3 py-1 rounded-full glass-card hover:bg-white/10 transition-colors"
                title={chartRotationEnabled ? 'Disable chart rotation' : 'Enable chart rotation'}
              >
                {chartRotationEnabled ? '🔄 Auto-Rotate' : '⏸️ Paused'}
              </button>
            )}
            <button
              onClick={toggleMode}
              className="text-xs px-3 py-1 rounded-full glass-card hover:bg-white/10 transition-colors"
            >
              {config.mode === 'real' ? '📡 Real Data' : '🎲 Simulated'}
            </button>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 ${getStatusColor()} rounded-full ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`} />
              <span className={`text-sm ${connectionStatus === 'connected' ? 'text-green-500' : connectionStatus === 'error' ? 'text-red-500' : 'text-gray-500'}`}>
                {getStatusText()}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={chartContainerRef}
        className="flex-1"
      />
    </motion.div>
  );
};

export default TradingChart;
