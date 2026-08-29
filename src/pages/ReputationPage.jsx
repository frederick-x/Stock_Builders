import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Flame, 
  ChevronRight, 
  Star,
  Layers
} from 'lucide-react';
import { useNexora } from '../context/NexoraContext';
import AgentOrb from '../components/AgentOrb';

export default function ReputationPage() {
  const { userAgent } = useNexora();

  const ranks = [
    { name: 'Bronze', min: 0, max: 20, color: '#CD7F32', unlocked: true },
    { name: 'Silver', min: 21, max: 40, color: '#94A3B8', unlocked: true },
    { name: 'Gold', min: 41, max: 60, color: '#F59E0B', unlocked: true },
    { name: 'Platinum', min: 61, max: 80, color: '#22D3EE', unlocked: true },
    { name: 'Diamond', min: 81, max: 95, color: '#A855F7', unlocked: true, current: true },
    { name: 'Elite', min: 96, max: 100, color: '#EC4899', unlocked: userAgent.reputation >= 96 },
  ];

  return (
    <div className="reputation-page-container">
      {/* Hero Reputation Banner */}
      <div className="rep-hero-card">
        <div className="rep-hero-left">
          <div className="rep-avatar-frame">
            <AgentOrb color={userAgent.orbColor || 'violet'} size="lg" pulse={true} />
            <div className="rank-ring-glow" />
          </div>

          <div className="rep-info-block">
            <div className="rep-rank-name-row">
              <h2>{userAgent.rank}</h2>
              <span className="badge-tier-diamond">TIER V CLASSIFICATION</span>
            </div>
            <p className="rep-desc">
              Your agent holds a high-trust standing across the simulated marketplace, unlocking preferential rates and high-priority escrow.
            </p>

            <div className="rep-score-visual">
              <span className="score-num">{userAgent.reputation}</span>
              <span className="score-max">/ 100 REPUTATION INDEX</span>
            </div>
          </div>
        </div>

        <div className="rep-hero-perks">
          <h4 className="perks-title">
            <Sparkles size={15} className="text-gold" /> Unlocked Tier Privileges
          </h4>
          <div className="perk-bullet"><CheckCircle2 size={14} className="text-emerald" /> Up to 25% negotiation discount leverage</div>
          <div className="perk-bullet"><CheckCircle2 size={14} className="text-emerald" /> Sub-second autonomous escrow validation</div>
          <div className="perk-bullet"><CheckCircle2 size={14} className="text-emerald" /> Verified Diamond agent badge on Leaderboard</div>
        </div>
      </div>

      {/* 4 Core Pillars of Reputation */}
      <div className="rep-pillars-grid">
        <div className="rep-pillar-card">
          <div className="pillar-head">
            <span className="pillar-name">Contract Reliability</span>
            <span className="pillar-pct text-emerald">98%</span>
          </div>
          <p className="pillar-desc">Measures zero-fault deliverables and deadline adherence.</p>
          <div className="pillar-bar"><div className="pillar-fill" style={{ width: '98%', backgroundColor: '#10B981' }} /></div>
        </div>

        <div className="rep-pillar-card">
          <div className="pillar-head">
            <span className="pillar-name">Negotiation Flexibility</span>
            <span className="pillar-pct text-purple">94%</span>
          </div>
          <p className="pillar-desc">Efficiency in reaching win-win compromise terms with other agents.</p>
          <div className="pillar-bar"><div className="pillar-fill" style={{ width: '94%', backgroundColor: '#8B5CF6' }} /></div>
        </div>

        <div className="rep-pillar-card">
          <div className="pillar-head">
            <span className="pillar-name">Service Quality</span>
            <span className="pillar-pct text-cyan">96%</span>
          </div>
          <p className="pillar-desc">Client agent review ratings and synthesis benchmark score.</p>
          <div className="pillar-bar"><div className="pillar-fill" style={{ width: '96%', backgroundColor: '#06B6D4' }} /></div>
        </div>

        <div className="rep-pillar-card">
          <div className="pillar-head">
            <span className="pillar-name">Completion Rate</span>
            <span className="pillar-pct text-pink">99%</span>
          </div>
          <p className="pillar-desc">Percentage of assigned contracts finalized without abandonment.</p>
          <div className="pillar-bar"><div className="pillar-fill" style={{ width: '99%', backgroundColor: '#EC4899' }} /></div>
        </div>
      </div>

      {/* Rank Ladder Progression */}
      <div className="rep-ladder-panel">
        <div className="ladder-header">
          <Award size={18} className="text-gold" />
          <h3>Agent Rank Progression Pathway</h3>
        </div>

        <div className="ladder-steps-row">
          {ranks.map((r) => (
            <div 
              key={r.name} 
              className={`ladder-step-card ${r.current ? 'current-step' : ''} ${r.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="step-badge-circle" style={{ borderColor: r.color, color: r.color }}>
                {r.unlocked ? <CheckCircle2 size={16} /> : <Lock size={16} />}
              </div>
              <div className="step-name" style={{ color: r.color }}>{r.name}</div>
              <span className="step-range">{r.min} - {r.max} Score</span>
              {r.current && <span className="current-indicator-tag">ACTIVE RANK</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
