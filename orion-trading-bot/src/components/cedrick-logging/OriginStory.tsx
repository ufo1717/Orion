import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * The Origin Story - "The Spark"
 * 
 * This page tells the cinematic origin story of Cedrick Thomas,
 * anchored in the Arizona Wallow Fire of 2011. The narrative demonstrates
 * how "conservation isn't about leaving nature alone; it's about giving
 * it the tools to survive."
 */
export default function OriginStory() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    // Cancel any pending animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    // Use requestAnimationFrame for throttled scroll handling
    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = containerRef.current.scrollHeight - windowHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / totalHeight);
      setScrollProgress(progress);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll]);

  // Determine which stage background to show based on scroll progress
  const getStageClass = () => {
    if (scrollProgress < 0.33) return 'stage-fire';
    if (scrollProgress < 0.66) return 'stage-solution';
    return 'stage-future';
  };

  return (
    <section id="origin" className="origin-story-section" ref={containerRef}>
      {/* Parallax Background Layers */}
      <div className={`origin-parallax-bg ${getStageClass()}`}>
        <div className="parallax-layer layer-smoke" style={{ opacity: 1 - scrollProgress }} />
        <div className="parallax-layer layer-forest" style={{ opacity: scrollProgress > 0.33 ? (scrollProgress - 0.33) * 3 : 0 }} />
        <div className="parallax-layer layer-future" style={{ opacity: scrollProgress > 0.66 ? (scrollProgress - 0.66) * 3 : 0 }} />
      </div>

      {/* Section Label */}
      <div className="origin-header glass-card">
        <span className="section-label">The Origin</span>
        <h2 className="section-title">
          The Spark
          <br />
          <span className="title-accent">That Changed Everything.</span>
        </h2>
      </div>

      {/* The Story Content */}
      <div className="origin-content">
        {/* Stage 1: The Fire */}
        <div className="story-stage stage-1">
          <div className="story-card glass-card">
            <span className="stage-marker">2011</span>
            <h3 className="stage-title">The Wallow Fire</h3>
            <p className="story-opening">
              The smoke rose like a wall on the Arizona horizon—538,000 acres of forest, 
              turning to ash. A young Cedrick Thomas stood on a ridge above the Coconino, 
              watching century-old Ponderosa pines explode like matchsticks. But something 
              else caught his eye: a stark line where the inferno simply... stopped.
            </p>
            <p className="story-body">
              On one side of that line lay destruction—the "untouched" wilderness that 
              environmentalists had protected from any human intervention. On the other 
              side stood living trees, their bark scorched but their crowns green. These 
              were the managed stands—forests where foresters had removed the dead wood, 
              thinned the undergrowth, and created defensible space.
            </p>
            <div className="story-quote">
              <blockquote>
                "That day, I understood: conservation isn't about leaving nature alone. 
                It's about giving it the tools to survive."
              </blockquote>
              <cite>— Cedrick Thomas</cite>
            </div>
          </div>
        </div>

        {/* Stage 2: The Solution */}
        <div className="story-stage stage-2">
          <div className="story-card glass-card">
            <span className="stage-marker">The Revelation</span>
            <h3 className="stage-title">Forestry as Firefighting</h3>
            <p className="story-body">
              That ridge became Cedrick's classroom. He studied the difference: the 
              surviving forest wasn't "lucky"—it was prepared. Decades of selective 
              thinning had removed the ladder fuels that carry ground fires into the 
              canopy. Controlled burns had cleared the forest floor. Professional 
              forestry had created resilience.
            </p>
            <p className="story-body">
              The truth was counterintuitive but undeniable: forests that are actively 
              managed—where dead trees are harvested, where density is controlled, where 
              fire breaks are maintained—don't burn catastrophically. They survive.
            </p>
            <div className="insight-card">
              <div className="insight-icon">🔥 → 🌲</div>
              <p>
                <strong>The Science:</strong> Thinned forests reduce fire intensity by 
                up to 60%. The trees we harvest today are the fires we prevent tomorrow.
              </p>
            </div>
          </div>
        </div>

        {/* Stage 3: The Future */}
        <div className="story-stage stage-3">
          <div className="story-card glass-card">
            <span className="stage-marker">Today</span>
            <h3 className="stage-title">The Cedrick Standard</h3>
            <p className="story-body">
              Cedrick returned to the Pacific Northwest with a mission: prove that 
              sustainable forestry and fire resilience are the same thing. Every 
              stand we manage is designed to survive the next century—not just 
              economically, but ecologically.
            </p>
            <div className="future-vision">
              <div className="vision-item">
                <span className="vision-icon">🛰️</span>
                <p>LiDAR mapping identifies fire-risk zones before ignition</p>
              </div>
              <div className="vision-item">
                <span className="vision-icon">🌲</span>
                <p>Precision thinning creates natural firebreaks</p>
              </div>
              <div className="vision-item">
                <span className="vision-icon">🐕</span>
                <p>Barnaby still joins every field survey</p>
              </div>
            </div>
            <p className="story-closing">
              Walk through our managed forests with Cedrick and Barnaby today, and 
              you'll see what survival looks like: healthy stands, diverse understory, 
              and a canopy open enough to resist crown fires. This is forestry as 
              protection. This is the Cedrick Thomas Standard.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <div className="origin-progress">
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="progress-labels">
          <span className={scrollProgress < 0.33 ? 'active' : ''}>The Fire</span>
          <span className={scrollProgress >= 0.33 && scrollProgress < 0.66 ? 'active' : ''}>The Solution</span>
          <span className={scrollProgress >= 0.66 ? 'active' : ''}>The Future</span>
        </div>
      </div>
    </section>
  );
}
