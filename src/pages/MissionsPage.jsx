import React, { useState } from 'react';
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
  TrendingUp,
  Flame,
  Star,
  Check,
  Trophy
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { DAILY_STREAK_REWARDS } from '../services/gameData';

export default function MissionsPage({ setActiveTab }) {
  const { 
    missions, 
    achievements,
    claimMissionReward, 
    claimAchievement,
    gemBalance, 
    streakDays,
    isStreakClaimedToday,
    claimDailyStreakReward,
    playSound
  } = useGame();

  const [activeTabSub, setActiveTabSub] = useState('daily'); // 'daily' | 'milestones' | 'achievements' | 'streak'

  const dailyMissions = missions.filter(m => m.category === 'daily' || !m.category);
  const milestoneMissions = missions.filter(m => m.category === 'milestone');

  const totalGemsClaimable = missions
    .filter(m => !m.claimed && m.progress >= m.target)
    .reduce((sum, m) => sum + m.rewardGems, 0);

  const totalAchievementsClaimable = achievements
    .filter(a => a.unlocked && !a.claimed)
    .reduce((sum, a) => sum + a.rewardGems, 0);

  return (
    <div className="missions-page-container">
      {/* 1. Hero Quest Banner */}
      <div className="missions-hero-banner">
        <div className="missions-badge-pill">
          <Target size={15} className="text-gold" />
          <span>BOUNTY & QUEST HEADQUARTERS</span>
        </div>

        <h2>Trading Missions & Gem Rewards</h2>
        <p>
          Execute live trades following your AI companion's signals, hit cumulative profit targets, and claim 💎 Premium Nexus Gems & XP to level up your commander rank.
        </p>

        <div className="missions-summary-stats">
          <div className="m-stat-box">
            <span className="m-lbl">CURRENT GEM VAULT</span>
            <div className="m-num text-gold font-mono font-bold">
              <Gem size={18} className="gem-icon-pulse" /> {gemBalance} GEMS
            </div>
          </div>

          <div className="m-stat-box">
            <span className="m-lbl">CLAIMABLE REWARDS</span>
            <div className="m-num text-emerald font-mono font-bold">
              +{totalGemsClaimable + totalAchievementsClaimable} 💎 GEMS READY
            </div>
          </div>

          <button 
            type="button" 
            className="btn-spend-forge"
            onClick={() => { playSound('click'); setActiveTab('forge'); }}
          >
            <Bot size={16} />
            <span>Visit Agent Forge</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* 2. Quest Sub-Navigation Tabs */}
      <div className="quest-sub-nav">
        <button 
          type="button" 
          className={`quest-tab-btn ${activeTabSub === 'daily' ? 'active' : ''}`}
          onClick={() => { playSound('click'); setActiveTabSub('daily'); }}
        >
          <Target size={16} />
          <span>Daily Quests ({dailyMissions.length})</span>
          {dailyMissions.some(m => !m.claimed && m.progress >= m.target) && <span className="alert-dot" />}
        </button>

        <button 
          type="button" 
          className={`quest-tab-btn ${activeTabSub === 'milestones' ? 'active' : ''}`}
          onClick={() => { playSound('click'); setActiveTabSub('milestones'); }}
        >
          <TrendingUp size={16} />
          <span>Campaign Milestones ({milestoneMissions.length})</span>
          {milestoneMissions.some(m => !m.claimed && m.progress >= m.target) && <span className="alert-dot" />}
        </button>

        <button 
          type="button" 
          className={`quest-tab-btn ${activeTabSub === 'achievements' ? 'active' : ''}`}
          onClick={() => { playSound('click'); setActiveTabSub('achievements'); }}
        >
          <Trophy size={16} />
          <span>Prestige Achievements ({achievements.length})</span>
          {achievements.some(a => a.unlocked && !a.claimed) && <span className="alert-dot" />}
        </button>

        <button 
          type="button" 
          className={`quest-tab-btn ${activeTabSub === 'streak' ? 'active' : ''}`}
          onClick={() => { playSound('click'); setActiveTabSub('streak'); }}
        >
          <Flame size={16} />
          <span>7-Day Streak Roadmap</span>
          {!isStreakClaimedToday && <span className="alert-dot" />}
        </button>
      </div>

      {/* 3. Daily & Milestone Quests Content */}
      {(activeTabSub === 'daily' || activeTabSub === 'milestones') && (
        <div className="missions-cards-stack">
          {(activeTabSub === 'daily' ? dailyMissions : milestoneMissions).map((mission) => {
            const isComplete = mission.progress >= mission.target;
            const pct = Math.min(100, Math.round((mission.progress / mission.target) * 100));

            return (
              <div 
                key={mission.id} 
                className={`mission-card-item ${mission.claimed ? 'claimed' : (isComplete ? 'ready-to-claim' : 'in-progress')}`}
              >
                <div className="mission-card-main">
                  <div className="mission-tier-pill font-mono">{mission.tier}</div>

                  <div className="mission-title-row">
                    <span className="mission-title-text">{mission.title}</span>
                    <span className="mission-badge-chip">{mission.badge}</span>
                  </div>

                  <p className="mission-desc-text">{mission.description}</p>

                  {/* Progress Bar */}
                  <div className="mission-progress-block">
                    <div className="progress-labels font-mono text-xs">
                      <span>Progress: {mission.progress} / {mission.target} {mission.unit}</span>
                      <span className="font-bold text-cyan">{pct}%</span>
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
                  <div className="reward-pill-box font-mono">
                    <div className="reward-item-row text-gold font-bold">
                      <Gem size={16} className="text-gold" />
                      <span>+{mission.rewardGems} 💎 GEMS</span>
                    </div>
                    <div className="reward-item-row text-emerald">
                      <Coins size={15} className="text-emerald" />
                      <span>+${mission.rewardCash} CASH</span>
                    </div>
                    <div className="reward-item-row text-cyan">
                      <Sparkles size={14} className="text-cyan" />
                      <span>+{mission.rewardXP || 100} XP</span>
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
                        onClick={() => { playSound('click'); setActiveTab('trading'); }}
                      >
                        <span>Trade in Arena &rarr;</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Achievements Tab Content */}
      {activeTabSub === 'achievements' && (
        <div className="achievements-grid">
          {achievements.map((ach) => (
            <div 
              key={ach.id}
              className={`achievement-card ${ach.claimed ? 'claimed' : (ach.unlocked ? 'unlocked-ready' : 'locked')}`}
            >
              <div className="ach-icon-circle">
                <span>{ach.icon}</span>
              </div>

              <div className="ach-info-col">
                <div className="ach-title-row">
                  <h4>{ach.title}</h4>
                  {ach.claimed ? (
                    <span className="badge-claimed-tag mini"><Check size={12} /> Claimed</span>
                  ) : ach.unlocked ? (
                    <span className="badge-ready-tag mini">Unlocked</span>
                  ) : (
                    <span className="badge-locked-tag mini">Locked</span>
                  )}
                </div>
                <p className="ach-desc">{ach.description}</p>

                <div className="ach-rewards-row font-mono text-xs">
                  <span className="text-gold font-bold">+{ach.rewardGems} 💎 Gems</span>
                  <span className="text-cyan font-bold">+{ach.rewardXP} XP</span>
                </div>

                {ach.unlocked && !ach.claimed && (
                  <button 
                    type="button" 
                    className="btn-claim-ach"
                    onClick={() => claimAchievement(ach.id)}
                  >
                    Claim +{ach.rewardGems} 💎 Bounty
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. 7-Day Streak Calendar Tab */}
      {activeTabSub === 'streak' && (
        <div className="streak-page-panel">
          <div className="streak-hero-sub">
            <Flame size={32} className="text-gold" />
            <div>
              <h3>Daily Operational Login Streak</h3>
              <p>Keep your daily command frequency active to unlock cumulative token grants and apex rewards.</p>
            </div>
          </div>

          <div className="streak-calendar-grid">
            {DAILY_STREAK_REWARDS.map((item) => {
              const isCurrent = item.day === streakDays;
              const isPassed = item.day < streakDays;

              return (
                <div 
                  key={item.day}
                  className={`streak-card-day ${isCurrent ? 'active-today' : (isPassed ? 'claimed-past' : 'locked')}`}
                >
                  <span className="streak-day-badge">DAY {item.day}</span>
                  <div className="streak-icon-box">{item.icon}</div>
                  <h4 className="streak-title-text">{item.title}</h4>

                  <div className="streak-loot-rewards font-mono">
                    <div className="text-gold font-bold">+{item.gems} 💎 GEMS</div>
                    <div className="text-emerald">+${item.cash.toLocaleString()}</div>
                    <div className="text-cyan">+{item.xp} XP</div>
                  </div>

                  {isPassed ? (
                    <span className="day-status-pill claimed">Claimed</span>
                  ) : isCurrent ? (
                    <button 
                      type="button"
                      className="btn-claim-today-pill"
                      disabled={isStreakClaimedToday}
                      onClick={claimDailyStreakReward}
                    >
                      {isStreakClaimedToday ? 'Claimed Today' : 'Claim Reward!'}
                    </button>
                  ) : (
                    <span className="day-status-pill locked">Locked</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
