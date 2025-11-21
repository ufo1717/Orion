// Alert Template System for ORION Trading Bot
// Diverse alert messages for the Smart Alerts panel

import type { Alert } from '../types';

export interface AlertTemplate {
  type: Alert['type'];
  message: string;
  weight?: number;
}

// Comprehensive alert messages (40+ templates)
export const ALERT_TEMPLATES: AlertTemplate[] = [
  // Info alerts - Market monitoring and analysis
  { type: 'info', message: 'Market volatility detected. ORION is adjusting hedging parameters.' },
  { type: 'info', message: 'Scanning for arbitrage opportunities across 15 exchanges.' },
  { type: 'info', message: 'Neural network detected bullish pattern formation.' },
  { type: 'info', message: 'Rebalancing portfolio allocation based on market conditions.' },
  { type: 'info', message: 'Cross-market correlation analysis updated - Optimizing positions.' },
  { type: 'info', message: 'Liquidity analysis complete - Entry zones identified.' },
  { type: 'info', message: 'Real-time sentiment data synchronized from 20+ sources.' },
  { type: 'info', message: 'Volume profile analysis in progress - Key levels detected.' },
  { type: 'info', message: 'Order flow analysis: Institutional activity detected.' },
  { type: 'info', message: 'Multi-timeframe analysis aligned - Trade setup confirmed.' },
  { type: 'info', message: 'Derivative markets scanned - Funding rate arbitrage available.' },
  { type: 'info', message: 'On-chain metrics updated - Whale accumulation detected.' },
  { type: 'info', message: 'Market maker activity increasing - Liquidity improving.' },
  { type: 'info', message: 'Technical indicators recalibrated for current volatility regime.' },
  { type: 'info', message: 'Smart order routing optimized for minimal slippage.' },
  
  // Success alerts - Positive outcomes
  { type: 'success', message: 'Trade executed successfully. Position secured at optimal entry.' },
  { type: 'success', message: 'Profit target reached. Partial position closed.' },
  { type: 'success', message: 'Stop-loss adjusted to lock in profits.' },
  { type: 'success', message: 'Arbitrage trade completed - Profit locked across venues.' },
  { type: 'success', message: 'Scalp position closed with target profit achieved.' },
  { type: 'success', message: 'Grid strategy level filled - Rebalancing successful.' },
  { type: 'success', message: 'Risk-adjusted returns improved via position optimization.' },
  { type: 'success', message: 'Portfolio rebalancing complete - Target allocation achieved.' },
  { type: 'success', message: 'Breakeven stop activated - Position now risk-free.' },
  { type: 'success', message: 'Trailing stop advanced - Profit protection increased.' },
  { type: 'success', message: 'Mean reversion trade completed with expected profit.' },
  { type: 'success', message: 'DCA strategy batch executed at favorable price.' },
  { type: 'success', message: 'High-probability setup executed - AI model confidence: 89%.' },
  { type: 'success', message: 'Order filled with zero slippage - Optimal execution achieved.' },
  { type: 'success', message: 'Position delta-hedged successfully via derivatives.' },
  
  // Warning alerts - Risk management and caution
  { type: 'warning', message: 'High volatility period. Risk management protocols engaged.' },
  { type: 'warning', message: 'Drawdown threshold approaching - Position sizing reduced.' },
  { type: 'warning', message: 'Correlation risk elevated - Diversification adjustment initiated.' },
  { type: 'warning', message: 'Margin utilization above 60% - Leverage reduction advised.' },
  { type: 'warning', message: 'Unusual market conditions detected - Tightening risk parameters.' },
  { type: 'warning', message: 'Liquidity depth declining - Adjusting order sizes.' },
  { type: 'warning', message: 'Circuit breaker armed - Volatility threshold at 85%.' },
  { type: 'warning', message: 'Slippage detected above acceptable levels - Order routing adjusted.' },
  { type: 'warning', message: 'Position concentration risk identified - Rebalancing initiated.' },
  { type: 'warning', message: 'Market microstructure degrading - Reducing trade frequency.' },
  { type: 'warning', message: 'Counter-party risk assessment triggered - Venue allocation modified.' },
  { type: 'warning', message: 'VaR limit approaching - Portfolio heat check in progress.' },
  { type: 'warning', message: 'Extreme order book imbalance - Monitoring for price impact.' },
  { type: 'warning', message: 'Flash crash protection activated - Stop-losses tightened.' },
];

// Message tracker for alerts to prevent repetition
export class AlertMessageTracker {
  private recentAlerts: Set<string> = new Set();
  private readonly maxRecent: number;
  
  constructor(maxRecent: number = 10) {
    this.maxRecent = maxRecent;
  }
  
  addAlert(alertMessage: string): void {
    this.recentAlerts.add(alertMessage);
    
    if (this.recentAlerts.size > this.maxRecent) {
      const alertsArray = Array.from(this.recentAlerts);
      this.recentAlerts = new Set(alertsArray.slice(-this.maxRecent));
    }
  }
  
  isRecentlyUsed(alertMessage: string): boolean {
    return this.recentAlerts.has(alertMessage);
  }
  
  clear(): void {
    this.recentAlerts.clear();
  }
}

// Weighted random selection for alerts
export const selectWeightedRandomAlert = (alerts: AlertTemplate[]): AlertTemplate => {
  const totalWeight = alerts.reduce((sum, alert) => sum + (alert.weight || 1), 0);
  let random = Math.random() * totalWeight;
  
  for (const alert of alerts) {
    random -= alert.weight || 1;
    if (random <= 0) return alert;
  }
  
  return alerts[alerts.length - 1];
};
