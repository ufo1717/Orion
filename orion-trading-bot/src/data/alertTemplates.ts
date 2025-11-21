// Alert Template System for ORION Trading Bot
// Diverse alert messages for the Smart Alerts panel

import type { Alert } from '../types';

export type AlertCategory = 
  | 'market_volatility'
  | 'execution_success'
  | 'risk_management'
  | 'technical_signals'
  | 'portfolio_events'
  | 'arbitrage_detection'
  | 'news_events'
  | 'user_actions';

export interface AlertTemplate {
  type: Alert['type'];
  category: AlertCategory;
  message: string;
  weight?: number;
  contextTrigger?: 'trade_execution' | 'price_movement' | 'portfolio_change' | 'time_based' | 'risk_event';
}

// Comprehensive alert messages (50+ templates organized by category)
export const ALERT_TEMPLATES: AlertTemplate[] = [
  // Market Volatility Alerts (8 alerts)
  { 
    type: 'warning', 
    category: 'market_volatility',
    message: 'High volatility period. Risk management protocols engaged.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'info', 
    category: 'market_volatility',
    message: 'Market volatility detected. ORION is adjusting hedging parameters.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'warning', 
    category: 'market_volatility',
    message: 'Unusual market conditions detected - Tightening risk parameters.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'warning', 
    category: 'market_volatility',
    message: 'Extreme order book imbalance - Monitoring for price impact.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'info', 
    category: 'market_volatility',
    message: 'Volatility expansion detected - Adjusting position sizing.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'warning', 
    category: 'market_volatility',
    message: 'Flash crash protection activated - Stop-losses tightened.',
    contextTrigger: 'risk_event'
  },
  { 
    type: 'info', 
    category: 'market_volatility',
    message: 'Market regime change identified - Strategy parameters updated.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'info', 
    category: 'market_volatility',
    message: 'Volatility clustering detected - Increasing risk buffer.',
    contextTrigger: 'price_movement'
  },
  
  // Execution Success Alerts (10 alerts)
  { 
    type: 'success', 
    category: 'execution_success',
    message: 'Trade executed successfully. Position secured at optimal entry.',
    contextTrigger: 'trade_execution'
  },
  { 
    type: 'success', 
    category: 'execution_success',
    message: 'Profit target reached. Partial position closed.',
    contextTrigger: 'trade_execution'
  },
  { 
    type: 'success', 
    category: 'execution_success',
    message: 'Order filled with zero slippage - Optimal execution achieved.',
    contextTrigger: 'trade_execution'
  },
  { 
    type: 'success', 
    category: 'execution_success',
    message: 'Scalp position closed with target profit achieved.',
    contextTrigger: 'trade_execution'
  },
  { 
    type: 'success', 
    category: 'execution_success',
    message: 'High-probability setup executed - AI model confidence: 89%.',
    contextTrigger: 'trade_execution'
  },
  { 
    type: 'success', 
    category: 'execution_success',
    message: 'Mean reversion trade completed with expected profit.',
    contextTrigger: 'trade_execution'
  },
  { 
    type: 'success', 
    category: 'execution_success',
    message: 'DCA strategy batch executed at favorable price.',
    contextTrigger: 'trade_execution'
  },
  { 
    type: 'success', 
    category: 'execution_success',
    message: 'Limit order filled at precise target price - Patience rewarded.',
    contextTrigger: 'trade_execution'
  },
  { 
    type: 'success', 
    category: 'execution_success',
    message: 'Multi-leg strategy executed flawlessly - All orders filled.',
    contextTrigger: 'trade_execution'
  },
  { 
    type: 'success', 
    category: 'execution_success',
    message: 'Time-weighted execution completed - Average price optimized.',
    contextTrigger: 'trade_execution'
  },
  
  // Risk Management Alerts (10 alerts)
  { 
    type: 'success', 
    category: 'risk_management',
    message: 'Stop-loss adjusted to lock in profits.',
    contextTrigger: 'portfolio_change'
  },
  { 
    type: 'success', 
    category: 'risk_management',
    message: 'Breakeven stop activated - Position now risk-free.',
    contextTrigger: 'portfolio_change'
  },
  { 
    type: 'success', 
    category: 'risk_management',
    message: 'Trailing stop advanced - Profit protection increased.',
    contextTrigger: 'portfolio_change'
  },
  { 
    type: 'warning', 
    category: 'risk_management',
    message: 'Drawdown threshold approaching - Position sizing reduced.',
    contextTrigger: 'risk_event'
  },
  { 
    type: 'warning', 
    category: 'risk_management',
    message: 'Margin utilization above 60% - Leverage reduction advised.',
    contextTrigger: 'risk_event'
  },
  { 
    type: 'warning', 
    category: 'risk_management',
    message: 'VaR limit approaching - Portfolio heat check in progress.',
    contextTrigger: 'risk_event'
  },
  { 
    type: 'warning', 
    category: 'risk_management',
    message: 'Position concentration risk identified - Rebalancing initiated.',
    contextTrigger: 'portfolio_change'
  },
  { 
    type: 'success', 
    category: 'risk_management',
    message: 'Position delta-hedged successfully via derivatives.',
    contextTrigger: 'trade_execution'
  },
  { 
    type: 'warning', 
    category: 'risk_management',
    message: 'Correlation risk elevated - Diversification adjustment initiated.',
    contextTrigger: 'portfolio_change'
  },
  { 
    type: 'info', 
    category: 'risk_management',
    message: 'Risk budget recalculated - Position limits updated.',
    contextTrigger: 'portfolio_change'
  },
  
  // Technical Signals Alerts (8 alerts)
  { 
    type: 'info', 
    category: 'technical_signals',
    message: 'Neural network detected bullish pattern formation.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'info', 
    category: 'technical_signals',
    message: 'Multi-timeframe analysis aligned - Trade setup confirmed.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'info', 
    category: 'technical_signals',
    message: 'Technical indicators recalibrated for current volatility regime.',
    contextTrigger: 'time_based'
  },
  { 
    type: 'info', 
    category: 'technical_signals',
    message: 'Golden cross formation detected - Bullish momentum confirmed.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'info', 
    category: 'technical_signals',
    message: 'RSI divergence spotted - Potential reversal signal.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'info', 
    category: 'technical_signals',
    message: 'Volume breakout confirmed - Directional move likely.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'info', 
    category: 'technical_signals',
    message: 'Key support level holding - Bullish structure intact.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'info', 
    category: 'technical_signals',
    message: 'Fibonacci confluence zone identified - High-probability setup.',
    contextTrigger: 'price_movement'
  },
  
  // Portfolio Events Alerts (8 alerts)
  { 
    type: 'info', 
    category: 'portfolio_events',
    message: 'Rebalancing portfolio allocation based on market conditions.',
    contextTrigger: 'portfolio_change'
  },
  { 
    type: 'success', 
    category: 'portfolio_events',
    message: 'Portfolio rebalancing complete - Target allocation achieved.',
    contextTrigger: 'portfolio_change'
  },
  { 
    type: 'success', 
    category: 'portfolio_events',
    message: 'Risk-adjusted returns improved via position optimization.',
    contextTrigger: 'portfolio_change'
  },
  { 
    type: 'info', 
    category: 'portfolio_events',
    message: 'Sector rotation initiated - Increasing exposure to outperformers.',
    contextTrigger: 'portfolio_change'
  },
  { 
    type: 'info', 
    category: 'portfolio_events',
    message: 'Portfolio heat map updated - Correlation matrix optimized.',
    contextTrigger: 'time_based'
  },
  { 
    type: 'success', 
    category: 'portfolio_events',
    message: 'Sharpe ratio improvement detected - Strategy performing well.',
    contextTrigger: 'portfolio_change'
  },
  { 
    type: 'info', 
    category: 'portfolio_events',
    message: 'Asset allocation drift detected - Automatic rebalancing triggered.',
    contextTrigger: 'portfolio_change'
  },
  { 
    type: 'info', 
    category: 'portfolio_events',
    message: 'Monthly performance review completed - All targets met.',
    contextTrigger: 'time_based'
  },
  
  // Arbitrage Detection Alerts (6 alerts)
  { 
    type: 'info', 
    category: 'arbitrage_detection',
    message: 'Scanning for arbitrage opportunities across 15 exchanges.',
    contextTrigger: 'time_based'
  },
  { 
    type: 'success', 
    category: 'arbitrage_detection',
    message: 'Arbitrage trade completed - Profit locked across venues.',
    contextTrigger: 'trade_execution'
  },
  { 
    type: 'info', 
    category: 'arbitrage_detection',
    message: 'Cross-exchange price discrepancy detected - Analyzing execution.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'info', 
    category: 'arbitrage_detection',
    message: 'Funding rate arbitrage opportunity identified.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'success', 
    category: 'arbitrage_detection',
    message: 'Triangular arbitrage executed successfully - Risk-free profit.',
    contextTrigger: 'trade_execution'
  },
  { 
    type: 'info', 
    category: 'arbitrage_detection',
    message: 'Spot-futures basis convergence detected - Preparing trade.',
    contextTrigger: 'price_movement'
  },
  
  // News Events Alerts (6 alerts)
  { 
    type: 'info', 
    category: 'news_events',
    message: 'Real-time sentiment data synchronized from 20+ sources.',
    contextTrigger: 'time_based'
  },
  { 
    type: 'info', 
    category: 'news_events',
    message: 'Social media sentiment shift detected - Adjusting positions.',
    contextTrigger: 'time_based'
  },
  { 
    type: 'warning', 
    category: 'news_events',
    message: 'Major economic announcement approaching - Reducing exposure.',
    contextTrigger: 'time_based'
  },
  { 
    type: 'info', 
    category: 'news_events',
    message: 'On-chain metrics updated - Whale accumulation detected.',
    contextTrigger: 'time_based'
  },
  { 
    type: 'info', 
    category: 'news_events',
    message: 'Market maker activity increasing - Liquidity improving.',
    contextTrigger: 'time_based'
  },
  { 
    type: 'info', 
    category: 'news_events',
    message: 'Institutional order flow detected - Following smart money.',
    contextTrigger: 'time_based'
  },
  
  // User Actions & System Events Alerts (8 alerts)
  { 
    type: 'info', 
    category: 'user_actions',
    message: 'Cross-market correlation analysis updated - Optimizing positions.',
    contextTrigger: 'time_based'
  },
  { 
    type: 'info', 
    category: 'user_actions',
    message: 'Liquidity analysis complete - Entry zones identified.',
    contextTrigger: 'time_based'
  },
  { 
    type: 'info', 
    category: 'user_actions',
    message: 'Volume profile analysis in progress - Key levels detected.',
    contextTrigger: 'time_based'
  },
  { 
    type: 'info', 
    category: 'user_actions',
    message: 'Order flow analysis: Institutional activity detected.',
    contextTrigger: 'time_based'
  },
  { 
    type: 'info', 
    category: 'user_actions',
    message: 'Smart order routing optimized for minimal slippage.',
    contextTrigger: 'time_based'
  },
  { 
    type: 'success', 
    category: 'user_actions',
    message: 'Grid strategy level filled - Rebalancing successful.',
    contextTrigger: 'trade_execution'
  },
  { 
    type: 'warning', 
    category: 'user_actions',
    message: 'Liquidity depth declining - Adjusting order sizes.',
    contextTrigger: 'price_movement'
  },
  { 
    type: 'warning', 
    category: 'user_actions',
    message: 'Slippage detected above acceptable levels - Order routing adjusted.',
    contextTrigger: 'trade_execution'
  },
  
  // Additional Market Analysis Alerts (2 alerts to reach 50+)
  { 
    type: 'warning', 
    category: 'market_volatility',
    message: 'Circuit breaker armed - Volatility threshold at 85%.',
    contextTrigger: 'risk_event'
  },
  { 
    type: 'warning', 
    category: 'risk_management',
    message: 'Market microstructure degrading - Reducing trade frequency.',
    contextTrigger: 'price_movement'
  },
];

