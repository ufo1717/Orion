interface ProcessSectionProps {
  selectedPath: 'landowner' | 'lumber-buyer' | null;
}

const processStages = [
  {
    id: 'seedling',
    title: 'Seedling',
    subtitle: 'Forest Regeneration',
    description: 'Every great forest begins with a single seedling. Our regeneration programs ensure sustainable growth for generations.',
    icon: '🌱',
    techNote: 'Soil analysis & species selection',
  },
  {
    id: 'precision-forestry',
    title: 'Precision Forestry',
    subtitle: 'LiDAR & GIS Mapping',
    description: 'We deploy drone-based LiDAR scanning and GIS mapping to create detailed 3D models of every stand. No guesswork—just data-driven decisions.',
    icon: '🛰️',
    techNote: 'Sub-meter accuracy mapping',
    highlight: true,
  },
  {
    id: 'sustainable-harvest',
    title: 'Sustainable Harvest',
    subtitle: 'Selective Cutting',
    description: 'Our certified foresters use precision cutting techniques that protect wildlife corridors, watersheds, and forest biodiversity.',
    icon: '🪓',
    techNote: 'FSC & SFI certified practices',
  },
  {
    id: 'sawmill',
    title: 'Sawmill Processing',
    subtitle: 'Quality Milling',
    description: 'State-of-the-art sawmill operations maximize yield and minimize waste. Every board is graded to exacting standards.',
    icon: '🏭',
    techNote: '98% material utilization',
  },
  {
    id: 'mass-timber',
    title: 'Mass Timber Product',
    subtitle: 'CLT & Glulam',
    description: 'Cross-Laminated Timber (CLT) and Glulam beams for modern, sustainable construction. Building the future from the forest.',
    icon: '🏗️',
    techNote: 'Carbon-negative building material',
    highlight: true,
  },
];

export default function ProcessSection({ selectedPath }: ProcessSectionProps) {
  return (
    <section id="process" className="process-section">
      <div className="process-header">
        <span className="section-label">Our Lifecycle Approach</span>
        <h2 className="section-title">
          Vertical Integration.
          <br />
          <span className="title-accent">From Forest Floor to Finished Product.</span>
        </h2>
        <p className="section-description">
          We control every step of the timber journey, ensuring quality, sustainability, 
          and traceability from seedling to Mass Timber product.
        </p>
        {selectedPath === 'lumber-buyer' && (
          <div className="buyer-highlight">
            <span className="highlight-badge">For Lumber Buyers</span>
            <p>Our vertical integration means complete supply chain transparency and consistent quality.</p>
          </div>
        )}
      </div>

      {/* Horizontal Scroll Lifecycle Flow */}
      <div className="lifecycle-container">
        <div className="lifecycle-scroll">
          {processStages.map((stage, index) => (
            <div
              key={stage.id}
              className={`lifecycle-stage ${stage.highlight ? 'stage-highlighted' : ''}`}
            >
              <div className="stage-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="stage-icon">{stage.icon}</div>
              <h3 className="stage-title">{stage.title}</h3>
              <span className="stage-subtitle">{stage.subtitle}</span>
              <p className="stage-description">{stage.description}</p>
              <div className="stage-tech">
                <span className="tech-label">Tech Highlight:</span>
                <span className="tech-note">{stage.techNote}</span>
              </div>
              {index < processStages.length - 1 && (
                <div className="stage-connector">
                  <svg viewBox="0 0 48 24" fill="none">
                    <path d="M0 12H40M32 4L44 12L32 20" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Scroll Hint */}
        <div className="scroll-hint">
          <span>Scroll to explore →</span>
        </div>
      </div>

      {/* Tech Callout */}
      <div className="tech-callout">
        <div className="callout-icon">
          <svg viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2"/>
            <path d="M24 12V24L32 28" stroke="currentColor" strokeWidth="2"/>
            <circle cx="24" cy="24" r="4" fill="currentColor"/>
          </svg>
        </div>
        <div className="callout-content">
          <h4>Precision Technology at Every Stage</h4>
          <p>
            Our investment in <strong>GIS Mapping</strong> and <strong>Drone LiDAR</strong> technology 
            enables us to plan harvests with unprecedented accuracy, minimizing environmental impact 
            while maximizing sustainable yield.
          </p>
        </div>
      </div>
    </section>
  );
}
