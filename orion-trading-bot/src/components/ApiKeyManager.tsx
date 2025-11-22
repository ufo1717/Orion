// API Key Management component
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../contexts/AuthContext';
import { storeApiKey, retrieveApiKey, removeApiKey, validateApiKey } from '../utils/encryption';

const ApiKeyManager: React.FC = () => {
  const { user } = useAuthContext();
  
  // Memoize the stored key check to avoid repeated decryption on every render
  const hasStoredKey = useMemo(() => {
    return !!(user?.sub && retrieveApiKey(user.sub));
  }, [user?.sub]);
  
  // Initialize with stored key if available
  const getInitialKey = () => {
    return user?.sub ? retrieveApiKey(user.sub) || '' : '';
  };
  
  const [apiKey, setApiKey] = useState(getInitialKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = () => {
    if (!user?.sub) {
      setMessage({ type: 'error', text: 'User not authenticated' });
      return;
    }

    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'API key cannot be empty' });
      return;
    }

    if (!validateApiKey(apiKey)) {
      setMessage({ type: 'error', text: 'Invalid API key format (must be 20-256 characters)' });
      return;
    }

    try {
      storeApiKey(user.sub, apiKey);
      setMessage({ type: 'success', text: 'API key saved securely (encrypted)' });
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Failed to save API key' });
    }
  };

  const handleRemove = () => {
    if (!user?.sub) return;
    
    if (window.confirm('Are you sure you want to remove your API key?')) {
      removeApiKey(user.sub);
      setApiKey('');
      setMessage({ type: 'success', text: 'API key removed' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-white">API Key Management</h2>
      
      <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-gray-300">
          <strong>Security:</strong> Your API key is encrypted using AES-256 before storage.
          It never leaves your browser in plain text.
        </p>
      </div>

      {/* Status Indicator */}
      <div className="mb-4 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${hasStoredKey ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-400">
          {hasStoredKey ? 'API Key Configured' : 'No API Key Stored'}
        </span>
      </div>

      {/* API Key Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Exchange API Key
        </label>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your exchange API key"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showApiKey ? '🙈' : '👁️'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Your API key will be encrypted before storage
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium text-white transition-colors"
        >
          Save API Key
        </button>
        {hasStoredKey && (
          <button
            onClick={handleRemove}
            className="py-2 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg font-medium text-red-400 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Security Info */}
      <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Security Best Practices</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Never share your API key with anyone</li>
          <li>• Use read-only API keys when possible</li>
          <li>• Enable IP whitelisting on your exchange</li>
          <li>• Regularly rotate your API keys</li>
          <li>• Use separate keys for different applications</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ApiKeyManager;
