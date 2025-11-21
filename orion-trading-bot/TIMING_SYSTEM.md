# Timing System Documentation

## Overview

The ORION Trading Bot now features an advanced timing system that creates organic, unpredictable intervals for trading logs and smart alerts. This system replaces the previous fixed intervals with dynamic, randomized timing that mimics real trading activity.

## Key Features

### 1. Randomized Variance (±30% default)
- Each interval is calculated with a configurable variance percentage
- Default: ±30% of the base interval
- Prevents predictable patterns
- Fully adjustable per use case

### 2. Burst/Cluster Behavior
- Simulates periods of rapid trading activity
- Configurable probability (default 15-18%)
- Burst size: 2-6 events at 100-500ms intervals
- Creates realistic "flurries" of activity

### 3. Slowdown Periods
- Occasional longer intervals (2.5-3x normal)
- Simulates quiet periods in trading
- Configurable probability (default 10-15%)

### 4. Time-of-Day Multipliers
Automatically adjusts timing based on the current hour:

| Time Period | Hours | Multiplier | Effect |
|-------------|-------|------------|--------|
| Morning | 5-12 | 0.8x | 20% faster (higher activity) |
| Midday | 12-17 | 0.7x | 30% faster (peak activity) |
| Evening | 17-22 | 1.0x | Normal speed |
| Night | 22-5 | 1.5x | 50% slower (low activity) |

### 5. Market Condition Sensitivity
Adjusts timing based on market volatility:

| Volatility | Score | Multiplier | Effect |
|------------|-------|------------|--------|
| High | > 0.7 | 0.8x | Faster intervals |
| Medium | 0.3-0.7 | 1.0x | Normal intervals |
| Low | < 0.3 | 1.3x | Slower intervals |

### 6. Pattern Prevention
- Automatically detects similar intervals in a row
- Prevents more than 2 consecutive similar intervals
- Ensures organic, non-repetitive behavior

## Implementation

### Basic Usage

```typescript
import { createTimingManager } from './utils/timingManager';

// Create a timing manager with default settings
const timingManager = createTimingManager(1000); // 1000ms base interval

// Get next interval
const nextInterval = timingManager.getNextInterval(volatilityScore);
setTimeout(() => {
  // Your code here
}, nextInterval);
```

### Advanced Configuration

```typescript
import { createTimingManager } from './utils/timingManager';

const timingManager = createTimingManager(1000, {
  variancePercent: 35,          // ±35% variance
  burstProbability: 0.18,       // 18% chance of burst
  burstMinCount: 2,             // Min 2 events in burst
  burstMaxCount: 6,             // Max 6 events in burst
  burstIntervalMin: 100,        // 100ms min during burst
  burstIntervalMax: 500,        // 500ms max during burst
  slowdownProbability: 0.12,    // 12% chance of slowdown
  slowdownMultiplier: 2.5,      // 2.5x slower during slowdown
  timeOfDayEnabled: true,       // Enable time-of-day multipliers
});
```

### Current Component Configurations

#### ActiveLogs Component
```typescript
// Base interval: 800ms (fast), 1500ms (medium), or 3000ms (slow)
// Based on selected strategy speed
const timingManager = createTimingManager(baseInterval, {
  variancePercent: 35,
  burstProbability: 0.18,
  burstMinCount: 2,
  burstMaxCount: 6,
  slowdownProbability: 0.12,
});
```

#### AlertsPanel Component
```typescript
// Base interval: 8000ms (8 seconds)
const timingManager = createTimingManager(8000, {
  variancePercent: 40,          // Higher variance for alerts
  burstProbability: 0.12,       // Less frequent bursts
  burstMinCount: 2,
  burstMaxCount: 3,             // Smaller bursts
  burstIntervalMin: 1000,       // 1 second min
  burstIntervalMax: 2000,       // 2 second max
  slowdownProbability: 0.15,    // More frequent slowdowns
  slowdownMultiplier: 3.0,      // Longer slowdowns
});
```

## API Reference

### `createTimingManager(baseInterval, options?)`

Creates a new timing manager instance.

**Parameters:**
- `baseInterval` (number): Base interval in milliseconds
- `options` (object, optional): Configuration options

**Returns:** TimingManager instance

### TimingManager Methods

#### `getNextInterval(volatilityScore?)`
Get the next randomized interval.

**Parameters:**
- `volatilityScore` (number, optional): Market volatility score (0-1, default: 0.5)

**Returns:** Number of milliseconds to wait

#### `isInBurst()`
Check if currently in burst mode.

**Returns:** boolean

