import React from 'react';
import { 
  Target, 
  Gem, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  ArrowRight, 
  Bot, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function MissionsPage({ setActiveTab }) {
  const { missions, claimMissionReward, gemBalance } = useGame();

  const totalGemsClaimable = missions
    .filter(m => !m.claimed && m.progress >= m.target)
    .reduce((sum, m) => sum + m.rewardGems, 0);

  return (
    <div className="missions-page-container">
      {/* Top Banner */}
      <div className="missions-hero-banner">
        <div className="missions-badge-pill">
          <Target size={15} className="text-gold" />
          <span>MISSION REWARD CENTER</span>
        </div>
        <h2>Trading Missions & Gem Rewards</h2>
        <p>Follow your AI agent's decision signals on the Trading Floor, achieve milestones, and claim 💎 Premium Nexus Gems to unlock high-tier agents in the Forge.</p>

        <div className="missions-summary-stats">
          <div className="m-stat-box">
            <span className="m-lbl">Current Gem Balance</span>
            <div className="m-num text-gold font-mono font-bold">
              <Gem size={18} className="gem-icon-pulse" /> {gemBalance} GEMS
            </div>
          </div>

          <div className="m-stat-box">
            <span className="m-lbl">Pending Claimable</span>
            <div className="m-num text-emerald font-mono font-bold">
              +{totalGemsClaimable} 💎 GEMS READY
            </div>
          </div>

          <button 
            type="button" 
            className="btn-spend-forge"
            onClick={() => setActiveTab('forge')}
          >
            <Bot size={16} />
            <span>Visit Agent Forge</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Missions List */}
      <div className="missions-cards-stack">
        {missions.map((mission) => {
          const isComplete = mission.progress >= mission.target;
          const pct = Math.min(100, Math.round((mission.progress / mission.target) * 100));

          return (
            <div 
              key={mission.id} 
              className={`mission-card-item ${mission.claimed ? 'claimed' : (isComplete ? 'ready-to-claim' : 'in-progress')}`}
            >
              <div className="mission-card-main">
                <div className="mission-tier-pill">{mission.tier}</div>

                <div className="mission-title-row">
                  <span className="mission-title-text">{mission.title}</span>
                  <span className="mission-badge-chip">{mission.badge}</span>
                </div>

                <p className="mission-desc-text">{mission.description}</p>

                {/* Progress Bar */}
                <div className="mission-progress-block">
                  <div className="progress-labels">
                    <span>Progress: {mission.progress} / {mission.target} {mission.unit}</span>
                    <span className="font-mono">{pct}%</span>
                  </div>
                  <div className="mission-bar-track">
                    <div 
                      className={`mission-bar-fill ${isComplete ? 'complete' : ''}`}
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Right: Rewards & Claim Action */}
              <div className="mission-card-side">
                <div className="reward-pill-box">
                  <div className="reward-item-row text-gold font-mono font-bold">
                    <Gem size={16} className="text-gold" />
                    <span>+{mission.rewardGems} 💎 GEMS</span>
                  </div>
                  <div className="reward-item-row text-emerald font-mono">
                    <Coins size={15} className="text-emerald" />
                    <span>+${mission.rewardCash} CASH</span>
                  </div>
                </div>

                <div className="claim-action-wrap">
                  {mission.claimed ? (
                    <span className="badge-claimed-tag">
                      <CheckCircle2 size={15} /> CLAIMED
                    </span>
                  ) : isComplete ? (
                    <button 
                      type="button" 
                      className="btn-claim-gems"
                      onClick={() => claimMissionReward(mission.id)}
                    >
                      <Sparkles size={16} />
                      <span>CLAIM REWARD</span>
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      className="btn-trade-to-complete"
                      onClick={() => setActiveTab('trading')}
                    >
                      <span>Trade on Floor &rarr;</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
