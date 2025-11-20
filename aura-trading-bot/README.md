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
