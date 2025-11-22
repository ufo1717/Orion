// Sync component to keep AppContext and AuthContext in sync
import { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuthContext } from '../contexts/AuthContext';

/**
 * ContextSync - Synchronizes state between AppContext and AuthContext
 * This component ensures user tier is consistent across contexts
 */
export const ContextSync: React.FC = () => {
  const { setUserTier: setAppUserTier, userProfile } = useApp();
  const { userTier: authUserTier, setUserTier: setAuthUserTier } = useAuthContext();

  // Sync tier from AuthContext to AppContext on mount and when authUserTier changes
  useEffect(() => {
    if (authUserTier !== userProfile.tier) {
      setAppUserTier(authUserTier);
    }
  }, [authUserTier, userProfile.tier, setAppUserTier]);

  // Sync tier from AppContext back to AuthContext when it changes
  useEffect(() => {
    if (userProfile.tier !== authUserTier) {
      setAuthUserTier(userProfile.tier);
    }
  }, [userProfile.tier, authUserTier, setAuthUserTier]);

  return null; // This component doesn't render anything
};
