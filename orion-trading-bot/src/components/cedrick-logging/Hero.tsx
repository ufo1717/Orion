interface HeroProps {
  onPathSelect: (path: 'landowner' | 'lumber-buyer') => void;
}

export default function Hero({ onPathSelect }: HeroProps) {
  return (
    <section id="hero" className="hero-section">
      {/* Video Background Placeholder */}
      <div className="hero-video-bg">
        <div className="video-overlay"></div>
        {/* Blue sky gradient at top for environmental health signal */}
        <div className="sky-gradient"></div>
        <div className="video-placeholder">
          <div className="drone-animation">
            {/* Simulated drone footage animation */}
            <div className="canopy-layer layer-1"></div>
            <div className="canopy-layer layer-2"></div>
            <div className="canopy-layer layer-3"></div>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-tagline-wrapper">
          <span className="hero-pre-tagline">Precision Forestry. Sustainable Growth.</span>
          <h1 className="hero-h1">
            From Seedling to Solution.
            <br />
            <span className="hero-h1-accent">The Cedrick Thomas Standard.</span>
          </h1>
          <p className="hero-subtitle">
            Generational stewardship meets cutting-edge technology. 
            We're building the future of sustainable timber with GIS precision,
            LiDAR mapping, and Mass Timber innovation.
          </p>
        </div>

        {/* Split-Path Navigation */}
        <div className="split-path-nav">
          <h2 className="split-path-title">How Can We Serve You?</h2>
          <div className="path-buttons">
            {/* Landowner Path */}
            <button
              className="path-button landowner-path"
              onClick={() => onPathSelect('landowner')}
            >
              <div className="path-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 8L8 28V56H24V40H40V56H56V28L32 8Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M20 56V48C20 44 24 40 32 40C40 40 44 44 44 48V56" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="32" cy="28" r="8" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="path-title">I Own Land</h3>
              <p className="path-description">
                Discover sustainable harvest options that maximize your land's value 
                while preserving its legacy for future generations.
              </p>
              <div className="path-features">
                <span className="feature-tag">Stewardship First</span>
                <span className="feature-tag">Fair Profit</span>
                <span className="feature-tag">GIS Planning</span>
              </div>
              <span className="path-cta">Explore Landowner Services →</span>
            </button>

            {/* Lumber Buyer Path */}
            <button
              className="path-button buyer-path"
              onClick={() => onPathSelect('lumber-buyer')}
            >
              <div className="path-icon">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="24" width="48" height="32" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 32H56" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 40H56" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 48H56" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 8L32 20L44 8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M32 8V20" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="path-title">I Buy Lumber</h3>
              <p className="path-description">
                Access premium, sustainably-sourced timber and Mass Timber products 
                including CLT for modern construction projects.
              </p>
              <div className="path-features">
                <span className="feature-tag">Mass Timber/CLT</span>
                <span className="feature-tag">Certified Supply</span>
                <span className="feature-tag">Precision Quality</span>
              </div>
              <span className="path-cta">View Product Catalog →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <span>Discover Our Process</span>
        <div className="scroll-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
