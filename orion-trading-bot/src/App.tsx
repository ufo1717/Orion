import { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { MarketDataProvider } from './contexts/MarketDataContext';
import { MarketRegimeProvider } from './contexts/MarketRegimeContext';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import './App.css';

function AppContent() {
  const { isLoading } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (isLoading && showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AppProvider>
      <MarketDataProvider>
        <MarketRegimeProvider>
          <AppContent />
        </MarketRegimeProvider>
      </MarketDataProvider>
    </AppProvider>
  );
}

export default App;
