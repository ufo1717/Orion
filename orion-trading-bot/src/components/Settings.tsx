// Settings component for user profile and API key management
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../contexts/AuthContext';
import ApiKeyManager from './ApiKeyManager';
import { UserTier } from '../types';

const Settings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, isAdmin, userTier, setUserTier, demoMode, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'profile' | 'apikeys' | 'security'>('profile');

  const handleTierChange = (tier: UserTier) => {
    if (demoMode || isAdmin) {
      setUserTier(tier);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('apikeys')}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'apikeys'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            API Keys
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-2 px-4 font-medium transition-colors ${
              activeTab === 'security'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Security
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4 text-white">User Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-white font-medium">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Name</label>
                  <p className="text-white font-medium">{user?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">User ID</label>
                  <p className="text-white font-mono text-sm">{user?.sub || 'N/A'}</p>
                </div>
                {isAdmin && (
                  <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <p className="text-purple-400 text-sm font-semibold">
                      👑 Administrator Account
                    </p>
                  </div>
                )}
                {demoMode && (
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 text-sm font-semibold">
                      🔬 Demo Mode Active
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tier Selection */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4 text-white">Subscription Tier</h2>
              {(demoMode || isAdmin) && (
                <p className="text-sm text-gray-400 mb-4">
                  {demoMode ? 'Demo mode: All tiers available' : 'Admin: Can switch between tiers'}
                </p>
              )}
              <div className="space-y-3">
                {[UserTier.TIER_1, UserTier.TIER_2, UserTier.TIER_3].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => handleTierChange(tier)}
                    disabled={!demoMode && !isAdmin && tier !== userTier}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      tier === userTier
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    } ${!demoMode && !isAdmin && tier !== userTier ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-white">
                          Tier {tier} {tier === UserTier.TIER_3 && '👑'}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {tier === UserTier.TIER_1 && 'Foundational - Low Risk'}
                          {tier === UserTier.TIER_2 && 'Advanced - Moderate Risk'}
                          {tier === UserTier.TIER_3 && 'Prime - High Performance'}
                        </p>
                      </div>
                      {tier === userTier && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apikeys' && <ApiKeyManager />}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4 text-white">Security Settings</h2>
              
              {/* Session Info */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Session Management</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Your session is managed securely with JWT tokens stored in memory.
                </p>
                <button
                  onClick={logout}
                  className="py-2 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg font-medium text-red-400 transition-colors"
                >
                  Logout
                </button>
              </div>

              {/* Security Features */}
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Active Security Features</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    JWT token-based authentication
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Secure session management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    API key encryption (AES-256)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Role-based access control
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Protected endpoints
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Settings;
