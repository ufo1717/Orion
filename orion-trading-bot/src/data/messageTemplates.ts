// Message Template System for ORION Trading Bot
// 100+ unique message templates categorized by trading activity type

export type MessageCategory = 
  | 'market_scanning' 
  | 'trade_execution' 
  | 'risk_management' 
  | 'technical_analysis' 
  | 'order_management' 
  | 'portfolio_actions' 
  | 'advanced_signals';

export type TimeOfDay = 'morning' | 'midday' | 'evening' | 'night';
export type MarketCondition = 'volatile' | 'calm' | 'trending_up' | 'trending_down';

export interface MessageTemplate {
  category: MessageCategory;
  generator: (pair: string, price?: number) => string;
  weight?: number; // Probability weight for selection (default: 1)
  conditions?: {
    timeOfDay?: TimeOfDay[];
    marketCondition?: MarketCondition[];
  };
}

// Market Scanning Messages (15+ templates)
const marketScanningMessages: MessageTemplate[] = [
  {
    category: 'market_scanning',
    generator: (pair, price) => price 
      ? `Scanning ${pair} at $${price.toFixed(2)}... Volatility detected`
      : `Scanning ${pair} pair... Volatility detected`,
  },
  {
    category: 'market_scanning',
    generator: (pair, price) => price
      ? `Monitoring ${pair} liquidity pools at $${price.toFixed(2)}`
      : `Monitoring ${pair} liquidity across exchanges`,
  },
  {
    category: 'market_scanning',
    generator: (pair) => `Analyzing ${pair} order book depth... 5 levels scanned`,
  },
  {
    category: 'market_scanning',
    generator: (pair, price) => price
      ? `${pair} bid-ask spread tightening at $${price.toFixed(2)}`
      : `${pair} bid-ask spread analysis complete`,
  },
  {
    category: 'market_scanning',
    generator: (pair) => `Cross-exchange scan initiated for ${pair} arbitrage`,
  },
  {
    category: 'market_scanning',
    generator: (pair, price) => price
      ? `Volume spike detected on ${pair} at $${price.toFixed(2)}`
      : `Unusual volume activity on ${pair} detected`,
  },
  {
    category: 'market_scanning',
    generator: (pair) => `Real-time feed synchronized for ${pair} across 12 venues`,
  },
  {
    category: 'market_scanning',
    generator: (pair) => `${pair} market depth analysis: Strong buy-side pressure`,
    conditions: { marketCondition: ['trending_up'] },
  },
  {
    category: 'market_scanning',
    generator: (pair) => `${pair} correlation matrix updated - 0.82 with BTC`,
  },
  {
    category: 'market_scanning',
    generator: (pair, price) => price
      ? `Whale activity scanner: Large ${pair} orders near $${price.toFixed(2)}`
      : `Whale wallet movements detected for ${pair}`,
  },
  {
    category: 'market_scanning',
    generator: (pair) => `${pair} liquidity heat map: Optimal entry zones identified`,
  },
  {
    category: 'market_scanning',
    generator: (pair) => `Scanning ${pair} derivative markets for funding rate anomalies`,
  },
  {
    category: 'market_scanning',
    generator: (pair, price) => price
      ? `${pair} momentum shift detected at $${price.toFixed(2)} - 15min timeframe`
      : `${pair} momentum indicators recalibrated`,
  },
  {
    category: 'market_scanning',
    generator: (pair) => `Order flow imbalance detected on ${pair} - ratio 2.3:1`,
  },
  {
    category: 'market_scanning',
    generator: (pair) => `Multi-timeframe scan complete for ${pair}: Bullish confluence`,
    conditions: { marketCondition: ['trending_up'] },
  },
  {
    category: 'market_scanning',
    generator: (pair) => `${pair} microstructure analysis: HFT activity increasing`,
    conditions: { marketCondition: ['volatile'] },
  },
];

