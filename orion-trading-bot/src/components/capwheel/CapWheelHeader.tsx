// CapWheel Header Component
// Enterprise header with logo, user profile, and market indicators

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CapWheelLogoCompact } from '../../assets/capwheel-logo';
import { useCapWheel } from '../../contexts/CapWheelContext';
import { useMarketData } from '../../contexts/MarketDataContext';

const CapWheelHeader: React.FC = () => {
  const { enterpriseUser, logout } = useCapWheel();
  const { connectionStatus } = useMarketData();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine market session
  const getMarketSession = () => {
    const hour = currentTime.getUTCHours();
    if (hour >= 13 && hour < 21) return { session: 'US', color: 'text-capwheel-profit' };
    if (hour >= 8 && hour < 16) return { session: 'EU', color: 'text-capwheel-electric' };
    if (hour >= 0 && hour < 9) return { session: 'ASIA', color: 'text-capwheel-gold' };
    return { session: '24/7 CRYPTO', color: 'text-capwheel-electric' };
  };

  const marketSession = getMarketSession();

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      'analyst': 'Market Analyst',
      'trader': 'Senior Trader',
      'portfolio_manager': 'Portfolio Manager',
      'admin': 'System Admin',
      'executive': 'Executive',
    };
    return roleMap[role] || role;
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-capwheel-profit';
      case 'connecting': return 'bg-yellow-500';
      case 'error': return 'bg-capwheel-loss';
      default: return 'bg-gray-500';
    }
  };

  return (
    <header className="capwheel-header sticky top-0 z-50 px-6 py-4">
      <div className="flex items-center justify-between max-w-[1920px] mx-auto">
        {/* Logo */}
        <CapWheelLogoCompact />

        {/* Center - Market Status */}
        <div className="flex items-center gap-6">
          {/* Global Market Status */}
          <div className="flex items-center gap-4">
            <div className="capwheel-card px-4 py-2 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()} ${connectionStatus === 'connected' ? 'animate-pulse' : ''}`} />
              <span className="text-sm text-gray-400">Market Feed</span>
              <span className={`text-sm font-medium ${connectionStatus === 'connected' ? 'text-capwheel-profit' : 'text-gray-500'}`}>
                {connectionStatus === 'connected' ? 'LIVE' : connectionStatus.toUpperCase()}
              </span>
            </div>

            {/* Market Session Indicator */}
            <div className="capwheel-card px-4 py-2 flex items-center gap-3">
              <span className="text-sm text-gray-400">Session</span>
              <span className={`text-sm font-semibold ${marketSession.color}`}>
                {marketSession.session}
              </span>
            </div>
          </div>

          {/* Real-time Clock */}
          <div className="capwheel-card px-4 py-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">UTC</span>
              <span className="text-sm font-mono text-white">
                {currentTime.toUTCString().slice(17, 25)}
              </span>
            </div>
          </div>
        </div>

        {/* Right - User Profile & Quick Actions */}
        <div className="flex items-center gap-4">
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="capwheel-card p-2 hover:border-capwheel-gold/50 transition-colors"
              title="Alerts"
            >
              <svg className="w-5 h-5 text-capwheel-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="capwheel-card p-2 hover:border-capwheel-gold/50 transition-colors"
              title="Settings"
            >
              <svg className="w-5 h-5 text-gray-400 hover:text-capwheel-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </motion.button>
          </div>

          {/* User Profile */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="capwheel-card px-4 py-2 flex items-center gap-3 hover:border-capwheel-gold/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-capwheel-gold to-capwheel-electric flex items-center justify-center text-capwheel-navy font-bold text-sm">
                {enterpriseUser?.name.charAt(0) || 'U'}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-white">
                  {enterpriseUser?.name || 'User'}
                </div>
                <div className="text-xs text-capwheel-gold">
                  {enterpriseUser?.role ? getRoleDisplay(enterpriseUser.role) : 'Guest'}
                </div>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-64 capwheel-card py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-capwheel-border">
                  <div className="text-sm font-medium text-white">{enterpriseUser?.name}</div>
                  <div className="text-xs text-gray-400">{enterpriseUser?.email}</div>
                  {enterpriseUser?.desk && (
                    <div className="text-xs text-capwheel-gold mt-1">Desk: {enterpriseUser.desk}</div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-capwheel-loss hover:bg-capwheel-loss/10 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CapWheelHeader;
