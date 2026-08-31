import React from 'react';

export default function NexoraLogo({ size = 36, showText = true, tagline = true, className = '' }) {
  return (
    <div className={`nexora-logo-container ${className}`}>
      <div className="logo-icon-wrapper" style={{ width: size, height: size }}>
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="logo-svg"
        >
          <defs>
            <linearGradient id="nodeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <linearGradient id="nodeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Connected Energy Beam (Agent-to-Agent Protocol) */}
          <path 
            d="M14 24C19 19 29 29 34 24" 
            stroke="url(#beamGrad)" 
            strokeWidth="3.5" 
            strokeLinecap="round"
            filter="url(#logoGlow)"
          />
          <path 
            d="M14 24C19 29 29 19 34 24" 
            stroke="url(#beamGrad)" 
            strokeWidth="2" 
            strokeDasharray="2 3"
            strokeLinecap="round"
          />

          {/* Node 1: Primary Agent */}
          <circle cx="14" cy="24" r="8" fill="url(#nodeGrad1)" filter="url(#logoGlow)" />
          <circle cx="14" cy="24" r="4" fill="#FFFFFF" fillOpacity="0.9" />
          <circle cx="12.5" cy="22.5" r="1.5" fill="#FFFFFF" />

          {/* Node 2: Target Agent */}
          <circle cx="34" cy="24" r="8" fill="url(#nodeGrad2)" filter="url(#logoGlow)" />
          <circle cx="34" cy="24" r="4" fill="#FFFFFF" fillOpacity="0.9" />
          <circle cx="32.5" cy="22.5" r="1.5" fill="#FFFFFF" />

          {/* Center Protocol Spark */}
          <circle cx="24" cy="24" r="2.5" fill="#FBBF24" filter="url(#logoGlow)" />
        </svg>
      </div>

      {showText && (
        <div className="logo-text-block">
          <div className="logo-brand-title">NEXORA</div>
          {tagline && <span className="logo-brand-sub">Let your agent do the work.</span>}
        </div>
      )}
    </div>
  );
}
