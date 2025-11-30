// CapWheel App Component
// Main CapWheel application wrapper with context providers and routing

import React from 'react';
import { CapWheelProvider, useCapWheel } from '../../contexts/CapWheelContext';
import { AppProvider } from '../../contexts/AppContext';
import { MarketDataProvider } from '../../contexts/MarketDataContext';
import { MarketRegimeProvider } from '../../contexts/MarketRegimeContext';
import CapWheelLogin from './CapWheelLogin';
import CapWheelDashboard from './CapWheelDashboard';

// Inner content that uses CapWheel context
const CapWheelContent: React.FC = () => {
  const { isAuthenticated } = useCapWheel();

  if (!isAuthenticated) {
    return <CapWheelLogin />;
  }

  return <CapWheelDashboard />;
};

// Main CapWheel App with all providers
const CapWheelApp: React.FC = () => {
  return (
    <CapWheelProvider>
      <AppProvider>
        <MarketDataProvider>
          <MarketRegimeProvider>
            <CapWheelContent />
          </MarketRegimeProvider>
        </MarketDataProvider>
      </AppProvider>
    </CapWheelProvider>
  );
};

export default CapWheelApp;
