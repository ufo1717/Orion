# Market Regime and Time-Based Activity System

## Overview

This document explains the implementation of the market regime and UTC time-based activity system that makes the ORION Trading Bot simulation more realistic and unpredictable.

## Architecture

### 1. Market Regime Manager (`marketRegimeManager.ts`)

The core component that manages four distinct market regimes:

#### Regime Configurations

| Regime | Win Rate | Volatility | Activity Multiplier | Description |
|--------|----------|------------|-------------------|-------------|
| **Bull** | 72% | 0.45 (Moderate) | 1.2x (20% faster) | Favorable market conditions with strong upward momentum |
| **Bear** | 58% | 0.65 (High) | 0.85x (15% slower) | Challenging conditions, more cautious trading |
| **Sideways** | 65% | 0.25 (Low) | 0.95x (5% slower) | Range-bound markets with consistent patterns |
| **Volatile** | 68% | 0.85 (Very High) | 1.4x (40% faster) | High-energy markets with rapid price swings |

#### Transition Logic

- **Interval**: Random 30-60 minutes between regime changes
- **Selection**: Weighted random (bull and sideways slightly more common)
- **Prevention**: Never transitions to the same regime consecutively
- **Notification**: Fires callbacks when regime changes for component updates

### 2. Market Regime Context (`MarketRegimeContext.tsx`)

React Context provider that shares regime state across all components:

- **Singleton Pattern**: Single instance of MarketRegimeManager
- **Automatic Updates**: Components receive regime changes via context
- **Volatility Tracking**: Varies ±0.15 around regime's base volatility
- **Timer Updates**: Tracks time until next transition (updated every 5 seconds)

### 3. UTC Time-Based Activity (`timingManager.ts`)

Activity multipliers based on real-world global trading sessions:

#### Trading Session Schedule (UTC)

```
00:00-07:00  Asian Session       1.1x   Moderate activity
07:00-13:00  European Session    0.85x  High activity  
13:00-16:00  US+EU Overlap       0.65x  PEAK activity (maximum liquidity)
16:00-19:00  US Morning          0.75x  High activity
19:00-22:00  US Afternoon        0.8x   High activity
22:00-00:00  Low Activity        1.4x   Slowest period
```

Lower multipliers = faster trading activity (more frequent messages/alerts)

### 4. Message Template System (`messageTemplates.ts`)

Enhanced with regime-aware filtering:

#### Regime-Specific Messages

- **Bull regime**: Filters for bullish/trending_up conditions
- **Bear regime**: Filters for bearish/trending_down conditions  
- **Sideways regime**: Emphasizes range-bound patterns
- **Volatile regime**: Highlights volatility-related signals

#### Market Condition Mapping

The system maps regimes to market conditions for message filtering:
- Bull → trending_up (70% chance)
- Bear → trending_down (70% chance)
- Sideways → calm (70% chance)
- Volatile → volatile (100%)

### 5. Component Integration

#### ActiveLogs Component

- Applies regime activity multiplier to base trading speed
- Uses regime win rate for trade outcome probability
- Filters messages based on current regime
- Shows profit on ~35% of winning trades

#### AlertsPanel Component  

- Separate timing configuration (8 second base interval)
- Applies regime multiplier to alert frequency
- Uses same regime-aware filtering

## How It Works

### Startup Sequence

1. **App.tsx** wraps application with `MarketRegimeProvider`
2. Provider creates singleton `MarketRegimeManager` (starts in 'sideways')
3. Manager schedules first transition (random 30-60 minutes)
4. Components subscribe to regime updates via `useMarketRegime()` hook

### Runtime Behavior

1. **Regime Transitions**:
   - Timer fires after random interval
   - New regime selected (weighted, non-repeating)
   - All subscribed components notified
   - Next transition scheduled

2. **Activity Adjustment**:
   - Base interval calculated from strategy speed
   - Multiplied by regime's activity multiplier
   - Further modified by UTC time-of-day multiplier
   - Random variance applied (±30-35%)

3. **Message Selection**:
   - Current UTC time determines time-of-day
   - Regime determines market condition bias
   - Messages filtered by conditions
   - Recent message tracker prevents repetition

4. **Win/Loss Determination**:
   - Random number compared to regime win rate
   - Bull markets: 72% chance of profit
   - Bear markets: 58% chance of profit
   - Profit amounts randomized (0-150)

## Configuration Constants

### Regime Transition
```typescript
MIN_TRANSITION_MINUTES = 30
MAX_TRANSITION_MINUTES = 60
```

### Update Intervals
```typescript
VOLATILITY_UPDATE_INTERVAL_MS = 30000  // 30 seconds
TRANSITION_TIMER_UPDATE_INTERVAL_MS = 5000  // 5 seconds
```

### Alert Timing
```typescript
ALERT_BASE_INTERVAL_MS = 8000  // 8 seconds
```

## Benefits

### Unpredictability
- No two 60-minute periods are identical
- Regime transitions randomized with no patterns
- Activity varies by UTC hour and market regime
- Message selection has built-in variety

### Realism
- Mirrors actual market behavior (bull/bear cycles)
- Reflects global trading session activity
- Win rates adjust to market conditions
- Volatility creates believable variance

### Scalability
- Easy to add new regimes
- Configurable transition intervals
- Adjustable win rates and multipliers
- Extensible message filtering system

## Future Enhancements

Potential improvements to consider:

1. **Regime Sub-States**: Add mini-cycles within regimes (e.g., bull-acceleration, bull-consolidation)
2. **News Events**: Trigger special high-volatility periods
3. **Regime History**: Track recent regime sequence to bias future selections
4. **User Notifications**: Optional alerts when regime changes
5. **Analytics Dashboard**: Show regime distribution over time
6. **Persistence**: Save regime state to localStorage for consistency across sessions

## Testing Recommendations

To verify the system is working correctly:

1. **Console Logs**: Check browser console for regime transition messages
2. **Activity Observation**: Watch trading speed vary by time of day (UTC)
3. **Win Rate Tracking**: Monitor profit frequency across different regimes
4. **Message Variety**: Ensure no repeated messages in short windows
5. **Transition Timing**: Verify transitions occur within 30-60 minute windows

## Maintenance Notes

- Regime configurations are centralized in `marketRegimeManager.ts`
- UTC time logic isolated in `timingManager.ts`
- All magic numbers extracted to named constants
- Type safety enforced via TypeScript interfaces
- No global state pollution - uses React Context pattern
