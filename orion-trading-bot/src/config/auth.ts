// Authentication configuration and utilities
import type { Auth0ProviderOptions } from '@auth0/auth0-react';

// Auth0 configuration from environment variables
export const auth0Config: Auth0ProviderOptions = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'demo.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'demo-client-id',
  authorizationParams: {
    redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  },
  // Use refresh tokens for better session management
  useRefreshTokens: true,
  // Store tokens in memory (not localStorage for security)
  cacheLocation: 'memory' as const,
};

// User roles for RBAC
export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Check if Auth0 is properly configured
export const isAuth0Configured = (): boolean => {
  return !!(
    import.meta.env.VITE_AUTH0_DOMAIN &&
    import.meta.env.VITE_AUTH0_CLIENT_ID &&
    import.meta.env.VITE_AUTH0_DOMAIN !== 'demo.auth0.com' &&
    import.meta.env.VITE_AUTH0_CLIENT_ID !== 'demo-client-id'
  );
};

// Demo mode flag - when Auth0 is not configured, app runs in demo mode
export const isDemoMode = !isAuth0Configured();
