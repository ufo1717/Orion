-- Orion Trading Bot - D1 Database Schema

-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  tier INTEGER DEFAULT 1,
  balance REAL DEFAULT 10000.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

CREATE INDEX idx_users_email ON users(email);

-- User profiles
CREATE TABLE user_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  active_strategy TEXT,
  onboarding_complete INTEGER DEFAULT 0,
  preferences TEXT, -- JSON string
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Trading logs
CREATE TABLE trade_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  pair TEXT NOT NULL,
  action TEXT NOT NULL, -- BUY, SELL, SCAN, EXECUTE
  message TEXT,
  profit REAL,
  price REAL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_trade_logs_user_timestamp ON trade_logs(user_id, timestamp DESC);

-- Sessions (for token blacklisting)
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_sessions_token ON sessions(token_hash);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- Performance analytics
CREATE TABLE analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  period TEXT NOT NULL, -- 1d, 7d, 30d
  total_trades INTEGER DEFAULT 0,
  winning_trades INTEGER DEFAULT 0,
  total_profit REAL DEFAULT 0.0,
  win_rate REAL DEFAULT 0.0,
  calculated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_analytics_user_period ON analytics(user_id, period);
