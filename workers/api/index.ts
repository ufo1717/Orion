// Cloudflare Workers API for Orion Trading Bot

export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  CACHE: KVNamespace;
  ANALYTICS?: AnalyticsEngineDataset;
  JWT_SECRET: string;
  BINANCE_API_KEY?: string;
}

interface TradeLog {
  userId: number;
  pair: string;
  action: string;
  message: string;
  profit: number;
  price: number;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    const start = Date.now();
    
    try {
      // Authentication endpoints
      if (url.pathname === '/api/auth/register') {
        return handleRegister(request, env, corsHeaders);
      }
      
      if (url.pathname === '/api/auth/login') {
        return handleLogin(request, env, corsHeaders);
      }
      
      if (url.pathname === '/api/auth/logout') {
        return handleLogout(request, env, corsHeaders);
      }
      
      // Protected endpoints (require JWT)
      const token = request.headers.get('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return new Response('Unauthorized', { status: 401, headers: corsHeaders });
      }
      
      const user = await verifyToken(token, env.JWT_SECRET);
      if (!user) {
        return new Response('Invalid token', { status: 401, headers: corsHeaders });
      }
      
      if (url.pathname === '/api/profile') {
        return handleGetProfile(user, env, corsHeaders);
      }
      
      if (url.pathname === '/api/strategies') {
        return handleGetStrategies(user, env, corsHeaders);
      }
      
      if (url.pathname === '/api/strategies/activate') {
        return handleActivateStrategy(request, user, env, corsHeaders);
      }
      
      if (url.pathname === '/api/trades') {
        return handleGetTrades(user, env, corsHeaders);
      }
      
      if (url.pathname === '/api/analytics') {
        return handleGetAnalytics(user, env, corsHeaders);
      }
      
      return new Response('Not found', { status: 404, headers: corsHeaders });
      
    } catch (error) {
      console.error('Worker error:', error);
      
      // Log error analytics
      if (env.ANALYTICS) {
        const duration = Date.now() - start;
        env.ANALYTICS.writeDataPoint({
          blobs: ['error', error instanceof Error ? error.message : 'Unknown error'],
          doubles: [duration],
          indexes: ['error']
        });
      }
      
      return new Response('Internal server error', { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  }
};

// JWT Authentication
async function verifyToken(token: string, secret: string) {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    if (!headerB64 || !payloadB64 || !signatureB64) {
      return null;
    }
    
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const signatureStr = base64UrlDecode(signatureB64);
    const signature = Uint8Array.from(signatureStr, c => c.charCodeAt(0));
    
    const valid = await crypto.subtle.verify('HMAC', key, signature, data);
    if (!valid) return null;
    
    const payload = JSON.parse(base64UrlDecode(payloadB64));
    if (payload.exp < Date.now() / 1000) return null;
    
    return payload;
  } catch {
    return null;
  }
}

// Generate JWT
async function generateToken(payload: any, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claims = { ...payload, iat: now, exp: now + 3600 }; // 1 hour expiry
  
  const encoder = new TextEncoder();
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(claims));
  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const signatureB64 = base64UrlEncode(new Uint8Array(signature));
  
  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

// Base64 URL encoding (URL-safe, no padding)
function base64UrlEncode(data: string | Uint8Array): string {
  let base64: string;
  if (typeof data === 'string') {
    base64 = btoa(data);
  } else {
    base64 = btoa(String.fromCharCode(...data));
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Base64 URL decoding
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

// Password hashing with PBKDF2 (secure alternative to plain SHA-256)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  
  // Generate a salt (in production, store this per-user; for now using a deterministic approach)
  const salt = await crypto.subtle.digest('SHA-256', encoder.encode('orion-salt-v1'));
  
  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  // Derive key using PBKDF2 with 100,000 iterations
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256 // 256 bits = 32 bytes
  );
  
  const hashArray = Array.from(new Uint8Array(derivedBits));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// User Registration
async function handleRegister(request: Request, env: Env, headers: any) {
  try {
    const body = await request.json() as any;
    const { email, password, tier = 1 } = body;
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), { 
        status: 400, 
        headers: { ...headers, 'Content-Type': 'application/json' } 
      });
    }
    
    // Hash password using Web Crypto API
    const passwordHash = await hashPassword(password);
    
    // Insert into D1 database
    const result = await env.DB.prepare(
      'INSERT INTO users (email, password_hash, tier, balance, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(email, passwordHash, tier, 10000, new Date().toISOString()).run();
    
    if (!result.success) {
      return new Response(JSON.stringify({ error: 'Registration failed - email may already exist' }), { 
        status: 400, 
        headers: { ...headers, 'Content-Type': 'application/json' } 
      });
    }
    
    const userId = result.meta.last_row_id as number;
    
    // Create user profile
    await env.DB.prepare(
      'INSERT INTO user_profiles (user_id, onboarding_complete, preferences) VALUES (?, ?, ?)'
    ).bind(userId, 0, '{}').run();
    
    const token = await generateToken({ userId, email, tier }, env.JWT_SECRET);
    
    // Store session in KV
    await createSession(userId, token, env);
    
    return new Response(JSON.stringify({
      success: true,
      token,
      user: { id: userId, email, tier, balance: 10000 }
    }), { headers: { ...headers, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Registration failed' }), { 
      status: 500, 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    });
  }
}

// User Login
async function handleLogin(request: Request, env: Env, headers: any) {
  try {
    const body = await request.json() as any;
    const { email, password } = body;
    
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password required' }), { 
        status: 400, 
        headers: { ...headers, 'Content-Type': 'application/json' } 
      });
    }
    
    const passwordHash = await hashPassword(password);
    
    // Query user from database
    const { results } = await env.DB.prepare(
      'SELECT id, email, password_hash, tier, balance FROM users WHERE email = ?'
    ).bind(email).all();
    
    if (results.length === 0 || results[0].password_hash !== passwordHash) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { 
        status: 401, 
        headers: { ...headers, 'Content-Type': 'application/json' } 
      });
    }
    
    const user = results[0] as any;
    
    // Update last login
    await env.DB.prepare(
      'UPDATE users SET last_login = ? WHERE id = ?'
    ).bind(new Date().toISOString(), user.id).run();
    
    const token = await generateToken({ 
      userId: user.id, 
      email: user.email, 
      tier: user.tier 
    }, env.JWT_SECRET);
    
    // Store session in KV
    await createSession(user.id, token, env);
    
    return new Response(JSON.stringify({
      success: true,
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        tier: user.tier, 
        balance: user.balance 
      }
    }), { headers: { ...headers, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Login failed' }), { 
      status: 500, 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    });
  }
}

