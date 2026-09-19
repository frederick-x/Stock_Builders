import React, { useState } from 'react';
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
  Check,
  TrendingUp,
  BrainCircuit,
  Flame,
  ChevronRight
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { RARITY_COLORS } from '../services/gameData';
import AgentOrb from '../components/AgentOrb';

export default function AgentForgePage({ setActiveTab }) {
  const { 
    gemBalance, 
    agentsCatalog,
    unlockedAgentIds, 
    activeAgentId, 
    unlockAgent, 
    trainCompanion,
    setActiveAgentId,
    playSound 
  } = useGame();

  const [selectedAgentForDetail, setSelectedAgentForDetail] = useState(null);

  return (
    <div className="agent-forge-container">
      {/* 1. Hero Forge Banner */}
      <div className="forge-hero-banner">
        <div className="forge-badge-pill">
          <BrainCircuit size={15} className="text-cyan" />
          <span>AI COMPANION FORGE & SKILL MATRIX</span>
        </div>

        <h2>Recruit & Train AI Trading Companions</h2>
        <p>
          Unlock autonomous neural co-pilots with specialized market abilities. Train them to level up their signal accuracy, profit multipliers, and crash shields.
        </p>

        <div className="forge-vault-counter">
          <div className="vault-gem-pill">
            <Gem size={18} className="text-gold gem-icon-pulse" />
            <span>Vault Reserve: <strong className="font-mono text-gold font-bold">{gemBalance} 💎 GEMS</strong></span>
          </div>

          <button 
            type="button" 
            className="btn-earn-gems-link"
            onClick={() => { playSound('click'); setActiveTab('missions'); }}
          >
            <span>Earn More 💎 Gems in Quests</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 2. Agents Grid */}
      <div className="forge-agents-grid">
        {agentsCatalog.map((agent) => {
          const isUnlocked = unlockedAgentIds.includes(agent.id);
          const isActive = activeAgentId === agent.id;
          const rarity = RARITY_COLORS[agent.rarity] || RARITY_COLORS.COMMON;
          const canAffordUnlock = gemBalance >= agent.unlockCostGems;
          const canAffordTrain = gemBalance >= (agent.trainCostGems || 20);

          return (
            <div 
              key={agent.id} 
              className={`forge-companion-card ${isActive ? 'active-equipped' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`}
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
                    <Check size={12} /> ACTIVE CO-PILOT
                  </span>
                ) : isUnlocked ? (
                  <span className="unlocked-badge">
                    <CheckCircle2 size={12} /> RECRUITED
                  </span>
                ) : (
                  <span className="gem-cost-tag font-mono font-bold">
                    <Gem size={13} className="text-gold" /> {agent.unlockCostGems} GEMS
                  </span>
                )}
              </div>

              {/* Center Agent Orb Showcase */}
              <div className="companion-orb-showcase">
                <div className="orb-frame-wrap">
                  <AgentOrb color={agent.orbColor || 'violet'} size="lg" pulse={isActive} />
                  {isUnlocked && (
                    <span className="comp-card-lvl-badge font-mono">
                      LVL {agent.level || 1} / 10
                    </span>
                  )}
                </div>

                <div className="companion-name-col">
                  <h3>{agent.name}</h3>
                  <span className="companion-title-tag">{agent.title}</span>
                  <span className="companion-spec-text text-cyan">{agent.specialty}</span>
                </div>
              </div>

              {/* Companion Bio & Skill */}
              <div className="companion-skill-box">
                <div className="skill-title-row">
                  <Zap size={14} className="text-gold" />
                  <span className="skill-name font-bold">{agent.skillName}</span>
                </div>
                <p className="skill-desc">{agent.skillDescription}</p>
              </div>

              {/* Radar Stats */}
              <div className="companion-stats-bars font-mono text-xs">
                <div className="c-stat-row">
                  <span className="lbl">Signal Accuracy</span>
                  <div className="bar-track">
                    <div className="bar-fill cyan" style={{ width: `${agent.stats.accuracy}%` }} />
                  </div>
                  <span className="val text-cyan font-bold">{agent.stats.accuracy}%</span>
                </div>

                <div className="c-stat-row">
                  <span className="lbl">Profit Multiplier</span>
                  <div className="bar-track">
                    <div className="bar-fill gold" style={{ width: `${Math.min(100, agent.stats.profitBonus * 2.2 + 20)}%` }} />
                  </div>
                  <span className="val text-gold font-bold">+{agent.stats.profitBonus}%</span>
                </div>

                <div className="c-stat-row">
                  <span className="lbl">Crash Shield</span>
                  <div className="bar-track">
                    <div className="bar-fill emerald" style={{ width: `${agent.stats.shield}%` }} />
                  </div>
                  <span className="val text-emerald font-bold">{agent.stats.shield}%</span>
                </div>
              </div>

              {/* Skill Tree Matrix Preview */}
              {agent.skillTree && (
                <div className="skill-tree-preview-box">
                  <span className="tree-lbl">UNLOCKABLE ABILITIES:</span>
                  <div className="tree-perks-list">
                    {agent.skillTree.map((perk, pIdx) => {
                      const isPerkUnlocked = isUnlocked && (agent.level || 1) >= perk.levelReq;
                      return (
                        <div key={pIdx} className={`perk-node-item ${isPerkUnlocked ? 'unlocked' : 'locked'}`}>
                          <span className="perk-lvl-tag font-mono">Lv {perk.levelReq}</span>
                          <span className="perk-name font-bold">{perk.name}:</span>
                          <span className="perk-desc text-dim">{perk.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="forge-card-footer">
                {isActive ? (
                  <div className="equipped-actions-split">
                    <button type="button" className="btn-equipped-disabled" disabled>
                      Currently Equipped
                    </button>
                    {agent.level < 10 && (
                      <button 
                        type="button" 
                        className={`btn-train-companion ${canAffordTrain ? 'can-train' : 'cannot-train'}`}
                        onClick={() => trainCompanion(agent.id)}
                        title={`Train to Level ${agent.level + 1} for ${agent.trainCostGems || 20} Gems`}
                      >
                        <Flame size={14} className="text-gold" />
                        <span>TRAIN (LVL {agent.level + 1})</span>
                      </button>
                    )}
                  </div>
                ) : isUnlocked ? (
                  <div className="equipped-actions-split">
                    <button 
                      type="button" 
                      className="btn-equip-agent"
                      onClick={() => unlockAgent(agent)}
                    >
                      <span>EQUIP CO-PILOT</span>
                      <ArrowRight size={14} />
                    </button>
                    {agent.level < 10 && (
                      <button 
                        type="button" 
                        className={`btn-train-companion ${canAffordTrain ? 'can-train' : 'cannot-train'}`}
                        onClick={() => trainCompanion(agent.id)}
                      >
                        <Flame size={14} className="text-gold" />
                        <span>TRAIN ({agent.trainCostGems || 20}💎)</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <button 
                    type="button" 
                    className={`btn-unlock-gems ${canAffordUnlock ? 'can-afford' : 'cannot-afford'}`}
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
