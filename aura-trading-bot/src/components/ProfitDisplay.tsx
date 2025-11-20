import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { STRATEGIES } from '../utils/strategies';

const ProfitDisplay: React.FC = () => {
  const { userProfile } = useApp();
  const [profitData, setProfitData] = useState({
    total: 10000,
    daily: 0,
    weeklyPercentage: 0,
  });
  const [recentChange, setRecentChange] = useState(0);

  useEffect(() => {
    if (!userProfile.activeStrategy) return;

    const strategy = STRATEGIES[userProfile.activeStrategy];
    const baseYield = parseFloat(strategy.weeklyYield.replace(/[~%]/g, ''));
    const dailyYield = baseYield / 7;

    const interval = setInterval(() => {
      setProfitData((prev) => {
        // Generate realistic profit fluctuation
        const change = (Math.random() - 0.3) * (dailyYield * 0.5); // Mostly positive
        const newDaily = prev.daily + change;
        const newTotal = prev.total + change;
        
        setRecentChange(change);

        return {
          total: newTotal,
          daily: newDaily,
          weeklyPercentage: (newDaily / prev.total) * 100 * 7,
        };
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [userProfile.activeStrategy]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-6"
    >
      {/* Total P&L */}
      <div>
        <div className="text-sm text-gray-400 mb-2">Total Portfolio Value</div>
        <motion.div
          key={profitData.total}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold"
        >
          ${profitData.total.toFixed(2)}
        </motion.div>
      </div>

      {/* Daily P&L */}
      <div className="border-t border-white/10 pt-4">
        <div className="text-sm text-gray-400 mb-2">Today's P&L</div>
        <div className="flex items-center justify-between">
          <motion.div
            key={profitData.daily}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            className={`text-2xl font-bold ${
              profitData.daily >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {profitData.daily >= 0 ? '+' : ''}${profitData.daily.toFixed(2)}
          </motion.div>
          <motion.div
            animate={{
              opacity: recentChange !== 0 ? [1, 0] : 1,
            }}
            transition={{ duration: 2 }}
            className={`text-sm font-semibold ${
              recentChange >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {recentChange >= 0 ? '+' : ''}${recentChange.toFixed(2)}
          </motion.div>
        </div>
      </div>

      {/* Weekly Projection */}
      {userProfile.activeStrategy && (
        <div className="border-t border-white/10 pt-4">
          <div className="text-sm text-gray-400 mb-2">Projected Weekly Return</div>
          <div className="text-xl font-bold text-blue-400">
            {STRATEGIES[userProfile.activeStrategy].weeklyYield}
          </div>
          <div className="mt-2 bg-white/5 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.abs(profitData.weeklyPercentage) * 10, 100)}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      )}

      {/* Strategy Info */}
      {userProfile.activeStrategy && (
        <div className="border-t border-white/10 pt-4">
          <div className="text-sm text-gray-400 mb-2">Active Strategy</div>
          <div
            className="text-lg font-bold"
            style={{ color: STRATEGIES[userProfile.activeStrategy].color.primary }}
          >
            {STRATEGIES[userProfile.activeStrategy].name}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {STRATEGIES[userProfile.activeStrategy].description.split('-')[0]}
          </div>
        </div>
      )}

      {/* Live Indicator */}
      <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span>Live Trading Active</span>
      </div>
    </motion.div>
  );
};

export default ProfitDisplay;
