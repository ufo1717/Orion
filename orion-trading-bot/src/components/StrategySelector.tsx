import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { STRATEGIES, canAccessStrategy } from '../utils/strategies';
import { StrategyType } from '../types';

interface StrategySelectorProps {
  onClose: () => void;
}

const StrategySelector: React.FC<StrategySelectorProps> = ({ onClose }) => {
  const { userProfile, setActiveStrategy } = useApp();

  const handleSelectStrategy = (strategyType: StrategyType) => {
    if (canAccessStrategy(userProfile.tier, strategyType)) {
      setActiveStrategy(strategyType);
      onClose();
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4">Strategy Matrix</h2>
        <p className="text-gray-400">
          Select your trading strategy based on your tier access
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {Object.values(STRATEGIES).map((strategy) => {
          const hasAccess = canAccessStrategy(userProfile.tier, strategy.id);
          const isActive = userProfile.activeStrategy === strategy.id;

          return (
            <motion.div
              key={strategy.id}
              variants={item}
              whileHover={hasAccess ? { scale: 1.05 } : {}}
              className={`
                glass-card p-6 cursor-pointer transition-all relative overflow-hidden
                ${!hasAccess ? 'opacity-50 cursor-not-allowed' : ''}
                ${isActive ? 'border-2 ring-2 ring-offset-2 ring-offset-black' : ''}
              `}
              style={{
                borderColor: hasAccess ? strategy.color.primary : 'rgba(255,255,255,0.1)',
                boxShadow: isActive ? `0 0 30px ${strategy.color.glow}` : undefined,
              }}
              onClick={() => handleSelectStrategy(strategy.id)}
            >
              {/* Gradient overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: `linear-gradient(135deg, ${strategy.color.primary}, ${strategy.color.secondary})`,
                }}
              />

              {/* Lock overlay for inaccessible strategies */}
              {!hasAccess && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <p className="text-sm text-gray-400">Requires Tier {strategy.tier}</p>
                  </div>
                </div>
              )}

              <div className="relative z-5">
                {/* Strategy Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: strategy.color.primary + '40',
                      color: strategy.color.primary,
                    }}
                  >
                    {strategy.name}
                  </span>
                  {isActive && (
                    <span className="text-green-500 text-xs font-semibold">ACTIVE</span>
                  )}
                </div>

                {/* Strategy Details */}
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ color: strategy.color.primary }}
                >
                  {strategy.weeklyYield}
                </h3>
                <p className="text-sm text-gray-400 mb-4">Weekly Return</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Risk Profile:</span>
                    <span className="font-semibold">{strategy.riskProfile}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Execution Speed:</span>
                    <span className="font-semibold capitalize">{strategy.speed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Access Level:</span>
                    <span className="font-semibold">Tier {strategy.tier}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {strategy.description}
                </p>

                {/* Speed indicator */}
                <div className="mt-4 flex space-x-1">
                  {[1, 2, 3].map((bar) => (
                    <div
                      key={bar}
                      className="h-1 flex-1 rounded"
                      style={{
                        backgroundColor:
                          bar <= (strategy.speed === 'slow' ? 1 : strategy.speed === 'medium' ? 2 : 3)
                            ? strategy.color.primary
                            : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default StrategySelector;
