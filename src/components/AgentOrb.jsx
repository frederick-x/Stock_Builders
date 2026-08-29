import React from 'react';

const ORB_THEMES = {
  violet: {
    core1: '#8B5CF6',
    core2: '#06B6D4',
    glow: 'rgba(139, 92, 246, 0.45)',
    ring: '#A855F7',
    eye: '#38BDF8',
  },
  pink: {
    core1: '#EC4899',
    core2: '#8B5CF6',
    glow: 'rgba(236, 72, 153, 0.45)',
    ring: '#F472B6',
    eye: '#FDF4FF',
  },
  cyan: {
    core1: '#06B6D4',
    core2: '#3B82F6',
    glow: 'rgba(6, 182, 212, 0.45)',
    ring: '#22D3EE',
    eye: '#E0F2FE',
  },
  emerald: {
    core1: '#10B981',
    core2: '#06B6D4',
    glow: 'rgba(16, 185, 129, 0.45)',
    ring: '#34D399',
    eye: '#ECFDF5',
  },
  gold: {
    core1: '#F59E0B',
    core2: '#EF4444',
    glow: 'rgba(245, 158, 11, 0.45)',
    ring: '#FBBF24',
    eye: '#FFFBEB',
  },
  purple: {
    core1: '#8B5CF6',
    core2: '#EC4899',
    glow: 'rgba(139, 92, 246, 0.45)',
    ring: '#C084FC',
    eye: '#FAF5FF',
  }
};

export default function AgentOrb({ 
  color = 'violet', 
  size = 'md', 
  isAnimated = true, 
  status = null, 
  pulse = true,
  className = '' 
}) {
  const theme = ORB_THEMES[color] || ORB_THEMES.violet;

  const sizePixels = {
    xs: 28,
    sm: 38,
    md: 52,
    lg: 76,
    xl: 110,
    hero: 160,
  }[size] || 52;

  return (
    <div 
      className={`agent-orb-wrapper size-${size} ${isAnimated ? 'animated' : ''} ${className}`}
      style={{ width: sizePixels, height: sizePixels }}
    >
      <svg 
        viewBox="0 0 100 100" 
        className={`agent-orb-svg ${pulse ? 'orb-pulse' : ''}`}
        style={{ filter: `drop-shadow(0 0 ${sizePixels * 0.25}px ${theme.glow})` }}
      >
        <defs>
          <radialGradient id={`orbGrad-${color}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="25%" stopColor={theme.core1} />
            <stop offset="80%" stopColor={theme.core2} />
            <stop offset="100%" stopColor="#0B0F19" />
          </radialGradient>

          <linearGradient id={`ringGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.ring} stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor={theme.core2} stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Outer Orbital Ring */}
        <ellipse 
          cx="50" 
          cy="50" 
          rx="44" 
          ry="20" 
          fill="none" 
          stroke={`url(#ringGrad-${color})`} 
          strokeWidth="2.5" 
          transform="rotate(-25 50 50)"
          className={isAnimated ? 'orbital-ring-rotate' : ''}
        />

        {/* Core Glowing Orb */}
        <circle cx="50" cy="50" r="34" fill={`url(#orbGrad-${color})`} />

        {/* Secondary Front Orbit Segment */}
        <ellipse 
          cx="50" 
          cy="50" 
          rx="38" 
          ry="14" 
          fill="none" 
          stroke={theme.ring} 
          strokeWidth="1.5" 
          strokeDasharray="4 8"
          transform="rotate(35 50 50)"
          className={isAnimated ? 'orbital-ring-counter' : ''}
        />

        {/* Cute AI Expressive Eyes / Face Nodes */}
        <g className="orb-eyes">
          {/* Left Eye */}
          <ellipse cx="42" cy="46" rx="4" ry="5.5" fill="#FFFFFF" />
          <circle cx="42.5" cy="45.5" r="2.5" fill={theme.core1} />
          <circle cx="44" cy="44" r="1.2" fill="#FFFFFF" />

          {/* Right Eye */}
          <ellipse cx="58" cy="46" rx="4" ry="5.5" fill="#FFFFFF" />
          <circle cx="57.5" cy="45.5" r="2.5" fill={theme.core1} />
          <circle cx="59" cy="44" r="1.2" fill="#FFFFFF" />

          {/* Subtle Cyber Smile / Sensor Arc */}
          <path 
            d="M46 56C48 58 52 58 54 56" 
            stroke="#FFFFFF" 
            strokeWidth="2" 
            strokeLinecap="round" 
            fill="none" 
          />
        </g>

        {/* Top Glint highlight */}
        <ellipse cx="38" cy="28" rx="8" ry="4" fill="#FFFFFF" fillOpacity="0.4" transform="rotate(-30 38 28)" />
      </svg>

      {status && (
        <span className={`orb-status-indicator status-${status.toLowerCase()}`} />
      )}
    </div>
  );
}