// Trade Execution Messages (15+ templates)
const tradeExecutionMessages: MessageTemplate[] = [
  {
    category: 'trade_execution',
    generator: (pair, price) => price
      ? `EXECUTING BUY order for ${pair} @ $${price.toFixed(2)}`
      : `EXECUTING BUY order for ${pair}`,
  },
  {
    category: 'trade_execution',
    generator: (pair, price) => price
      ? `EXECUTING SELL order for ${pair} @ $${price.toFixed(2)}`
      : `EXECUTING SELL order for ${pair}`,
  },
  {
    category: 'trade_execution',
    generator: (pair) => `Order filled on ${pair} - Profit locked`,
  },
  {
    category: 'trade_execution',
    generator: (pair, price) => price
      ? `LIMIT BUY placed for ${pair} @ $${price.toFixed(2)} - Queue position: 24`
      : `LIMIT order placed for ${pair}`,
  },
  {
    category: 'trade_execution',
    generator: (pair, price) => price
      ? `MARKET order executed: ${pair} @ $${price.toFixed(2)} - Fill rate: 100%`
      : `MARKET order successfully filled on ${pair}`,
  },
  {
    category: 'trade_execution',
    generator: (pair) => `Iceberg order deployed on ${pair} - 10% visible size`,
  },
  {
    category: 'trade_execution',
    generator: (pair, price) => price
      ? `Smart routing: ${pair} order split across 3 venues @ avg $${price.toFixed(2)}`
      : `Multi-venue execution complete for ${pair}`,
  },
  {
    category: 'trade_execution',
    generator: (pair) => `TWAP execution initiated for ${pair} - 20min window`,
  },
  {
    category: 'trade_execution',
    generator: (pair, price) => price
      ? `Arbitrage opportunity detected on ${pair} at $${price.toFixed(2)} (0.04s window)`
      : `Arbitrage opportunity detected on ${pair} (0.04s window)`,
  },
  {
    category: 'trade_execution',
    generator: (pair) => `${pair} scalp position entered - Target: 0.3% profit`,
  },
  {
    category: 'trade_execution',
    generator: (pair, price) => price
      ? `DCA strategy: Accumulating ${pair} @ $${price.toFixed(2)} - Batch 3/5`
      : `Dollar-cost averaging: ${pair} batch execution complete`,
  },
  {
    category: 'trade_execution',
    generator: (pair) => `Grid bot execution: ${pair} level 7 filled - Rebalancing`,
  },
  {
    category: 'trade_execution',
    generator: (pair, price) => price
      ? `Flash trade executed: ${pair} @ $${price.toFixed(2)} - Duration: 180ms`
      : `Ultra-low latency trade on ${pair} completed`,
  },
  {
    category: 'trade_execution',
    generator: (pair) => `Trailing buy order activated for ${pair} - Distance: 0.5%`,
  },
  {
    category: 'trade_execution',
    generator: (pair, price) => price
      ? `Stop-limit triggered: ${pair} @ $${price.toFixed(2)} - Position closed`
      : `Conditional order triggered on ${pair}`,
  },
  {
    category: 'trade_execution',
    generator: (pair) => `OCO order filled on ${pair} - Profit target reached first`,
  },
];

