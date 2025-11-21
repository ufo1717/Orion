import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Alert } from '../types';
import {
  ALERT_TEMPLATES,
  AlertMessageTracker,
  selectWeightedRandomAlert,
} from '../data/alertTemplates';
import { createTimingManager } from '../utils/timingManager';

const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  // Create alert message tracker instance that persists across renders (60-minute window)
  const alertTracker = useMemo(() => new AlertMessageTracker(60), []);
  
  // Track volatility for dynamic timing (simulated for alerts)
  const [volatilityScore, setVolatilityScore] = useState(0.5);
  
  // Create timing manager for alerts with different configuration
  const timingManagerRef = useRef(createTimingManager(8000, { // 8 second base
    variancePercent: 40, // Higher variance for alerts
    burstProbability: 0.12, // Less frequent bursts than logs
    burstMinCount: 2,
    burstMaxCount: 3, // Smaller bursts
    burstIntervalMin: 1000, // 1 second min
    burstIntervalMax: 2000, // 2 second max
    slowdownProbability: 0.15, // More frequent slowdowns
    slowdownMultiplier: 3.0, // Longer slowdowns
  }));

  // Update volatility periodically for dynamic timing
  useEffect(() => {
    const updateVolatility = () => {
      // Simulate volatility changes - in real scenario based on actual price data
      setVolatilityScore(Math.random());
    };
    
    const volatilityTimer = setInterval(updateVolatility, 30000); // Update every 30 seconds
    updateVolatility(); // Initial update
    
    return () => clearInterval(volatilityTimer);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const generateAlert = () => {
      // Try to find a non-repeated alert
      let selectedAlert = selectWeightedRandomAlert(ALERT_TEMPLATES);
      let attempts = 0;
      const maxAttempts = 20; // Increased attempts since we have more alerts
      
      // Try to avoid recently used alerts (within 60 minutes)
      while (alertTracker.isRecentlyUsed(selectedAlert.message) && attempts < maxAttempts) {
        selectedAlert = selectWeightedRandomAlert(ALERT_TEMPLATES);
        attempts++;
      }
      
      // Track the alert with timestamp
      alertTracker.addAlert(selectedAlert.message);
      
      const newAlert: Alert = {
        id: Date.now().toString() + Math.random(),
        type: selectedAlert.type,
        message: selectedAlert.message,
        timestamp: new Date(),
      };

      setAlerts((prev) => {
        const updated = [newAlert, ...prev];
        return updated.slice(0, 5); // Keep only last 5 alerts
      });
      
      // Schedule next alert with randomized interval
      const nextInterval = timingManagerRef.current.getNextInterval(volatilityScore);
      timeoutId = setTimeout(generateAlert, nextInterval);
    };

    // Generate initial alert with a small delay
    const initialDelay = 2000 + Math.random() * 1000;
    timeoutId = setTimeout(generateAlert, initialDelay);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [alertTracker, volatilityScore]);

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
