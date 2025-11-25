import { useState } from 'react';
import Hero from './Hero';
import ProcessSection from './ProcessSection';
import StewardshipHub from './StewardshipHub';
import CedrickFactor from './CedrickFactor';
import OriginStory from './OriginStory';
import InvestorPortal from './InvestorPortal';
import HarvestEstimator from './HarvestEstimator';
import Footer from './Footer';
import './cedrick-logging.css';

type UserPath = 'landowner' | 'lumber-buyer' | null;

export default function CedrickApp() {
  const [selectedPath, setSelectedPath] = useState<UserPath>(null);
  const [showEstimator, setShowEstimator] = useState(false);

  const handlePathSelect = (path: UserPath) => {
    setSelectedPath(path);
    // Scroll to relevant section
    const section = path === 'landowner' ? 'stewardship' : 'process';
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="cedrick-app">
      {/* Navigation Bar */}
      <nav className="cedrick-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-text">CEDRICK</span>
            <span className="logo-subtext">FORESTRY LOGGING</span>
          </div>
          <div className="nav-links">
            <a href="#hero" className="nav-link">Home</a>
            <a href="#process" className="nav-link">Process</a>
            <a href="#stewardship" className="nav-link">Sustainability</a>
            <a href="#origin" className="nav-link">Our Story</a>
            <a href="#investors" className="nav-link">Investors</a>
            <button
              className="nav-cta"
              onClick={() => setShowEstimator(true)}
            >
              Contact Cedrick
            </button>
          </div>
          <div className="nav-path-indicators">
            {selectedPath && (
              <span className="path-badge">
                {selectedPath === 'landowner' ? '🌲 Landowner' : '🪵 Lumber Buyer'}
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Hero onPathSelect={handlePathSelect} />
        <ProcessSection selectedPath={selectedPath} />
        <StewardshipHub selectedPath={selectedPath} />
        <CedrickFactor />
        <OriginStory />
        <InvestorPortal />
      </main>

      {/* Harvest Estimator Modal */}
      {showEstimator && (
        <HarvestEstimator onClose={() => setShowEstimator(false)} />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