// Risk Management Messages (15+ templates)
const riskManagementMessages: MessageTemplate[] = [
  {
    category: 'risk_management',
    generator: (pair, price) => price
      ? `Stop-loss triggered on ${pair} at $${price.toFixed(2)}`
      : `Stop-loss triggered on ${pair} position`,
  },
  {
    category: 'risk_management',
    generator: (pair) => `Hedging parameters adjusted for ${pair}`,
  },
  {
    category: 'risk_management',
    generator: (pair, price) => price
      ? `Risk threshold exceeded: Reducing ${pair} exposure at $${price.toFixed(2)}`
      : `Position sizing adjusted for ${pair} - Risk optimization`,
  },
  {
    category: 'risk_management',
    generator: (pair) => `Portfolio heat check: ${pair} correlation risk acceptable`,
  },
  {
    category: 'risk_management',
    generator: (pair) => `Dynamic stop-loss updated for ${pair} - Trailing at 2.1%`,
  },
  {
    category: 'risk_management',
    generator: (pair, price) => price
      ? `Drawdown protection activated on ${pair} at $${price.toFixed(2)}`
      : `Maximum drawdown limit enforced for ${pair}`,
  },
  {
    category: 'risk_management',
    generator: (pair) => `${pair} position delta-neutral hedged via perpetual futures`,
  },
  {
    category: 'risk_management',
    generator: (pair) => `VaR calculation updated: ${pair} risk within acceptable limits`,
  },
  {
    category: 'risk_management',
    generator: (pair) => `Kelly Criterion applied: Optimal ${pair} position size calculated`,
  },
  {
    category: 'risk_management',
    generator: (pair) => `Margin utilization check: ${pair} leverage reduced to 2x`,
    conditions: { marketCondition: ['volatile'] },
  },
  {
    category: 'risk_management',
    generator: (pair) => `Circuit breaker armed for ${pair} - Volatility threshold: 8%`,
    conditions: { marketCondition: ['volatile'] },
  },
  {
    category: 'risk_management',
    generator: (pair, price) => price
      ? `Profit protection: ${pair} stop-loss moved to breakeven at $${price.toFixed(2)}`
      : `Breakeven stop activated for ${pair} position`,
  },
  {
    category: 'risk_management',
    generator: (pair) => `Beta-weighted delta adjusted for ${pair} portfolio exposure`,
  },
  {
    category: 'risk_management',
    generator: (pair) => `${pair} position stress-tested: 95% confidence level maintained`,
  },
  {
    category: 'risk_management',
    generator: (pair) => `Counter-party risk assessment: ${pair} venue allocation optimized`,
  },
  {
    category: 'risk_management',
    generator: (pair) => `Liquidation buffer expanded for ${pair} - Safety margin: 15%`,
  },
];

// Technical Analysis Messages (15+ templates)
const technicalAnalysisMessages: MessageTemplate[] = [
  {
    category: 'technical_analysis',
    generator: (pair, price) => price
      ? `Analyzing ${pair} trend at $${price.toFixed(2)}...`
      : `Analyzing ${pair} trend patterns...`,
  },
  {
    category: 'technical_analysis',
    generator: (pair, price) => price
      ? `${pair} support level identified at $${price.toFixed(2)}`
      : `${pair} support level identified at current price`,
  },
  {
    category: 'technical_analysis',
    generator: (pair, price) => price
      ? `${pair} resistance breakthrough at $${price.toFixed(2)}`
      : `${pair} resistance breakthrough detected`,
  },
  {
    category: 'technical_analysis',
    generator: (pair, price) => price
      ? `${pair} golden cross formation confirmed at $${price.toFixed(2)}`
      : `Bullish crossover detected on ${pair} - MA convergence`,
    conditions: { marketCondition: ['trending_up'] },
  },
  {
    category: 'technical_analysis',
    generator: (pair) => `RSI divergence spotted on ${pair} - Potential reversal signal`,
  },
  {
    category: 'technical_analysis',
    generator: (pair) => `${pair} Bollinger Bands tightening - Volatility expansion imminent`,
    conditions: { marketCondition: ['calm'] },
  },
  {
    category: 'technical_analysis',
    generator: (pair, price) => price
      ? `Fibonacci retracement: ${pair} holding 0.618 level at $${price.toFixed(2)}`
      : `${pair} key Fibonacci level support confirmed`,
  },
  {
    category: 'technical_analysis',
    generator: (pair) => `${pair} MACD histogram turning positive - Momentum shift`,
    conditions: { marketCondition: ['trending_up'] },
  },
  {
    category: 'technical_analysis',
    generator: (pair, price) => price
      ? `Volume profile analysis: ${pair} high-volume node at $${price.toFixed(2)}`
      : `${pair} point of control identified in volume profile`,
  },
  {
    category: 'technical_analysis',
    generator: (pair) => `${pair} stochastic oscillator in oversold territory - Watch for bounce`,
    conditions: { marketCondition: ['trending_down'] },
  },
  {
    category: 'technical_analysis',
    generator: (pair) => `Ichimoku cloud: ${pair} bullish breakthrough confirmed`,
    conditions: { marketCondition: ['trending_up'] },
  },
  {
    category: 'technical_analysis',
    generator: (pair, price) => price
      ? `${pair} Elliott Wave count: Wave 3 acceleration at $${price.toFixed(2)}`
      : `${pair} impulse wave pattern identified`,
  },
  {
    category: 'technical_analysis',
    generator: (pair) => `${pair} candlestick pattern: Bullish engulfing confirmed on 15min`,
    conditions: { marketCondition: ['trending_up'] },
  },
  {
    category: 'technical_analysis',
    generator: (pair) => `Wyckoff accumulation phase detected for ${pair}`,
    conditions: { marketCondition: ['calm'] },
  },
  {
    category: 'technical_analysis',
    generator: (pair, price) => price
      ? `${pair} pivot point calculated: R1 resistance at $${price.toFixed(2)}`
      : `${pair} intraday pivot levels updated`,
  },
  {
    category: 'technical_analysis',
    generator: (pair) => `${pair} ADX rising above 25 - Strong trend formation`,
    conditions: { marketCondition: ['trending_up', 'trending_down'] },
  },
];

