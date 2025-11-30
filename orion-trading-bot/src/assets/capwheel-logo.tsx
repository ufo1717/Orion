// CapWheel Logo Component - Stylized "CW" monogram with wheel motif
import React from 'react';

interface CapWheelLogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export const CapWheelLogo: React.FC<CapWheelLogoProps> = ({ 
  size = 48, 
  className = '',
  animated = true 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#F4D03F" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
        <linearGradient id="electricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#0099CC" />
        </linearGradient>
        <filter id="goldGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer wheel ring */}
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke="url(#goldGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#goldGlow)"
        className={animated ? "animate-[spin_20s_linear_infinite]" : ""}
        style={{ transformOrigin: 'center' }}
      />

      {/* Wheel spokes */}
      <g className={animated ? "animate-[spin_30s_linear_infinite_reverse]" : ""} style={{ transformOrigin: 'center' }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={50 + 40 * Math.cos((angle * Math.PI) / 180)}
            y2={50 + 40 * Math.sin((angle * Math.PI) / 180)}
            stroke="url(#goldGradient)"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
      </g>

      {/* Inner circle */}
      <circle
        cx="50"
        cy="50"
        r="35"
        stroke="url(#goldGradient)"
        strokeWidth="1.5"
        fill="rgba(10, 22, 40, 0.9)"
      />

      {/* "C" letter */}
      <path
        d="M35 38 C28 40, 25 48, 25 50 C25 52, 28 60, 35 62 M35 38 L30 38 M35 62 L30 62"
        stroke="url(#goldGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        filter="url(#goldGlow)"
      />

      {/* "W" letter */}
      <path
        d="M45 38 L50 58 L55 45 L60 58 L65 38"
        stroke="url(#goldGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#goldGlow)"
      />

      {/* Electric accent dot */}
      <circle
        cx="75"
        cy="50"
        r="3"
        fill="url(#electricGradient)"
        className={animated ? "animate-pulse" : ""}
      />
    </svg>
  );
};

// Text logo version
export const CapWheelTextLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <CapWheelLogo size={40} />
      <div className="flex flex-col">
        <span className="text-2xl font-bold capwheel-text-gradient tracking-tight">
          CapWheel
        </span>
        <span className="text-xs text-capwheel-electric/80 tracking-widest uppercase">
          Enterprise Trading
        </span>
      </div>
    </div>
  );
};

// Compact logo for headers
export const CapWheelLogoCompact: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <CapWheelLogo size={32} animated={false} />
      <span className="text-xl font-bold capwheel-text-gradient tracking-tight">
        CapWheel
      </span>
    </div>
  );
};

export default CapWheelLogo;
