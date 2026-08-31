import React from 'react';
import { 
  Bot, 
  Gem, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Zap, 
  Award, 
  Star, 
  ArrowRight,
  Sliders,
  Check
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { AGENTS_CATALOG, RARITY_COLORS } from '../services/gameData';
import AgentOrb from '../components/AgentOrb';

export default function AgentForgePage({ setActiveTab }) {
  const { 
    gemBalance, 
    unlockedAgentIds, 
    activeAgentId, 
    unlockAgent, 
    setActiveAgentId 
  } = useGame();

  return (
    <div className="agent-forge-container">
      {/* Hero Banner */}
      <div className="forge-hero-banner">
        <div className="forge-badge-pill">
          <Bot size={15} className="text-cyan" />
          <span>AI AGENT RECRUITMENT FORGE</span>
        </div>
        <h2>Unlock Specialized AI Trading Agents</h2>
        <p>Complete stock trading missions to earn 💎 Premium Nexus Gems. Spend gems here to recruit advanced AI agents with predictive signals, profit multipliers, and crash shields.</p>

        <div className="forge-gem-status-pill">
          <Gem size={18} className="text-gold gem-icon-pulse" />
          <span>Your Premium Vault: <strong className="font-mono text-gold">{gemBalance} 💎 GEMS</strong></span>
          <button 
            type="button" 
            className="btn-earn-gems-link"
            onClick={() => setActiveTab('missions')}
          >
            Earn More Gems in Missions &rarr;
          </button>
        </div>
      </div>

      {/* Agents Catalog Grid */}
      <div className="forge-agents-grid">
        {AGENTS_CATALOG.map((agent) => {
          const isUnlocked = unlockedAgentIds.includes(agent.id);
          const isActive = activeAgentId === agent.id;
          const rarity = RARITY_COLORS[agent.rarity] || RARITY_COLORS.COMMON;
          const canAfford = gemBalance >= agent.unlockCostGems;

          return (
            <div 
              key={agent.id} 
              className={`forge-agent-card ${isActive ? 'active-equipped' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`}
              style={{ borderColor: isActive ? agent.avatarGlow : (isUnlocked ? rarity.border : 'rgba(255, 255, 255, 0.08)') }}
            >
              {/* Card Top Strip */}
              <div className="card-top-strip">
                <span 
                  className="rarity-badge"
                  style={{ backgroundColor: rarity.bg, color: rarity.color, borderColor: rarity.border }}
                >
                  {rarity.label}
                </span>

                {isActive ? (
                  <span className="equipped-badge">
                    <Check size={12} /> ACTIVE ON TRADING FLOOR
                  </span>
                ) : isUnlocked ? (
                  <span className="unlocked-badge">
                    <CheckCircle2 size={12} /> RECRUITED
                  </span>
                ) : (
                  <span className="gem-cost-tag">
                    <Gem size={13} className="text-gold" /> {agent.unlockCostGems} GEMS
                  </span>
                )}
              </div>

              {/* Center Agent Orb Showcase */}
              <div className="forge-orb-showcase">
                <AgentOrb color={agent.orbColor || 'violet'} size="lg" pulse={isActive} />
                <div className="forge-agent-name-row">
                  <h3>{agent.name}</h3>
                  <span className="forge-agent-title">{agent.title}</span>
                </div>
              </div>

              {/* Bio & Core Skill Highlight */}
              <div className="forge-skill-box">
                <div className="skill-title-row">
                  <Zap size={14} className="text-cyan" />
                  <span className="skill-name">{agent.skillName}</span>
                </div>
                <p className="skill-desc">{agent.skillDescription}</p>
              </div>

              {/* Perks List */}
              <div className="forge-perks-list">
                {agent.perks.map((perk, pIdx) => (
                  <div key={pIdx} className="perk-bullet">
                    <CheckCircle2 size={13} className="text-emerald" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              {/* Radar Stats Grid */}
              <div className="agent-radar-stats">
                <div className="r-stat">
                  <span className="r-lbl">Signal Accuracy</span>
                  <div className="r-bar-bg">
                    <div className="r-bar-fill cyan" style={{ width: `${agent.stats.accuracy}%` }} />
                  </div>
                  <span className="r-val font-mono">{agent.stats.accuracy}%</span>
                </div>

                <div className="r-stat">
                  <span className="r-lbl">Profit Multiplier</span>
                  <div className="r-bar-bg">
                    <div className="r-bar-fill gold" style={{ width: `${Math.min(100, agent.stats.profitBonus * 2.5 + 20)}%` }} />
                  </div>
                  <span className="r-val font-mono">+{agent.stats.profitBonus}%</span>
                </div>

                <div className="r-stat">
                  <span className="r-lbl">Crash Shield</span>
                  <div className="r-bar-bg">
                    <div className="r-bar-fill emerald" style={{ width: `${agent.stats.shield}%` }} />
                  </div>
                  <span className="r-val font-mono">{agent.stats.shield}%</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="forge-card-footer">
                {isActive ? (
                  <button type="button" className="btn-equipped-disabled" disabled>
                    Currently Equipped
                  </button>
                ) : isUnlocked ? (
                  <button 
                    type="button" 
                    className="btn-equip-agent"
                    onClick={() => unlockAgent(agent)}
                  >
                    <span>EQUIP {agent.name.toUpperCase()}</span>
                    <ArrowRight size={15} />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className={`btn-unlock-gems ${canAfford ? 'can-afford' : 'cannot-afford'}`}
                    onClick={() => unlockAgent(agent)}
                  >
                    <Gem size={15} />
                    <span>RECRUIT FOR {agent.unlockCostGems} 💎 GEMS</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
