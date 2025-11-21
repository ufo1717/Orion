import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import StrategySelector from './StrategySelector';
import TradingChart from './TradingChart';
import ActiveLogs from './ActiveLogs';
import ProfitDisplay from './ProfitDisplay';
import AlertsPanel from './AlertsPanel';

const Dashboard: React.FC = () => {
  const { userProfile, setActiveStrategy } = useApp();
  const showStrategySelector = !userProfile.activeStrategy;

  const handleOpenStrategySelector = () => {
    setActiveStrategy(undefined);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              ORION TRADING BOT
            </h1>
            <p className="text-gray-400 mt-1">
              High-Performance Trading Engine
            </p>
          </div>
          <div className="glass-card px-6 py-3">
            <div className="text-sm text-gray-400">User Tier</div>
            <div className="text-xl font-bold">
              Tier {userProfile.tier}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Strategy Selector or Main Dashboard */}
      {showStrategySelector ? (
        <StrategySelector onClose={() => {}} />
      ) : (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Profit Display & Alerts */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <ProfitDisplay />
            <AlertsPanel />
          </div>

          {/* Center - Trading Chart */}
          <div className="col-span-12 lg:col-span-6">
            <TradingChart />
          </div>

          {/* Right Column - Active Logs */}
          <div className="col-span-12 lg:col-span-3">
            <ActiveLogs />
          </div>

          {/* Bottom - Strategy Info */}
          <div className="col-span-12">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpenStrategySelector}
              className="glass-card w-full p-4 text-center hover:bg-white/10 transition-colors"
            >
              <span className="text-gray-400">
                Change Strategy or View Strategy Matrix
              </span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
