import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { UserTier } from '../types';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const { setUserTier, setIsLoading } = useApp();
  const [simulatedTier, setSimulatedTier] = useState<UserTier>(UserTier.TIER_2);

  useEffect(() => {
    // Step 1: System Check
    const timer1 = setTimeout(() => setStep(1), 1500);
    
    // Step 2: Tier Verification
    const timer2 = setTimeout(() => {
      setStep(2);
      // Simulate tier detection (in real app, this would query backend)
      const tiers = [UserTier.TIER_1, UserTier.TIER_2, UserTier.TIER_3];
      const randomTier = tiers[Math.floor(Math.random() * tiers.length)];
      setSimulatedTier(randomTier);
      
      // Step 3: Reveal Dashboard (set within this callback to use the fresh tier)
      setTimeout(() => {
        setStep(3);
        setUserTier(randomTier);
        
        // Complete onboarding
        setTimeout(() => {
          setIsLoading(false);
          onComplete();
        }, 1500);
      }, 2500);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [setUserTier, setIsLoading, onComplete]);

  const getTierLabel = (tier: UserTier): string => {
    switch (tier) {
      case UserTier.TIER_1:
        return 'Tier 1 - Foundation';
      case UserTier.TIER_2:
        return 'Tier 2 - Advanced';
      case UserTier.TIER_3:
        return 'Tier 3 - Prime';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
            >
              ORION
            </motion.div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="sync"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-12 max-w-md"
          >
            <div className="flex flex-col items-center space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
              />
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">System Check</h2>
                <p className="text-gray-400 animate-pulse">
                  Synchronizing with Global Exchanges...
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="glass-card p-12 max-w-md relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="relative z-10 flex flex-col items-center space-y-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <svg
                  className="w-16 h-16 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </motion.div>
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Tier Verification</h2>
                <p className="text-gray-400">Scanning user profile...</p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card p-12 max-w-md border-2 border-green-500/50 glow-green"
          >
            <div className="flex flex-col items-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <svg
                  className="w-20 h-20 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </motion.div>
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2 text-green-500">
                  User Tier Verified
                </h2>
                <p className="text-xl font-bold mb-2">{getTierLabel(simulatedTier)}</p>
                <p className="text-gray-400 animate-pulse">
                  Unlocking Strategy Matrix...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
