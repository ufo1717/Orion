import { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { MarketDataProvider } from './contexts/MarketDataContext';
import { MarketRegimeProvider } from './contexts/MarketRegimeContext';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ContextSync } from './components/ContextSync';
import './App.css';

function AppContent() {
  const { isLoading } = useApp();
  const { isAuthenticated } = useAuthContext();
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show onboarding after authentication
  if (isLoading && showOnboarding) {
    return (
      <>
        <ContextSync />
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      </>
    );
  }

  // Show protected dashboard
  return (
    <ProtectedRoute>
      <ContextSync />
      <Dashboard />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MarketDataProvider>
          <MarketRegimeProvider>
            <AppContent />
          </MarketRegimeProvider>
        </MarketDataProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