// Order Management Messages (15+ templates)
const orderManagementMessages: MessageTemplate[] = [
  {
    category: 'order_management',
    generator: (pair, price) => price
      ? `${pair} order queue updated - Position in line at $${price.toFixed(2)}`
      : `${pair} limit order placement confirmed`,
  },
  {
    category: 'order_management',
    generator: (pair) => `Modifying ${pair} order parameters - Optimizing fill rate`,
  },
  {
    category: 'order_management',
    generator: (pair, price) => price
      ? `${pair} order partially filled @ $${price.toFixed(2)} - 60% complete`
      : `Partial fill received on ${pair} order`,
  },
  {
    category: 'order_management',
    generator: (pair) => `Canceling stale ${pair} orders - Market moved beyond range`,
  },
  {
    category: 'order_management',
    generator: (pair) => `${pair} order book snapshot captured - 50 levels deep`,
  },
  {
    category: 'order_management',
    generator: (pair, price) => price
      ? `Post-only order placed for ${pair} @ $${price.toFixed(2)} - Maker fee rebate`
      : `${pair} maker order scheduled - Fee optimization active`,
  },
  {
    category: 'order_management',
    generator: (pair) => `${pair} FOK order executed successfully - Full immediate fill`,
  },
  {
    category: 'order_management',
    generator: (pair) => `IOC order on ${pair} completed - Unfilled portion canceled`,
  },
  {
    category: 'order_management',
    generator: (pair, price) => price
      ? `${pair} reserve order activated @ $${price.toFixed(2)} - Hidden liquidity`
      : `Hidden order deployment successful for ${pair}`,
  },
  {
    category: 'order_management',
    generator: (pair) => `Time-weighted orders for ${pair} executing per schedule`,
  },
  {
    category: 'order_management',
    generator: (pair) => `${pair} bracket order set - Entry, target, and stop configured`,
  },
  {
    category: 'order_management',
    generator: (pair, price) => price
      ? `${pair} order amendment complete - Price adjusted to $${price.toFixed(2)}`
      : `${pair} order parameters successfully modified`,
  },
  {
    category: 'order_management',
    generator: (pair) => `Smart order router: ${pair} split between 4 venues for best execution`,
  },
  {
    category: 'order_management',
    generator: (pair) => `${pair} conditional order armed - Trigger price monitored`,
  },
  {
    category: 'order_management',
    generator: (pair, price) => price
      ? `${pair} pegged order tracking reference price at $${price.toFixed(2)}`
      : `Dynamic order pricing active for ${pair}`,
  },
  {
    category: 'order_management',
    generator: (pair) => `${pair} order reconciliation complete - All fills accounted for`,
  },
];

