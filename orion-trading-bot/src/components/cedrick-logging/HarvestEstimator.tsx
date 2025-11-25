import { useState } from 'react';

interface HarvestEstimatorProps {
  onClose: () => void;
}

interface EstimatorInputs {
  acreage: number;
  treeType: 'pine' | 'oak' | 'mixed' | 'hardwood';
  standAge: number;
  terrainType: 'flat' | 'moderate' | 'steep';
  accessType: 'road' | 'trail' | 'none';
}

interface EstimatorResults {
  estimatedBoardFeet: number;
  estimatedValue: number;
  harvestTime: string;
  carbonImpact: number;
  replantingCost: number;
  netValue: number;
}

/**
 * Tree yield factors represent typical board feet yield per acre for mature stands.
 * Based on Pacific Northwest regional averages for well-managed timber stands.
 * These values assume:
 * - Optimal stand age (25-40 years depending on species)
 * - Standard stocking density
 * - Site Index class II (medium productivity)
 * 
 * Source: Regional averages from state forestry extension services.
 * Note: Actual yields vary significantly by site conditions, management history,
 * and specific stand characteristics. Professional cruise recommended for accuracy.
 */
const treeYieldFactors: Record<string, number> = {
  pine: 8500,     // Southern/Ponderosa pine, 30-year rotation
  oak: 6200,      // Mixed oak species, 50-year rotation  
  mixed: 7000,    // Mixed conifer-hardwood stands
  hardwood: 5800, // General hardwood species average
};

const terrainModifiers: Record<string, number> = {
  flat: 1.0,
  moderate: 0.85,
  steep: 0.65,
};

/**
 * Average stumpage price per board foot.
 * Based on Pacific Northwest regional averages for mixed species sawtimber.
 * 
 * Note: Timber prices fluctuate significantly based on:
 * - Species (Douglas fir vs pine vs hardwoods)
 * - Grade (select structural vs utility)
 * - Market conditions
 * - Transportation costs
 * 
 * This is an illustrative average for demonstration purposes.
 * Professional appraisal recommended for accurate valuation.
 * Market basis: Regional average as of 2024 Q4.
 */
const pricePerBoardFoot = 0.55;

