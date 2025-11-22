# Authentication & Security Setup Guide

This guide explains how to configure and use the authentication and security features in the Orion Trading Bot application.

## Features Implemented

### ✅ User Authentication
- **Auth0 Integration**: Enterprise-grade authentication using Auth0
- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Automatic token refresh and session handling
- **Demo Mode**: Fallback mode when Auth0 is not configured

### ✅ API Key Management
- **Encryption**: AES-256 encryption for API keys
- **Secure Storage**: Encrypted storage in browser localStorage
- **Key Management UI**: User-friendly interface for managing API keys
- **Security Best Practices**: Built-in guidance for users

### ✅ Role-Based Access Control (RBAC)
- **User Roles**: Support for `user` and `admin` roles
- **Protected Routes**: Components protected by authentication
- **Tier Management**: User subscription tiers (Tier 1, 2, 3)
- **Role Guards**: Fine-grained access control

### ✅ Security Features
- **HTTP-Only Cookies**: Tokens stored in memory (not localStorage)
- **Protected Endpoints**: All sensitive routes require authentication
- **Credential Security**: Proper handling of sensitive data
- **Encrypted API Keys**: Client-side encryption for exchange API keys

## Setup Instructions

### 1. Auth0 Configuration

#### Create an Auth0 Account
1. Visit [auth0.com](https://auth0.com) and create a free account
2. Create a new application (Single Page Application)
3. Note your Domain and Client ID

#### Configure Auth0 Application
1. Go to your Auth0 application settings
2. Add **Allowed Callback URLs**: `http://localhost:5173, https://your-domain.com`
3. Add **Allowed Logout URLs**: `http://localhost:5173, https://your-domain.com`
4. Add **Allowed Web Origins**: `http://localhost:5173, https://your-domain.com`
5. Save changes

#### Set Up User Roles (Optional but Recommended)
1. Go to User Management → Roles
2. Create two roles:
   - `user` (default role for all users)
   - `admin` (administrative access)
3. In Auth Pipelines → Rules, add a rule to include roles in tokens:

```javascript
function addRolesToToken(user, context, callback) {
  const namespace = 'https://orion.trading';
  const assignedRoles = (context.authorization || {}).roles;
  
  if (context.idToken) {
    context.idToken[namespace + '/roles'] = assignedRoles;
  }
  
  if (context.accessToken) {
    context.accessToken[namespace + '/roles'] = assignedRoles;
  }
  
  callback(null, user, context);
}
```

### 2. Environment Configuration

#### Copy Environment Template
```bash
cp .env.example .env
```

#### Edit `.env` File
```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-here
VITE_AUTH0_AUDIENCE=https://your-api-identifier
VITE_AUTH0_REDIRECT_URI=http://localhost:5173

# API Key Encryption
# Generate a secure key: openssl rand -base64 32
VITE_ENCRYPTION_KEY=your-secure-encryption-key-here
```

#### Generate Encryption Key
```bash
# On Linux/Mac
openssl rand -base64 32

# Or use any secure random string generator
```

### 3. Install Dependencies

Already installed if you've run `npm install`, but listed here for reference:
```bash
npm install @auth0/auth0-react crypto-js js-cookie
npm install --save-dev @types/crypto-js @types/js-cookie
```

### 4. Start the Application

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## Demo Mode

If Auth0 is not configured, the application automatically runs in **Demo Mode**:

- ✅ All features are accessible
- ✅ Simulated authentication
- ✅ All tier levels available
- ✅ Admin privileges granted
- ⚠️ **Not suitable for production**

To enable Auth0, simply configure the environment variables as described above.

## Usage Guide

### Login/Logout

- **Login**: Click the login button on the login page
- **Logout**: Click the logout button (🚪) in the dashboard header

### Managing API Keys

1. Click the settings button (⚙️) in the dashboard header
2. Navigate to the "API Keys" tab
3. Enter your exchange API key
4. Click "Save API Key" - it will be encrypted and stored securely
5. To remove a key, click the "Remove" button

### User Profile Management

1. Open Settings (⚙️)
2. View user information in the "Profile" tab
3. Change subscription tier (if admin or in demo mode)
4. View security settings in the "Security" tab

### Role-Based Access

- **User Role**: Standard access to all features
- **Admin Role**: Can manage all tiers and has elevated privileges
- Roles are assigned in Auth0 User Management

## Security Best Practices

### For Users
1. Never share your API keys with anyone
2. Use read-only API keys when possible
3. Enable IP whitelisting on your exchange
4. Regularly rotate your API keys
5. Use strong, unique passwords for Auth0 login

### For Developers
1. Never commit `.env` files to version control
2. Rotate encryption keys regularly
3. Use HTTPS in production
4. Implement rate limiting on API endpoints
5. Regular security audits

## API Key Encryption

API keys are encrypted using AES-256 encryption:

```typescript
// Encryption (automatic when saving)
const encrypted = encryptData(apiKey);
localStorage.setItem(`orion_api_key_${userId}`, encrypted);

// Decryption (automatic when retrieving)
const decrypted = decryptData(encrypted);
```

**Note**: The encryption key is stored in environment variables. For production, consider using a more secure key management system.

## Troubleshooting

### Auth0 Login Not Working
- Verify Auth0 domain and client ID in `.env`
- Check that callback URLs are configured in Auth0 dashboard
- Ensure you're using the correct Auth0 tenant

### API Keys Not Saving
- Check that encryption key is set in `.env`
- Verify browser localStorage is enabled
- Check browser console for errors

### Demo Mode Won't Disable
- Ensure environment variables are properly set
- Restart the development server after changing `.env`
- Clear browser cache and localStorage

## Architecture

```
┌─────────────────────────────────────────────┐
│           Auth0 Provider (main.tsx)         │
└──────────────────┬──────────────────────────┘
                   │
    ┌──────────────▼──────────────┐
    │    AuthContext Provider     │
    │  - User state               │
    │  - Authentication methods   │
    │  - Role management          │
    └──────────────┬──────────────┘
                   │
    ┌──────────────▼──────────────┐
    │     AppContext Provider     │
    │  - User tier                │
    │  - Active strategy          │
    │  - App state                │
    └──────────────┬──────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ┌────▼────┐       ┌─────▼──────┐
    │  Login  │       │ Dashboard  │
    │  Page   │       │ Protected  │
    └─────────┘       └────────────┘
```

## File Structure

```
src/
├── config/
│   └── auth.ts              # Auth0 configuration
├── contexts/
│   ├── AuthContext.tsx      # Authentication context
│   └── AppContext.tsx       # Application context
├── components/
│   ├── Login.tsx           # Login page
│   ├── ProtectedRoute.tsx  # Route protection
│   ├── Settings.tsx        # Settings modal
│   └── ApiKeyManager.tsx   # API key management
├── utils/
│   └── encryption.ts       # Encryption utilities
└── main.tsx                # Auth0 provider setup
```

## Support

For issues or questions:
1. Check this documentation
2. Review Auth0 documentation: https://auth0.com/docs
3. Check the application logs in the browser console
4. Review the troubleshooting section above

## License

Private - All rights reserved