// Portfolio Actions Messages (15+ templates)
const portfolioActionsMessages: MessageTemplate[] = [
  {
    category: 'portfolio_actions',
    generator: (pair) => `Rebalancing portfolio allocation based on ${pair} performance`,
  },
  {
    category: 'portfolio_actions',
    generator: (pair, price) => price
      ? `${pair} position increased to 12% of portfolio at $${price.toFixed(2)}`
      : `Portfolio weight adjusted: ${pair} allocation modified`,
  },
  {
    category: 'portfolio_actions',
    generator: (pair) => `Diversification analysis: ${pair} exposure within target range`,
  },
  {
    category: 'portfolio_actions',
    generator: (pair) => `Tax-loss harvesting opportunity identified for ${pair}`,
    conditions: { marketCondition: ['trending_down'] },
  },
  {
    category: 'portfolio_actions',
    generator: (pair, price) => price
      ? `Portfolio optimization: ${pair} trim executed at $${price.toFixed(2)}`
      : `Profit-taking protocol: ${pair} position reduced`,
  },
  {
    category: 'portfolio_actions',
    generator: (pair) => `Asset correlation check: ${pair} provides portfolio diversification`,
  },
  {
    category: 'portfolio_actions',
    generator: (pair) => `Sharpe ratio improved via ${pair} position adjustment`,
  },
  {
    category: 'portfolio_actions',
    generator: (pair) => `${pair} added to core holdings - Long-term allocation confirmed`,
  },
  {
    category: 'portfolio_actions',
    generator: (pair) => `Sector rotation: Increasing ${pair} weight by 3%`,
  },
  {
    category: 'portfolio_actions',
    generator: (pair) => `Mean-variance optimization: ${pair} optimal weight calculated`,
  },
  {
    category: 'portfolio_actions',
    generator: (pair, price) => price
      ? `Strategic accumulation: ${pair} DCA program initiated at $${price.toFixed(2)}`
      : `${pair} systematic investment plan activated`,
  },
  {
    category: 'portfolio_actions',
    generator: (pair) => `Portfolio heat map updated: ${pair} correlation to BTC at 0.74`,
  },
  {
    category: 'portfolio_actions',
    generator: (pair) => `${pair} moved to watch list - Reduced to minimal allocation`,
  },
  {
    category: 'portfolio_actions',
    generator: (pair) => `Beta-neutral positioning: ${pair} hedge ratio calculated`,
  },
  {
    category: 'portfolio_actions',
    generator: (pair) => `Monthly rebalance: ${pair} weight restored to target 8%`,
    conditions: { timeOfDay: ['morning'] },
  },
  {
    category: 'portfolio_actions',
    generator: (pair) => `Performance attribution: ${pair} contributed 2.3% to returns`,
  },
];

// Advanced Signals Messages (15+ templates)
const advancedSignalsMessages: MessageTemplate[] = [
  {
    category: 'advanced_signals',
    generator: (pair) => `Neural network detected bullish pattern formation on ${pair}`,
    conditions: { marketCondition: ['trending_up'] },
  },
  {
    category: 'advanced_signals',
    generator: (pair, price) => price
      ? `AI model confidence: ${pair} buy signal at $${price.toFixed(2)} - 87% probability`
      : `Machine learning model: High-probability ${pair} setup detected`,
  },
  {
    category: 'advanced_signals',
    generator: (pair) => `Sentiment analysis: ${pair} social volume surge +340% (1hr)`,
  },
  {
    category: 'advanced_signals',
    generator: (pair) => `On-chain metrics: ${pair} whale accumulation detected`,
    conditions: { marketCondition: ['trending_up'] },
  },
  {
    category: 'advanced_signals',
    generator: (pair, price) => price
      ? `${pair} funding rate arbitrage opportunity at $${price.toFixed(2)}`
      : `Derivative market signal: ${pair} funding rate divergence`,
  },
  {
    category: 'advanced_signals',
    generator: (pair) => `Options flow analysis: ${pair} unusual call volume detected`,
    conditions: { marketCondition: ['trending_up'] },
  },
  {
    category: 'advanced_signals',
    generator: (pair) => `${pair} exchange netflow: -$2.3M (accumulation phase)`,
  },
  {
    category: 'advanced_signals',
    generator: (pair) => `Order flow toxicity low on ${pair} - Favorable execution environment`,
  },
  {
    category: 'advanced_signals',
    generator: (pair, price) => price
      ? `${pair} spot-futures basis converging at $${price.toFixed(2)} - Arb closing`
      : `${pair} cross-market signal: Basis trade opportunity closing`,
  },
  {
    category: 'advanced_signals',
    generator: (pair) => `${pair} perpetual swap funding: Longs paying shorts - Bearish sentiment`,
    conditions: { marketCondition: ['trending_down'] },
  },
  {
    category: 'advanced_signals',
    generator: (pair) => `Market maker activity increasing on ${pair} - Liquidity improving`,
  },
  {
    category: 'advanced_signals',
    generator: (pair) => `${pair} order book imbalance: 3:1 buy-side - Bullish pressure`,
    conditions: { marketCondition: ['trending_up'] },
  },
  {
    category: 'advanced_signals',
    generator: (pair, price) => price
      ? `Alpha signal generated: ${pair} entry at $${price.toFixed(2)} - 4.2σ event`
      : `Statistical arbitrage: ${pair} mean reversion signal triggered`,
  },
  {
    category: 'advanced_signals',
    generator: (pair) => `${pair} network activity: Transaction count +45% (24hr)`,
  },
  {
    category: 'advanced_signals',
    generator: (pair) => `Smart money tracker: ${pair} institutional accumulation detected`,
    conditions: { timeOfDay: ['morning', 'midday'] },
  },
  {
    category: 'advanced_signals',
    generator: (pair) => `${pair} CVD (Cumulative Volume Delta) turning positive - Buyer aggression`,
    conditions: { marketCondition: ['trending_up'] },
  },
];

