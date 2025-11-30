import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { MarketDataProvider } from './contexts/MarketDataContext';
import { MarketRegimeProvider } from './contexts/MarketRegimeContext';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CedrickApp } from './components/cedrick-logging';
import { CapWheelApp } from './components/capwheel';
import './App.css';

function TradingBotContent() {
  const { isLoading } = useApp();
  const { isAuthenticated } = useAuthContext();
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show onboarding after authentication
  if (isLoading && showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  // Show protected dashboard
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

function TradingBotApp() {
  return (
    <AuthProvider>
      <AppProvider>
        <MarketDataProvider>
          <MarketRegimeProvider>
            <TradingBotContent />
          </MarketRegimeProvider>
        </MarketDataProvider>
      </AppProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* CapWheel Enterprise Trading Platform */}
        <Route path="/capwheel/*" element={<CapWheelApp />} />
        
        {/* Cedrick Logging Website */}
        <Route path="/cedrick-logging" element={<CedrickApp />} />
        
        {/* Original Trading Bot (default route) */}
        <Route path="/*" element={<TradingBotApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
