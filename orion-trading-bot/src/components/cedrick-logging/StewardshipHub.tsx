import { useState, useEffect } from 'react';

interface StewardshipHubProps {
  selectedPath: 'landowner' | 'lumber-buyer' | null;
}

export default function StewardshipHub({ selectedPath }: StewardshipHubProps) {
  const [boardFeet, setBoardFeet] = useState(1000);
  const [carbonStored, setCarbonStored] = useState(0);

  // Carbon calculation: ~1 ton CO2 per 1,000 board feet
  useEffect(() => {
    const co2PerBoardFoot = 0.001; // tons CO2 per board foot
    setCarbonStored(boardFeet * co2PerBoardFoot);
  }, [boardFeet]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <section id="stewardship" className="stewardship-section">
      {/* Blue Sky Header */}
      <div className="stewardship-header">
        <div className="sky-imagery"></div>
        <div className="header-content">
          <span className="section-label">Environmental Stewardship</span>
          <h2 className="section-title">
            We are Stewards First,
            <br />
            <span className="title-accent">Loggers Second.</span>
          </h2>
          <p className="section-description">
            Sustainable forestry isn't just a buzzword—it's our founding principle. 
            Every decision we make prioritizes the long-term health of our forests 
            and the communities that depend on them.
          </p>
        </div>
      </div>

      {selectedPath === 'landowner' && (
        <div className="landowner-highlight">
          <span className="highlight-badge">For Landowners</span>
          <p>We treat your land as if it were our own—because your trust is our most valuable asset.</p>
        </div>
      )}

      {/* Carbon Calculator Widget */}
      <div className="carbon-calculator">
        <div className="calculator-header">
          <h3 className="calculator-title">
            <span className="calc-icon">🌍</span>
            Live Carbon Calculator
          </h3>
          <p className="calculator-subtitle">
            See how much CO₂ is stored in your timber investment
          </p>
        </div>

        <div className="calculator-body">
          <div className="input-group">
            <label htmlFor="board-feet">Board Feet</label>
            <input
              type="range"
              id="board-feet"
              min="100"
              max="100000"
              step="100"
              value={boardFeet}
              onChange={(e) => setBoardFeet(Number(e.target.value))}
              className="range-slider"
            />
            <div className="input-value">
              <span className="value-number">{boardFeet.toLocaleString()}</span>
              <span className="value-label">board feet</span>
            </div>
          </div>

          <div className="calculator-result">
            <div className="result-icon">
              <svg viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2"/>
                <path d="M32 16C24 16 16 24 16 32C16 40 24 48 32 48" stroke="currentColor" strokeWidth="2"/>
                <path d="M32 16V32H48" stroke="currentColor" strokeWidth="2"/>
                <circle cx="32" cy="32" r="4" fill="currentColor"/>
              </svg>
            </div>
            <div className="result-content">
              <span className="result-value">{formatNumber(carbonStored)}</span>
              <span className="result-unit">tons CO₂ stored</span>
              <span className="result-equivalent">
                ≈ {Math.round(carbonStored * 2.4).toLocaleString()} trees planted equivalent
              </span>
            </div>
          </div>

          <div className="calculator-facts">
            <div className="fact-item">
              <span className="fact-icon">🌲</span>
              <span className="fact-text">Wood products continue storing carbon for their entire lifespan</span>
            </div>
            <div className="fact-item">
              <span className="fact-icon">🏗️</span>
              <span className="fact-text">Mass Timber construction can be carbon-negative</span>
            </div>
            <div className="fact-item">
              <span className="fact-icon">♻️</span>
              <span className="fact-text">Sustainable harvests promote new growth and carbon capture</span>
            </div>
          </div>
        </div>
      </div>

      {/* ESG Metrics */}
      <div className="esg-metrics">
        <h3 className="metrics-title">Our Environmental Impact</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-value">2.4M</span>
            <span className="metric-label">Trees Planted</span>
            <span className="metric-period">Since 2015</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">98%</span>
            <span className="metric-label">Material Utilization</span>
            <span className="metric-period">Zero-waste goal</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">15K</span>
            <span className="metric-label">Acres Managed</span>
            <span className="metric-period">Sustainably</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">45%</span>
            <span className="metric-label">Carbon Reduction</span>
            <span className="metric-period">vs. 2010 baseline</span>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="certifications">
        <h4 className="cert-title">Certified & Verified</h4>
        <div className="cert-badges">
          <div className="cert-badge">
            <div className="badge-icon sfi">SFI</div>
            <span className="badge-label">Sustainable Forestry Initiative</span>
          </div>
          <div className="cert-badge">
            <div className="badge-icon pefc">PEFC</div>
            <span className="badge-label">Programme for the Endorsement of Forest Certification</span>
          </div>
          <div className="cert-badge">
            <div className="badge-icon fsc">FSC</div>
            <span className="badge-label">Forest Stewardship Council</span>
          </div>
        </div>
      </div>
    </section>
  );
}
