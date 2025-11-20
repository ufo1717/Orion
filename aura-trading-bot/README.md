# AURA Trading Bot Module

An enterprise-grade, glassmorphism dark mode trading bot interface with hyper-realistic simulation of high-frequency trading activity.

![AURA Trading Bot](https://github.com/user-attachments/assets/0d1e8429-b3ff-4bb4-a7c9-0d007368c4d8)

## Overview

AURA is a standalone trading bot module within a larger investment ecosystem. It features a high-performance trading engine that simulates institutional-grade trading with real-time execution logs, profit tracking, and intelligent alerts.

## Features

### Phase 1: The Handshake (Onboarding Flow)
- **System Check**: Animated loading with "Synchronizing with Global Exchanges..."
- **Tier Verification**: Scanning effect that verifies user's global profile
- **The Reveal**: Smooth transition displaying verified tier and unlocking strategy matrix

### Phase 2: The Strategy Matrix
Three strategic engines with tier-based access control:

#### 1. FOUNDATIONAL (The Anchor)
- **Access**: Tier 1 (Entry Level)
- **Risk Profile**: Low
- **Simulated Yield**: ~2.1% weekly
- **Behavior**: Slow, deliberate trades with Blue/Green indicators

#### 2. ADVANCED (The Hunter)
- **Access**: Tier 2 (Mid-Level)
- **Risk Profile**: Moderate-High
- **Simulated Yield**: ~5.4% weekly
- **Behavior**: Faster execution utilizing "volatility scalping"

#### 3. PRIME (The Apex)
- **Access**: Tier 3 (VIP Only)
- **Risk Profile**: Aggressive/Algorithmic
- **Simulated Yield**: ~12-15% weekly
- **Behavior**: Hyper-active "God Mode" visualization

### Phase 3: The Theater (Simulation & UI Components)

#### TradingView Integration
- Live market feed with custom dark skin
- Real-time candlestick charts
- Embedded trading indicators

#### Active Logs Terminal
- Scrolling real-time execution logs
- Trade actions (BUY, SELL, SCAN, EXECUTE)
- Profit/loss indicators
- Simulated arbitrage opportunities

#### Profit Tickers
- Real-time P&L updates
- Portfolio value tracking
- Weekly return projections
- Live profit fluctuations

#### Smart Alerts
- Market volatility notifications
- Hedging parameter adjustments
- Risk management protocol alerts
- Pattern detection notifications

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: TailwindCSS 3 (Glassmorphism design)
- **Animations**: Framer Motion
- **Charts**: TradingView Widget
- **State Management**: React Context API

## Installation

```bash
cd aura-trading-bot
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Project Structure

```
aura-trading-bot/
├── src/
│   ├── components/         # React components
│   │   ├── Onboarding.tsx        # Onboarding flow
│   │   ├── Dashboard.tsx         # Main dashboard
│   │   ├── StrategySelector.tsx  # Strategy selection
│   │   ├── TradingChart.tsx      # TradingView integration
│   │   ├── ActiveLogs.tsx        # Real-time execution logs
│   │   ├── ProfitDisplay.tsx     # P&L tracking
│   │   └── AlertsPanel.tsx       # Smart alerts
│   ├── contexts/          # React contexts
│   │   └── AppContext.tsx       # Global app state
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   └── strategies.ts        # Strategy configurations
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.js    # TailwindCSS config
└── vite.config.ts        # Vite config
```

## Design Principles

### Glassmorphism Dark Mode
- Translucent cards with backdrop blur
- Subtle border highlights
- Layered depth with shadows
- Dark gradient backgrounds

### High-Trust UX
- Always-active simulation (bot appears constantly working)
- Real-time visual feedback
- Professional color coding (Blue/Green for safe, Purple for moderate, Gold for premium)
- Institutional-grade aesthetics

### Performance
- Optimized animations with Framer Motion
- Efficient re-renders with React Context
- Minimal bundle size
- Fast load times

## Configuration

### Real-Time Crypto Data Integration

AURA Trading Bot now supports **real-time cryptocurrency market data** sourced from Binance, alongside the existing simulated data mode.

#### Data Modes

The application supports two data modes:

1. **Real Data Mode**: Live cryptocurrency market data via WebSocket connection to Binance
   - Real-time candlestick updates for BTC/USDT (1-minute timeframe)
   - Automatic reconnection on connection loss
   - REST API fallback for initial historical data (last 100 candles)
   
2. **Simulated Data Mode** (Default): Simulated market data for testing and demonstration
   - No external network dependency
   - Realistic price movement simulation
   - Consistent behavior across environments

#### Configuration

Set the data mode using the `VITE_USE_REAL_DATA` environment variable:

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and set:
VITE_USE_REAL_DATA=true   # For real-time Binance data
# OR
VITE_USE_REAL_DATA=false  # For simulated data (default)
```

Alternatively, you can toggle between modes directly in the UI using the toggle button in the chart header.

#### Exchange & Data Source

- **Exchange**: Binance (public WebSocket endpoints)
- **Default Symbol**: BTC/USDT
- **Default Timeframe**: 1 minute
- **WebSocket Endpoint**: `wss://stream.binance.com:9443/ws`
- **REST API**: `https://api.binance.com/api/v3/klines`

#### Features

- **Live Candlestick Chart**: Real-time price updates using TradingView Lightweight Charts
- **Connection Status Indicator**: Visual feedback (LIVE/SIMULATED/CONNECTING/ERROR)
- **Auto-Reconnection**: Exponential backoff retry logic (up to 10 attempts)
- **Graceful Fallback**: Automatic switch to simulated mode on connection failure
- **Real Price Integration**: Trading logs optionally display actual market prices

#### UI Indicators

The TradingChart component displays:
- Current symbol and timeframe (e.g., "BTCUSDT · 1m")
- Real-time price (e.g., "$45,234.56")
- Data mode toggle button ("📡 Real Data" or "🎲 Simulated")
- Connection status with colored indicator:
  - 🟢 Green (LIVE): Connected and receiving data
  - 🟡 Yellow (CONNECTING): Attempting to connect
  - 🔴 Red (ERROR): Connection failed
  - ⚫ Gray (DISCONNECTED): Not connected

#### Technical Implementation

- **Data Layer**: `src/data/marketData.ts` - WebSocket management and data normalization
- **Context**: `src/contexts/MarketDataContext.tsx` - React state management for market data
- **Chart**: `src/components/TradingChart.tsx` - Lightweight Charts integration
- **Types**: `src/types/index.ts` - Candle, ConnectionStatus, DataMode types

#### Important Notes

⚠️ **For Demonstration Only**: This integration is for demonstration and educational purposes only. Not intended for actual trading.

⚠️ **No Financial Advice**: This application does not provide financial advice and should not be used to make trading decisions.

⚠️ **Rate Limits**: The Binance public API has rate limits. Avoid excessive requests.

⚠️ **Network Dependency**: Real data mode requires a stable internet connection. Use simulated mode for offline development.

### User Tiers
User tiers are randomly assigned during onboarding for demo purposes. In production, this would query a backend API.

### Trading Simulation
The trading logs, profit tickers, and alerts are all simulated at intervals based on the selected strategy's speed:
- **FOUNDATIONAL**: 3000ms intervals
- **ADVANCED**: 1500ms intervals  
- **PRIME**: 800ms intervals

## Features Implemented

✅ Card-based onboarding sequence with animations
✅ Tier verification with scanning effects
✅ Three-tier strategy matrix with access control
✅ Glassmorphism UI with dark mode
✅ TradingView chart integration
✅ Real-time execution logs with scrolling
✅ Live P&L tracking with animations
✅ Smart alerts system
✅ Strategy-based color theming
✅ Responsive design
✅ TypeScript type safety

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Private - All rights reserved

## Author

Built as part of the ORION investment ecosystem