// User Logout
async function handleLogout(request: Request, env: Env, headers: any) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      await deleteSession(token, env);
    }
    
    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({ error: 'Logout failed' }), { 
      status: 500, 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    });
  }
}

// Get User Profile
async function handleGetProfile(user: any, env: Env, headers: any) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT u.*, p.active_strategy, p.onboarding_complete, p.preferences FROM users u LEFT JOIN user_profiles p ON u.id = p.user_id WHERE u.id = ?'
    ).bind(user.userId).all();
    
    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), { 
        status: 404, 
        headers: { ...headers, 'Content-Type': 'application/json' } 
      });
    }
    
    const profile = results[0];
    return new Response(JSON.stringify({ success: true, profile }), { 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get profile' }), { 
      status: 500, 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    });
  }
}

// Get Strategies
async function handleGetStrategies(user: any, env: Env, headers: any) {
  const strategies = [
    {
      id: 1,
      name: 'Conservative Growth',
      description: 'Low-risk strategy with steady returns',
      tier: 1,
      risk_level: 'low',
      expected_return: '5-10%'
    },
    {
      id: 2,
      name: 'Balanced Portfolio',
      description: 'Medium-risk strategy with balanced returns',
      tier: 2,
      risk_level: 'medium',
      expected_return: '10-20%'
    },
    {
      id: 3,
      name: 'Aggressive Trading',
      description: 'High-risk strategy with potential high returns',
      tier: 3,
      risk_level: 'high',
      expected_return: '20-40%'
    }
  ];
  
  const availableStrategies = strategies.filter(s => s.tier <= user.tier);
  
  return new Response(JSON.stringify({ success: true, strategies: availableStrategies }), { 
    headers: { ...headers, 'Content-Type': 'application/json' } 
  });
}

// Activate Strategy
async function handleActivateStrategy(request: Request, user: any, env: Env, headers: any) {
  try {
    const body = await request.json() as any;
    const { strategyId, strategyName } = body;
    
    await env.DB.prepare(
      'UPDATE user_profiles SET active_strategy = ?, updated_at = ? WHERE user_id = ?'
    ).bind(strategyName, new Date().toISOString(), user.userId).run();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Strategy ${strategyName} activated` 
    }), { 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('Activate strategy error:', error);
    return new Response(JSON.stringify({ error: 'Failed to activate strategy' }), { 
      status: 500, 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    });
  }
}

// Get Trade Logs
async function handleGetTrades(user: any, env: Env, headers: any) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM trade_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT 100'
    ).bind(user.userId).all();
    
    return new Response(JSON.stringify({ success: true, trades: results }), { 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('Get trades error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get trades' }), { 
      status: 500, 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    });
  }
}

// Get Analytics
async function handleGetAnalytics(user: any, env: Env, headers: any) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM analytics WHERE user_id = ? ORDER BY calculated_at DESC LIMIT 10'
    ).bind(user.userId).all();
    
    return new Response(JSON.stringify({ success: true, analytics: results }), { 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get analytics' }), { 
      status: 500, 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    });
  }
}

// Session Management (KV)
async function createSession(userId: number, token: string, env: Env) {
  const sessionData = {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600000 // 1 hour
  };
  
  // Store in KV with auto-expiry
  await env.SESSIONS.put(
    `session:${token}`, 
    JSON.stringify(sessionData),
    { expirationTtl: 3600 } // Auto-delete after 1 hour
  );
}

async function getSession(token: string, env: Env) {
  const data = await env.SESSIONS.get(`session:${token}`);
  return data ? JSON.parse(data) : null;
}

async function deleteSession(token: string, env: Env) {
  await env.SESSIONS.delete(`session:${token}`);
}

// Cache Management (KV)
async function getCachedPrice(symbol: string, env: Env): Promise<number | null> {
  const cached = await env.CACHE.get(`price:${symbol}`);
  return cached ? parseFloat(cached) : null;
}

async function setCachedPrice(symbol: string, price: number, env: Env) {
  // Cache for 60 seconds
  await env.CACHE.put(
    `price:${symbol}`, 
    price.toString(),
    { expirationTtl: 60 }
  );
}

// Rate Limiting
interface RateLimitConfig {
  maxRequests: number;
  windowSeconds: number;
}

async function checkRateLimit(
  key: string, 
  config: RateLimitConfig, 
  env: Env
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `ratelimit:${key}:${Math.floor(now / config.windowSeconds)}`;
  
  const current = await env.CACHE.get(windowKey);
  const count = current ? parseInt(current) : 0;
  
  if (count >= config.maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  
  await env.CACHE.put(
    windowKey, 
    (count + 1).toString(),
    { expirationTtl: config.windowSeconds }
  );
  
  return { 
    allowed: true, 
    remaining: config.maxRequests - count - 1 
  };
}