#### `reset()`
Reset internal state.

#### `updateBaseInterval(newBaseInterval)`
Update the base interval.

**Parameters:**
- `newBaseInterval` (number): New base interval in milliseconds

#### `updateConfig(newConfig)`
Update configuration options.

**Parameters:**
- `newConfig` (object): Partial configuration to update

### Helper Functions

#### `getTimeOfDayMultiplier()`
Get multiplier based on current hour.

**Returns:** Number (0.7-1.5)

#### `getMarketConditionMultiplier(volatilityScore)`
Get multiplier based on market volatility.

**Parameters:**
- `volatilityScore` (number): Volatility score (0-1)

**Returns:** Number (0.8, 1.0, or 1.3)

## Testing

Run the validation script to test the timing system:

```bash
npx tsx src/utils/validateTiming.ts
```

This will run comprehensive tests including:
- Variance distribution
- Pattern prevention
- Burst behavior
- Slowdown behavior
- Time-of-day multipliers
- Market condition multipliers
- Realistic simulation

## Customization Guide

### Increasing Trading Activity
To make logs appear more frequently:
1. Decrease `baseInterval`
2. Increase `burstProbability`
3. Decrease `slowdownProbability`

```typescript
const activeTiming = createTimingManager(600, { // Faster base
  burstProbability: 0.25,      // More bursts
  slowdownProbability: 0.05,   // Fewer slowdowns
});
```

### Reducing Trading Activity
To make logs appear less frequently:
1. Increase `baseInterval`
2. Decrease `burstProbability`
3. Increase `slowdownProbability`

```typescript
const quietTiming = createTimingManager(2000, { // Slower base
  burstProbability: 0.08,      // Fewer bursts
  slowdownProbability: 0.20,   // More slowdowns
  slowdownMultiplier: 3.5,     // Longer slowdowns
});
```

### Disabling Features

To disable specific features:

```typescript
// Disable time-of-day multipliers
const noTimeMultipliers = createTimingManager(1000, {
  timeOfDayEnabled: false,
});

// Disable bursts
const noBursts = createTimingManager(1000, {
  burstProbability: 0,
});

// Disable slowdowns
const noSlowdowns = createTimingManager(1000, {
  slowdownProbability: 0,
});

// Pure variance only
const pureVariance = createTimingManager(1000, {
  variancePercent: 30,
  burstProbability: 0,
  slowdownProbability: 0,
  timeOfDayEnabled: false,
});
```

## Best Practices

1. **Base Interval Selection**: Choose a base interval that feels natural for your use case
   - Logs: 800-3000ms
   - Alerts: 5000-10000ms

2. **Variance**: Keep variance between 25-40% for organic feel
   - Too low: Feels mechanical
   - Too high: May feel erratic

3. **Burst Probability**: Keep between 10-20%
   - Provides excitement without overwhelming

4. **Time-of-Day**: Enable for realistic simulation
   - Mimics actual market activity patterns

5. **Pattern Prevention**: Always enabled
   - Critical for avoiding robotic behavior

## Performance Considerations

- The TimingManager is lightweight and has minimal overhead
- Use `useRef` in React components to avoid recreating instances
- Volatility score can be updated independently without recreating the manager

## Troubleshooting

### Intervals too predictable
- Increase `variancePercent`
- Enable `timeOfDayEnabled`
- Adjust `burstProbability` and `slowdownProbability`

### Too much randomness
- Decrease `variancePercent`
- Decrease `burstProbability`
- Decrease `slowdownProbability`

### Bursts not appearing
- Increase `burstProbability`
- Check if in-burst state with `isInBurst()`

### Intervals too fast/slow
- Adjust `baseInterval`
- Check time-of-day multipliers
- Verify volatility score range

## Migration from Old System

### Before (Fixed Intervals)
```typescript
const interval = 800; // Fixed
setInterval(generateLog, interval);
```

### After (Dynamic Timing)
```typescript
const timingManager = createTimingManager(800);
let timeoutId: ReturnType<typeof setTimeout>;

const generateLog = () => {
  // Your log generation code
  
  const nextInterval = timingManager.getNextInterval(volatilityScore);
  timeoutId = setTimeout(generateLog, nextInterval);
};

generateLog(); // Start
```

Remember to use `setTimeout` instead of `setInterval` for dynamic intervals!

## Support

For issues or questions about the timing system, please refer to:
- Source code: `src/utils/timingManager.ts`
- Validation script: `src/utils/validateTiming.ts`
- Examples: `src/components/ActiveLogs.tsx` and `src/components/AlertsPanel.tsx`
