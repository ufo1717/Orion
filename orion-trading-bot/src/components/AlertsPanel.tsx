import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Alert } from '../types';

const ALERT_MESSAGES = [
  { type: 'info' as const, message: 'Market volatility detected. ORION is adjusting hedging parameters.' },
  { type: 'success' as const, message: 'Trade executed successfully. Position secured at optimal entry.' },
  { type: 'info' as const, message: 'Scanning for arbitrage opportunities across 15 exchanges.' },
  { type: 'warning' as const, message: 'High volatility period. Risk management protocols engaged.' },
  { type: 'success' as const, message: 'Profit target reached. Partial position closed.' },
  { type: 'info' as const, message: 'Neural network detected bullish pattern formation.' },
  { type: 'info' as const, message: 'Rebalancing portfolio allocation based on market conditions.' },
  { type: 'success' as const, message: 'Stop-loss adjusted to lock in profits.' },
];

const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const generateAlert = () => {
      const alertTemplate = ALERT_MESSAGES[Math.floor(Math.random() * ALERT_MESSAGES.length)];
      const newAlert: Alert = {
        id: Date.now().toString() + Math.random(),
        type: alertTemplate.type,
        message: alertTemplate.message,
        timestamp: new Date(),
      };

      setAlerts((prev) => {
        const updated = [newAlert, ...prev];
        return updated.slice(0, 5); // Keep only last 5 alerts
      });
    };

    // Generate initial alert
    generateAlert();

    // Generate new alerts periodically
    const interval = setInterval(generateAlert, 8000);

    return () => clearInterval(interval);
  }, []);

  const getAlertStyle = (type: Alert['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/50',
          icon: 'text-green-500',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/50',
          icon: 'text-yellow-500',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/50',
          icon: 'text-blue-500',
        };
    }
  };

  const getIcon = (type: Alert['type']) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      <h3 className="text-lg font-semibold mb-4">Smart Alerts</h3>
      <div className="space-y-3">
        <AnimatePresence>
          {alerts.map((alert) => {
            const style = getAlertStyle(alert.type);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`${style.bg} ${style.border} border rounded-lg p-3`}
              >
                <div className="flex items-start space-x-3">
                  <div className={style.icon}>{getIcon(alert.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AlertsPanel;
