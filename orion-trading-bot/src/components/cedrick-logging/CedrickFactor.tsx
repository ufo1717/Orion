export default function CedrickFactor() {
  return (
    <section id="about" className="cedrick-factor-section">
      <div className="factor-container">
        <div className="factor-content">
          <span className="section-label">The Cedrick Factor</span>
          <h2 className="section-title">
            Generational Trust
            <br />
            <span className="title-accent">Meets Precision Technology.</span>
          </h2>

          <div className="factor-story">
            <p className="story-lead">
              For over three decades, Cedrick Thomas has been a steward of the land—blending 
              the wisdom of generations with the tools of tomorrow.
            </p>
            <p className="story-body">
              "My grandfather taught me that a forest isn't just timber—it's a living trust 
              we hold for future generations. Today, we use LiDAR, GIS mapping, and precision 
              technology to honor that trust with unprecedented accuracy."
            </p>
            <div className="story-signature">
              <span className="signature-name">— Cedrick Thomas</span>
              <span className="signature-title">Founder & Chief Steward</span>
            </div>
          </div>

          <div className="factor-values">
            <div className="value-item">
              <div className="value-icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <path d="M24 4L28 16H40L30 24L34 36L24 28L14 36L18 24L8 16H20L24 4Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Integrity</h4>
              <p>Every handshake is a contract. Every promise, kept.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2"/>
                  <path d="M24 14V24L30 30" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Long-Term Vision</h4>
              <p>We plan in decades, not quarters.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <svg viewBox="0 0 48 48" fill="none">
                  <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 24H32M24 16V32" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h4>Innovation</h4>
              <p>Embracing technology that serves sustainability.</p>
            </div>
          </div>
        </div>

        {/* Portrait Section */}
        <div className="factor-portrait">
          <div className="portrait-frame">
            {/* High-tech portrait placeholder */}
            <div className="portrait-image">
              <div className="portrait-placeholder">
                <div className="placeholder-icon">
                  <svg viewBox="0 0 96 96" fill="none">
                    {/* Hardhat */}
                    <ellipse cx="48" cy="32" rx="28" ry="16" stroke="currentColor" strokeWidth="2"/>
                    <path d="M20 32C20 32 20 48 24 56C28 64 36 72 48 72C60 72 68 64 72 56C76 48 76 32 76 32" stroke="currentColor" strokeWidth="2"/>
                    {/* Face */}
                    <circle cx="48" cy="48" r="16" stroke="currentColor" strokeWidth="2"/>
                    {/* Safety vest indication */}
                    <path d="M32 72L40 84H56L64 72" stroke="currentColor" strokeWidth="2"/>
                    <path d="M40 76L48 88L56 76" stroke="currentColor" strokeWidth="2"/>
                    {/* Tablet in hand */}
                    <rect x="64" y="60" width="16" height="24" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="66" y1="64" x2="78" y2="64" stroke="currentColor" strokeWidth="1"/>
                    <line x1="66" y1="68" x2="78" y2="68" stroke="currentColor" strokeWidth="1"/>
                    <line x1="66" y1="72" x2="78" y2="72" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                </div>
                <span className="placeholder-text">Cedrick Thomas</span>
                <span className="placeholder-subtext">High-tech safety gear, tablet in hand</span>
              </div>
            </div>
            <div className="portrait-badge">
              <span className="badge-years">30+</span>
              <span className="badge-label">Years of Stewardship</span>
            </div>
          </div>

          {/* Tech Credentials */}
          <div className="tech-credentials">
            <h4>Technology-Forward Leadership</h4>
            <ul className="credential-list">
              <li>
                <span className="cred-icon">🛰️</span>
                <span>Certified Drone Pilot for Forest Surveying</span>
              </li>
              <li>
                <span className="cred-icon">📊</span>
                <span>GIS & LiDAR Data Analysis Specialist</span>
              </li>
              <li>
                <span className="cred-icon">🏆</span>
                <span>SFI Leadership Award Recipient</span>
              </li>
              <li>
                <span className="cred-icon">🌲</span>
                <span>Third-Generation Forestry Professional</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
