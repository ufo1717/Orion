// CapWheel Dashboard Component
// Enterprise dashboard with executive summary and trading components

import React from 'react';
import { motion } from 'framer-motion';
import CapWheelHeader from './CapWheelHeader';
import ExecutiveSummary from './ExecutiveSummary';
import CapWheelChart from './CapWheelChart';
import RWAHedgePanel from './RWAHedgePanel';
import EnterpriseActiveLogs from './EnterpriseActiveLogs';
import { useCapWheel } from '../../contexts/CapWheelContext';

const CapWheelDashboard: React.FC = () => {
  const { portfolioMetrics } = useCapWheel();

  return (
    <div className="min-h-screen capwheel-gradient capwheel-bg-pattern">
      <CapWheelHeader />
      
      <main className="p-6 max-w-[1920px] mx-auto">
        {/* Executive Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <ExecutiveSummary />
        </motion.section>

        {/* Portfolio Allocation Bar */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6"
        >
          <div className="capwheel-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Portfolio Allocation</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-capwheel-electric" />
                  <span className="text-gray-400">Crypto</span>
                  <span className="text-white font-medium">{portfolioMetrics.cryptoAllocation}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-capwheel-gold" />
                  <span className="text-gray-400">RWA Hedge</span>
                  <span className="text-white font-medium">{portfolioMetrics.rwaAllocation}%</span>
                </div>
              </div>
            </div>
            <div className="h-3 bg-capwheel-navy rounded-full overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${portfolioMetrics.cryptoAllocation}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-capwheel-electric to-blue-400"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${portfolioMetrics.rwaAllocation}%` }}
                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-capwheel-gold to-yellow-400"
              />
            </div>
          </div>
        </motion.section>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - RWA Hedge Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="col-span-12 lg:col-span-3"
          >
            <RWAHedgePanel />
          </motion.div>

          {/* Center - Trading Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="col-span-12 lg:col-span-6"
          >
            <CapWheelChart />
          </motion.div>

          {/* Right Column - Enterprise Execution Logs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="col-span-12 lg:col-span-3"
          >
            <EnterpriseActiveLogs />
          </motion.div>
        </div>

        {/* Bottom Section - Additional Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-6"
        >
          <div className="capwheel-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-capwheel-profit animate-pulse" />
                  <span className="text-gray-400">System Status:</span>
                  <span className="text-capwheel-profit font-medium">All Systems Operational</span>
                </div>
                <div className="text-sm text-gray-500">|</div>
                <div className="text-sm text-gray-400">
                  Last sync: <span className="text-white">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">
                  Max Drawdown: <span className="text-capwheel-loss">-{portfolioMetrics.maxDrawdown}%</span>
                </span>
                <span className="text-xs text-gray-500">|</span>
                <span className="text-xs text-gray-400">
                  CapWheel Enterprise v2.0
                </span>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default CapWheelDashboard;