// Message tracker for alerts to prevent repetition within 60 minutes
export class AlertMessageTracker {
  private recentAlerts: Map<string, number> = new Map(); // message -> timestamp
  private readonly timeWindowMs: number;
  
  constructor(timeWindowMinutes: number = 60) {
    this.timeWindowMs = timeWindowMinutes * 60 * 1000; // Convert to milliseconds
  }
  
  addAlert(alertMessage: string): void {
    const now = Date.now();
    this.recentAlerts.set(alertMessage, now);
    
    // Clean up old entries
    this.cleanupOldEntries(now);
  }
  
  isRecentlyUsed(alertMessage: string): boolean {
    const timestamp = this.recentAlerts.get(alertMessage);
    if (!timestamp) return false;
    
    const now = Date.now();
    const age = now - timestamp;
    
    // If older than time window, remove and return false
    if (age > this.timeWindowMs) {
      this.recentAlerts.delete(alertMessage);
      return false;
    }
    
    return true;
  }
  
  private cleanupOldEntries(now: number): void {
    const entries = Array.from(this.recentAlerts.entries());
    for (const [message, timestamp] of entries) {
      if (now - timestamp > this.timeWindowMs) {
        this.recentAlerts.delete(message);
      }
    }
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

// Filter alerts by category
export const filterAlertsByCategory = (
  alerts: AlertTemplate[],
  categories: AlertCategory[]
): AlertTemplate[] => {
  return alerts.filter(alert => categories.includes(alert.category));
};

// Filter alerts by context trigger
export const filterAlertsByContext = (
  alerts: AlertTemplate[],
  contextTrigger?: AlertTemplate['contextTrigger']
): AlertTemplate[] => {
  if (!contextTrigger) return alerts;
  return alerts.filter(alert => !alert.contextTrigger || alert.contextTrigger === contextTrigger);
};

// Get random interval between alerts (6-12 seconds for variety)
export const getRandomAlertInterval = (): number => {
  const minInterval = 6000; // 6 seconds
  const maxInterval = 12000; // 12 seconds
  return Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
};
