// Login component for user authentication
import React from 'react';
import { motion } from 'framer-motion';
import { useAuthContext } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { login, demoMode } = useAuthContext();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-12 max-w-md w-full"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            ORION
          </h1>
          <p className="text-gray-400 text-sm">High-Performance Trading Engine</p>
        </div>

        {/* Demo Mode Warning */}
        {demoMode && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm text-center">
              <strong>Demo Mode:</strong> Auth0 not configured. Running in demo mode.
            </p>
          </div>
        )}

        {/* Login Info */}
        <div className="mb-8 space-y-4">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2">Secure Authentication</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• JWT token-based auth</li>
              <li>• Session management</li>
              <li>• Encrypted API keys</li>
              <li>• Role-based access control</li>
            </ul>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={login}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
        >
          {demoMode ? 'Continue in Demo Mode' : 'Login with Auth0'}
        </button>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            By logging in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Configuration Help */}
        {demoMode && (
          <div className="mt-8 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <p className="text-gray-400 text-xs mb-2">
              <strong>To enable Auth0:</strong>
            </p>
            <ol className="text-gray-500 text-xs space-y-1 list-decimal list-inside">
              <li>Create an Auth0 account</li>
              <li>Set up an application</li>
              <li>Copy .env.example to .env</li>
              <li>Add your Auth0 credentials</li>
              <li>Restart the application</li>
            </ol>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
