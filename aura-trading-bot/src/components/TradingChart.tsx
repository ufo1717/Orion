import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TradingViewWindow extends Window {
  TradingView?: {
    widget: new (config: Record<string, unknown>) => void;
  };
}

const TradingChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TradingView widget initialization
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      const tvWindow = window as unknown as TradingViewWindow;
      if (containerRef.current && tvWindow.TradingView) {
        new tvWindow.TradingView.widget({
          autosize: true,
          symbol: 'BINANCE:BTCUSDT',
          interval: '5',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#000000',
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: 'tradingview_chart',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          gridColor: 'rgba(255, 255, 255, 0.06)',
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
          ],
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card h-[600px] overflow-hidden"
    >
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Live Market Feed</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-500">LIVE</span>
          </div>
        </div>
      </div>
      <div
        id="tradingview_chart"
        ref={containerRef}
        className="w-full h-[calc(100%-60px)]"
      />
    </motion.div>
  );
};

export default TradingChart;