// Combine all message templates
export const ALL_MESSAGE_TEMPLATES: MessageTemplate[] = [
  ...marketScanningMessages,
  ...tradeExecutionMessages,
  ...riskManagementMessages,
  ...technicalAnalysisMessages,
  ...orderManagementMessages,
  ...portfolioActionsMessages,
  ...advancedSignalsMessages,
];

// Helper function to get time of day
export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'midday';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
};

// Thresholds for market condition determination
const VOLATILITY_HIGH_THRESHOLD = 0.7;
const VOLATILITY_LOW_THRESHOLD = 0.3;
const TRENDING_PROBABILITY = 0.5;
const TRENDING_UP_PROBABILITY = 0.75;

// Helper function to determine market condition based on recent price action
export const getMarketCondition = (volatilityScore: number = 0.5): MarketCondition => {
  const random = Math.random();
  
  // High volatility scenarios
  if (volatilityScore > VOLATILITY_HIGH_THRESHOLD) {
    return 'volatile';
  }
  
  // Calm market
  if (volatilityScore < VOLATILITY_LOW_THRESHOLD) {
    return 'calm';
  }
  
  // Trending markets - 50% chance, then 75% chance of up vs down
  if (random > TRENDING_PROBABILITY) {
    return random > TRENDING_UP_PROBABILITY ? 'trending_up' : 'trending_down';
  }
  
  // Default to volatile for interesting messages
  return 'volatile';
};

// Filter messages based on conditions
export const filterMessagesByConditions = (
  messages: MessageTemplate[],
  timeOfDay: TimeOfDay,
  marketCondition: MarketCondition
): MessageTemplate[] => {
  return messages.filter((msg) => {
    if (!msg.conditions) return true;
    
    const { timeOfDay: timeCondition, marketCondition: marketConditionArr } = msg.conditions;
    
    const timeMatch = !timeCondition || timeCondition.includes(timeOfDay);
    const marketMatch = !marketConditionArr || marketConditionArr.includes(marketCondition);
    
    return timeMatch && marketMatch;
  });
};

// Weighted random selection
export const selectWeightedRandom = (messages: MessageTemplate[]): MessageTemplate => {
  const totalWeight = messages.reduce((sum, msg) => sum + (msg.weight || 1), 0);
  let random = Math.random() * totalWeight;
  
  for (const msg of messages) {
    random -= msg.weight || 1;
    if (random <= 0) return msg;
  }
  
  return messages[messages.length - 1];
};

// Recent message tracking to prevent repetition
export class MessageTracker {
  private recentMessages: Set<string> = new Set();
  private readonly maxRecent: number;
  
  constructor(maxRecent: number = 20) {
    this.maxRecent = maxRecent;
  }
  
  addMessage(messageText: string): void {
    this.recentMessages.add(messageText);
    
    // Keep only the most recent messages
    if (this.recentMessages.size > this.maxRecent) {
      const messagesArray = Array.from(this.recentMessages);
      this.recentMessages = new Set(messagesArray.slice(-this.maxRecent));
    }
  }
  
  isRecentlyUsed(messageText: string): boolean {
    return this.recentMessages.has(messageText);
  }
  
  clear(): void {
    this.recentMessages.clear();
  }
}
