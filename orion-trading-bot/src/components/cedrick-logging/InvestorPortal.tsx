import { useState } from 'react';

/**
 * Investor Relations Portal
 * 
 * A FinTech-style dashboard for stakeholders featuring:
 * - Public Layer: ESG metrics, Carbon Credits, ROI data
 * - Private Layer: Secure Partner Sign-In for real-time harvest data
 * 
 * Design: High-Finance aesthetic with Glassmorphism elements
 */

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
}

function MetricCard({ label, value, change, trend, icon }: MetricCardProps) {
  return (
    <div className="investor-metric-card glass-card">
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <span className="metric-label">{label}</span>
        <span className="metric-value">{value}</span>
        {change && (
          <span className={`metric-change ${trend}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {change}
          </span>
        )}
      </div>
    </div>
  );
}

export default function InvestorPortal() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: Show inline message that this is a demo portal
    setLoginMessage('Demo Portal: Partner access requires verified credentials. Contact investor@cedricklogging.com for access.');
    // Clear message after 5 seconds
    setTimeout(() => setLoginMessage(null), 5000);
  };

  return (
    <section id="investors" className="investor-section">
      {/* Background with subtle globe animation */}
      <div className="investor-bg">
        <div className="globe-animation">
          <div className="globe-ring ring-1" />
          <div className="globe-ring ring-2" />
          <div className="globe-ring ring-3" />
          <div className="globe-core" />
        </div>
      </div>

      <div className="investor-container">
        {/* Header */}
        <div className="investor-header glass-card">
          <span className="section-label">Investor Relations</span>
          <h2 className="section-title">
            Sustainable Returns.
            <br />
            <span className="title-accent">Growing Value.</span>
          </h2>
          <p className="section-description">
            Carbon credits, sustained yield forestry, and Mass Timber futures—
            building portfolios that grow with the forest.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="investor-grid">
          {/* Public Layer: ESG Metrics Dashboard */}
          <div className="investor-public">
            <h3 className="subsection-title">ESG Performance Dashboard</h3>
            
            <div className="metrics-grid">
              <MetricCard
                icon="🌍"
                label="Carbon Credits Generated"
                value="24,500 tCO₂e"
                change="+12% YoY"
                trend="up"
              />
              <MetricCard
                icon="📈"
                label="Sustained Yield ROI"
                value="8.4%"
                change="+1.2% vs. benchmark"
                trend="up"
              />
              <MetricCard
                icon="🌲"
                label="Acres Under Management"
                value="47,000"
                change="+5,000 this quarter"
                trend="up"
              />
              <MetricCard
                icon="🏗️"
                label="Mass Timber Contracts"
                value="$12.4M"
                change="Pipeline value"
                trend="neutral"
              />
            </div>

            {/* Carbon Dividend Model Diagram */}
            <div className="carbon-model glass-card">
              <h4>The Carbon Dividend Model</h4>
              <p className="model-subtitle">How trees generate returns while they grow</p>
              
              <div className="dividend-flow">
                <div className="flow-stage">
                  <div className="stage-icon">🌱</div>
                  <span className="stage-name">Growth Phase</span>
                  <span className="stage-detail">Carbon sequestration = credit accrual</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-stage">
                  <div className="stage-icon">📊</div>
                  <span className="stage-name">Verification</span>
                  <span className="stage-detail">Third-party ESG audit</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-stage">
                  <div className="stage-icon">💰</div>
                  <span className="stage-name">Credit Sale</span>
                  <span className="stage-detail">Quarterly dividend distribution</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-stage">
                  <div className="stage-icon">🪵</div>
                  <span className="stage-name">Harvest Value</span>
                  <span className="stage-detail">Mass Timber premium at maturity</span>
                </div>
              </div>

              <div className="model-note">
                <strong>Key Insight:</strong> Unlike traditional timber investments that only 
                return value at harvest, our carbon-integrated model generates quarterly 
                dividends throughout the growth cycle.
              </div>
            </div>

            {/* Investment Opportunities */}
            <div className="investment-opportunities glass-card">
              <h4>Current Opportunities</h4>
              <div className="opportunity-cards">
                <div className="opportunity-card">
                  <span className="opportunity-type">Green Bond</span>
                  <span className="opportunity-name">Pacific Northwest Reforestation Fund</span>
                  <span className="opportunity-yield">5.2% Annual Yield</span>
                  <span className="opportunity-term">10-Year Term</span>
                </div>
                <div className="opportunity-card">
                  <span className="opportunity-type">Carbon Credit Pool</span>
                  <span className="opportunity-name">Verified Carbon Standard (VCS) Portfolio</span>
                  <span className="opportunity-yield">Variable + 8% Floor</span>
                  <span className="opportunity-term">Evergreen</span>
                </div>
                <div className="opportunity-card">
                  <span className="opportunity-type">Mass Timber Future</span>
                  <span className="opportunity-name">CLT Construction Pipeline</span>
                  <span className="opportunity-yield">12-15% Target IRR</span>
                  <span className="opportunity-term">5-Year Horizon</span>
                </div>
              </div>
            </div>
          </div>

          {/* Private Layer: Partner Sign-In */}
          <div className="investor-private">
            <div className="login-module glass-card">
              <div className="login-header">
                <span className="login-badge">🔒 Secure</span>
                <h3>Partner Access</h3>
                <span className="login-subtitle">LP Portal</span>
              </div>

              <p className="login-description">
                Secure access to Real-Time Harvest Data, Carbon Ledgering, 
                and Q4 Yield Reports.
              </p>

              {!showLogin ? (
                <button 
                  className="login-toggle-btn"
                  onClick={() => setShowLogin(true)}
                >
                  Partner Sign In
                </button>
              ) : (
                <form className="login-form" onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="investor-email">Email</label>
                    <input
                      type="email"
                      id="investor-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="partner@company.com"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="investor-password">Password</label>
                    <input
                      type="password"
                      id="investor-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {loginMessage && (
                    <div className="login-message">
                      {loginMessage}
                    </div>
                  )}
                  <button type="submit" className="login-submit-btn">
                    Access Portal
                  </button>
                  <button 
                    type="button" 
                    className="login-cancel-btn"
                    onClick={() => { setShowLogin(false); setLoginMessage(null); }}
                  >
                    Cancel
                  </button>
                </form>
              )}

              <div className="login-footer">
                <p>Not a partner yet?</p>
                <a href="#contact" className="inquiry-link">
                  Request Investment Materials →
                </a>
              </div>
            </div>

            {/* Quick Stats for Partners */}
            <div className="partner-stats glass-card">
              <h4>Q4 2024 Highlights</h4>
              <ul className="stats-list">
                <li>
                  <span className="stat-label">Distribution Date</span>
                  <span className="stat-value">Dec 15, 2024</span>
                </li>
                <li>
                  <span className="stat-label">Carbon Price (VCS)</span>
                  <span className="stat-value">$14.20/tCO₂e</span>
                </li>
                <li>
                  <span className="stat-label">Harvest Volume</span>
                  <span className="stat-value">2.4M BF</span>
                </li>
                <li>
                  <span className="stat-label">ESG Rating</span>
                  <span className="stat-value">AA+</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Certifications & Compliance */}
        <div className="investor-compliance glass-card">
          <h4>Certifications & Compliance</h4>
          <div className="compliance-badges">
            <div className="compliance-item">
              <span className="badge-icon">✓</span>
              <span>SEC Reg D Compliant</span>
            </div>
            <div className="compliance-item">
              <span className="badge-icon">✓</span>
              <span>GRESB Certified</span>
            </div>
            <div className="compliance-item">
              <span className="badge-icon">✓</span>
              <span>UN PRI Signatory</span>
            </div>
            <div className="compliance-item">
              <span className="badge-icon">✓</span>
              <span>Verra VCS Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
