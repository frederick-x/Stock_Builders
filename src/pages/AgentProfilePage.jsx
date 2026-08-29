import React from 'react';
import { 
  ArrowLeft, 
  MessageSquareCode, 
  Award, 
  Coins, 
  CheckCircle2, 
  Star, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Flame, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNexora } from '../context/NexoraContext';
import AgentOrb from '../components/AgentOrb';

export default function AgentProfilePage({ agent, setActivePage }) {
  const { userAgent, startNegotiationWith } = useNexora();

  if (!agent) {
    return (
      <div className="empty-state-panel">
        <p>No agent selected.</p>
        <button type="button" className="btn-secondary" onClick={() => setActivePage('market')}>
          Return to Marketplace
        </button>
      </div>
    );
  }

  const handleStartNegotiate = () => {
    startNegotiationWith(agent);
    setActivePage('negotiation');
  };

  return (
    <div className="agent-profile-container">
      {/* Back Button */}
      <button 
        type="button" 
        className="btn-back-link"
        onClick={() => setActivePage('market')}
      >
        <ArrowLeft size={16} />
        <span>Back to Agent Market</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="profile-hero-card">
        <div className="profile-hero-left">
          <div className="profile-avatar-box">
            <AgentOrb color={agent.orbColor || 'pink'} size="xl" pulse={true} />
            <span className="profile-status-badge">ONLINE &bull; READY TO NEGOTIATE</span>
          </div>

          <div className="profile-hero-info">
            <div className="profile-name-row">
              <h2>{agent.name}</h2>
              <span className="profile-rank-tag">{agent.rank}</span>
              <span className="profile-category-tag">{agent.category}</span>
            </div>
            <div className="profile-title-text">{agent.title}</div>
            <p className="profile-bio-text">{agent.bio}</p>

            <div className="profile-quick-stats">
              <div className="p-stat">
                <Coins size={15} className="text-gold" />
                <span>Base Price: <strong>{agent.basePrice} V-Tokens</strong></span>
              </div>
              <div className="p-stat">
                <Award size={15} className="text-cyan" />
                <span>Reputation: <strong>{agent.reputation}%</strong></span>
              </div>
              <div className="p-stat">
                <Clock size={15} className="text-emerald" />
                <span>Response Speed: <strong>{agent.responseTime}</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-hero-action">
          <button 
            type="button" 
            className="btn-profile-negotiate-hero"
            onClick={handleStartNegotiate}
          >
            <MessageSquareCode size={18} />
            <span>ASK {userAgent.name} TO NEGOTIATE</span>
            <ArrowRight size={16} />
          </button>
          <span className="negotiate-sub-hint">
            {userAgent.name} will autonomously negotiate terms based on your {userAgent.behavior.toLowerCase()} protocol.
          </span>
        </div>
      </div>

      {/* Two Column Grid: Personality & Services */}
      <div className="profile-content-grid">
        {/* Left: Behavioral Matrix */}
        <div className="profile-panel-card">
          <div className="panel-title-wrap">
            <Zap size={18} className="text-purple" />
            <h3>Personality & Behavioral Profile</h3>
          </div>

          <div className="traits-progress-list">
            <div className="trait-item">
              <div className="trait-header">
                <span>Creativity & Synthesis</span>
                <span className="trait-val">{agent.traits?.creativity || 95}%</span>
              </div>
              <div className="trait-bar-bg">
                <div className="trait-bar-fill pink" style={{ width: `${agent.traits?.creativity || 95}%` }} />
              </div>
            </div>

            <div className="trait-item">
              <div className="trait-header">
                <span>Negotiation Flexibility</span>
                <span className="trait-val">{agent.traits?.negotiation || 88}%</span>
              </div>
              <div className="trait-bar-bg">
                <div className="trait-bar-fill purple" style={{ width: `${agent.traits?.negotiation || 88}%` }} />
              </div>
            </div>

            <div className="trait-item">
              <div className="trait-header">
                <span>Contract Reliability</span>
                <span className="trait-val">{agent.traits?.reliability || 98}%</span>
              </div>
              <div className="trait-bar-bg">
                <div className="trait-bar-fill cyan" style={{ width: `${agent.traits?.reliability || 98}%` }} />
              </div>
            </div>

            <div className="trait-item">
              <div className="trait-header">
                <span>Risk Tolerance</span>
                <span className="trait-val">{agent.traits?.risk || 30}%</span>
              </div>
              <div className="trait-bar-bg">
                <div className="trait-bar-fill gold" style={{ width: `${agent.traits?.risk || 30}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Skills & Review */}
        <div className="profile-panel-card">
          <div className="panel-title-wrap">
            <ShieldCheck size={18} className="text-emerald" />
            <h3>Verified Deliverable Capabilities</h3>
          </div>

          <div className="profile-skills-tags">
            {agent.skills.map((skill) => (
              <span key={skill} className="profile-skill-badge">
                <CheckCircle2 size={13} className="text-emerald" />
                <span>{skill}</span>
              </span>
            ))}
          </div>

          <div className="verified-review-box">
            <div className="review-head">
              <Star size={14} className="text-gold" fill="#F59E0B" />
              <span>Latest Verified Contract Review</span>
            </div>
            <p className="review-quote">"{agent.recentReview}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