export default function HarvestEstimator({ onClose }: HarvestEstimatorProps) {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState<EstimatorInputs>({
    acreage: 50,
    treeType: 'pine',
    standAge: 25,
    terrainType: 'moderate',
    accessType: 'road',
  });
  const [results, setResults] = useState<EstimatorResults | null>(null);

  const calculateEstimate = () => {
    const baseYield = treeYieldFactors[inputs.treeType];
    const terrainMod = terrainModifiers[inputs.terrainType];
    const ageFactor = Math.min(inputs.standAge / 30, 1.2); // Peak at 30 years
    const accessMod = inputs.accessType === 'road' ? 1.0 : inputs.accessType === 'trail' ? 0.9 : 0.75;

    const estimatedBoardFeet = Math.round(
      inputs.acreage * baseYield * terrainMod * ageFactor * accessMod
    );
    
    const estimatedValue = estimatedBoardFeet * pricePerBoardFoot;
    const carbonImpact = estimatedBoardFeet * 0.001; // tons CO2
    const replantingCost = inputs.acreage * 350; // $350 per acre for replanting
    const harvestTime = inputs.acreage <= 20 ? '2-4 weeks' : 
                       inputs.acreage <= 100 ? '1-3 months' : '3-6 months';

    setResults({
      estimatedBoardFeet,
      estimatedValue,
      harvestTime,
      carbonImpact,
      replantingCost,
      netValue: estimatedValue - replantingCost,
    });
    setStep(3);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="estimator-overlay">
      <div className="estimator-modal">
        <button className="estimator-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6L18 18M6 18L18 6"/>
          </svg>
        </button>

        <div className="estimator-header">
          <h2 className="estimator-title">
            🌲 Landowner Harvest Estimator
          </h2>
          <p className="estimator-subtitle">
            Get a personalized estimate for your timber harvest potential
          </p>
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-num">1</span>
              <span className="step-label">Land Details</span>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-num">2</span>
              <span className="step-label">Forest Info</span>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <span className="step-num">3</span>
              <span className="step-label">Results</span>
            </div>
          </div>
        </div>

        <div className="estimator-body">
          {step === 1 && (
            <div className="estimator-step">
              <h3>Tell us about your land</h3>
              
              <div className="input-group">
                <label htmlFor="acreage">Total Acreage</label>
                <input
                  type="number"
                  id="acreage"
                  min="1"
                  max="10000"
                  value={inputs.acreage}
                  onChange={(e) => setInputs({...inputs, acreage: Number(e.target.value)})}
                  className="text-input"
                />
                <span className="input-hint">Enter the total forested acres</span>
              </div>

              <div className="input-group">
                <label>Terrain Type</label>
                <div className="radio-group">
                  {(['flat', 'moderate', 'steep'] as const).map((type) => (
                    <label key={type} className="radio-option">
                      <input
                        type="radio"
                        name="terrain"
                        value={type}
                        checked={inputs.terrainType === type}
                        onChange={() => setInputs({...inputs, terrainType: type})}
                      />
                      <span className="radio-label">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>Road Access</label>
                <div className="radio-group">
                  {[
                    { value: 'road', label: 'Existing Road' },
                    { value: 'trail', label: 'Trail Only' },
                    { value: 'none', label: 'No Access' },
                  ].map((option) => (
                    <label key={option.value} className="radio-option">
                      <input
                        type="radio"
                        name="access"
                        value={option.value}
                        checked={inputs.accessType === option.value}
                        onChange={() => setInputs({...inputs, accessType: option.value as typeof inputs.accessType})}
                      />
                      <span className="radio-label">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="estimator-next" onClick={() => setStep(2)}>
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="estimator-step">
              <h3>Forest Information</h3>

              <div className="input-group">
                <label>Primary Tree Species</label>
                <div className="species-grid">
                  {[
                    { value: 'pine', label: 'Pine', icon: '🌲' },
                    { value: 'oak', label: 'Oak', icon: '🌳' },
                    { value: 'mixed', label: 'Mixed Forest', icon: '🌿' },
                    { value: 'hardwood', label: 'Hardwood', icon: '🍂' },
                  ].map((species) => (
                    <button
                      key={species.value}
                      className={`species-option ${inputs.treeType === species.value ? 'selected' : ''}`}
                      onClick={() => setInputs({...inputs, treeType: species.value as typeof inputs.treeType})}
                    >
                      <span className="species-icon">{species.icon}</span>
                      <span className="species-label">{species.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="stand-age">Estimated Stand Age (years)</label>
                <input
                  type="range"
                  id="stand-age"
                  min="10"
                  max="80"
                  value={inputs.standAge}
                  onChange={(e) => setInputs({...inputs, standAge: Number(e.target.value)})}
                  className="range-slider"
                />
                <div className="range-value">{inputs.standAge} years</div>
                <span className="input-hint">Optimal harvest age varies by species (typically 25-40 years)</span>
              </div>

              <div className="button-row">
                <button className="estimator-back" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button className="estimator-calculate" onClick={calculateEstimate}>
                  Calculate Estimate 📊
                </button>
              </div>
            </div>
          )}

          {step === 3 && results && (
            <div className="estimator-step results-step">
              <h3>Your Harvest Estimate</h3>
              
              <div className="results-grid">
                <div className="result-card primary">
                  <span className="result-label">Estimated Board Feet</span>
                  <span className="result-value">{results.estimatedBoardFeet.toLocaleString()}</span>
                  <span className="result-note">Based on current stand conditions</span>
                </div>
                
                <div className="result-card value">
                  <span className="result-label">Gross Timber Value</span>
                  <span className="result-value">{formatCurrency(results.estimatedValue)}</span>
                  <span className="result-note">At current market rates</span>
                </div>

                <div className="result-card net">
                  <span className="result-label">Net Value (after replanting)</span>
                  <span className="result-value">{formatCurrency(results.netValue)}</span>
                  <span className="result-note">Replanting cost: {formatCurrency(results.replantingCost)}</span>
                </div>

                <div className="result-card timeline">
                  <span className="result-label">Estimated Timeline</span>
                  <span className="result-value">{results.harvestTime}</span>
                  <span className="result-note">Weather dependent</span>
                </div>

                <div className="result-card carbon">
                  <span className="result-label">Carbon Impact</span>
                  <span className="result-value">{results.carbonImpact.toFixed(1)} tons CO₂</span>
                  <span className="result-note">Stored in harvested timber</span>
                </div>
              </div>

              <div className="results-cta">
                <p className="cta-text">
                  Ready to discuss your harvest plan? Cedrick personally reviews every project.
                </p>
                <button className="contact-cedrick-btn">
                  Contact Cedrick Thomas
                </button>
                <span className="cta-note">Free consultation • No obligation</span>
              </div>

              <button className="estimator-restart" onClick={() => { setStep(1); setResults(null); }}>
                Start New Estimate
              </button>
            </div>
          )}
        </div>

        <div className="estimator-footer">
          <p className="disclaimer">
            * Estimates are preliminary and based on regional averages. 
            Actual values require on-site assessment. Contact us for a professional evaluation.
          </p>
        </div>
      </div>
    </div>
  );
}
