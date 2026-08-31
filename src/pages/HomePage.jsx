import React from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  ArrowRight, 
  Sparkles, 
  Coins, 
  Award, 
  Target, 
  Activity, 
  CheckCircle2, 
  Store, 
  MessageSquareCode, 
  Trophy, 
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useNexora } from '../context/NexoraContext';
import AgentOrb from '../components/AgentOrb';

export default function HomePage({ setActivePage }) {
  const { 
    userAgent, 
    tokenBalance, 
    tokensEarned,
    currentGoal, 
    isAutonomousRunning, 
    agentStage, 
    agentThought, 
    selectedTargetAgent,
    startAutonomous, 
    pauseAutonomous, 
    resumeAutonomous, 
    stopAutonomous,
    missions,
    claimMissionReward,
    activityLog,
    setIsDemoModeActive
  } = useNexora();

  return (
    <div className="home-page-container">
      {/* Top Welcome / Hero Banner */}
      <section className="home-hero-card">
        <div className="hero-card-left">
          <div className="hero-agent-avatar-wrap">
            <AgentOrb color={userAgent.orbColor || 'violet'} size="xl" pulse={isAutonomousRunning} />
            <span className={`hero-agent-status-tag ${isAutonomousRunning ? 'tag-live' : 'tag-standby'}`}>
              <span className="dot" /> {isAutonomousRunning ? 'AUTONOMOUS ACTIVE' : 'STANDBY'}
            </span>
          </div>

          <div className="hero-agent-details">
            <div className="hero-title-row">
              <h2>{userAgent.name}</h2>
              <span className="badge-rank-hero">{userAgent.rank}</span>
              <span className="badge-behavior-hero">{userAgent.behavior} PROTOCOL</span>
            </div>

            <div className="hero-goal-box">
              <div className="goal-label-row">
                <span className="goal-label">
                  <Target size={14} className="text-cyan" /> CURRENT ACTIVE GOAL
                </span>
                <span className="goal-pct">{currentGoal.progress || 68}% Complete</span>
              </div>
              <div className="goal-title-text">{currentGoal.title}</div>
              <div className="goal-progress-bar">
                <div className="goal-progress-fill" style={{ width: `${currentGoal.progress || 68}%` }} />
              </div>
            </div>

            <div className="hero-control-buttons">
              {!isAutonomousRunning ? (
                <button 
                  type="button" 
                  className="btn-control-start"
                  onClick={() => startAutonomous()}
                >
                  <Play size={16} fill="#042F1D" />
                  <span>START AUTONOMOUS AGENT</span>
                </button>
              ) : (
                <>
                  <button 
                    type="button" 
                    className="btn-control-pause"
                    onClick={pauseAutonomous}
                  >
                    <Pause size={16} />
                    <span>PAUSE</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn-control-stop"
                    onClick={stopAutonomous}
                  >
                    <Square size={16} />
                    <span>STOP</span>
                  </button>
                </>
              )}

              <button 
                type="button" 
                className="btn-control-secondary"
                onClick={() => setActivePage('autonomous')}
              >
                <Cpu size={16} />
                <span>Open Live Arena</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick KPI Strip on Hero Right */}
        <div className="hero-card-right">
          <div className="home-kpi-block" onClick={() => setActivePage('vault')}>
            <div className="kpi-top">
              <span className="kpi-label">Virtual Token Balance</span>
              <Coins size={18} className="text-gold" />
            </div>
            <div className="kpi-number text-gold">{tokenBalance.toLocaleString()}</div>
            <span className="kpi-sub">Total Earned: {tokensEarned.toLocaleString()} V-Tokens</span>
          </div>

          <div className="home-kpi-block" onClick={() => setActivePage('reputation')}>
            <div className="kpi-top">
              <span className="kpi-label">Reputation Score</span>
              <Award size={18} className="text-cyan" />
            </div>
            <div className="kpi-number text-cyan">{userAgent.reputation}%</div>
            <span className="kpi-sub">Success Rate: {userAgent.stats.successRate}% ({userAgent.stats.jobsCompleted} Jobs)</span>
          </div>
        </div>
      </section>

      {/* WHAT NOVA IS DOING: Prominent Live Action Hub */}
      <section className="live-action-ticker-card">
        <div className="ticker-header">
          <div className="ticker-title-group">
            <span className="live-indicator-pill">
              <span className="radar-ping" /> WHAT {userAgent.name} IS DOING RIGHT NOW
            </span>
            <span className="ticker-stage-tag">{agentStage}</span>
          </div>

          <button 
            type="button" 
            className="btn-link-action"
            onClick={() => setActivePage('autonomous')}
          >
            <span>View Autonomous Room</span>
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="ticker-body">
          <div className="ticker-agent-thumb">
            <AgentOrb color={userAgent.orbColor || 'violet'} size="sm" pulse={true} />
          </div>
          <div className="ticker-thought-bubble">
            <p className="thought-text">"{agentThought}"</p>
            <div className="thought-footer-meta">
              <span>Target Talent: <strong>{selectedTargetAgent?.name || 'Searching...'}</strong> ({selectedTargetAgent?.category || 'General'})</span>
              <span>&bull;</span>
              <span>Mode: <strong>{userAgent.behavior}</strong></span>
              <span>&bull;</span>
              <span>Budget Cap: <strong>{currentGoal.suggestedBudget || 500} Tokens</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Grid: Daily Missions & Recent Activity Feed */}
      <div className="home-two-col-grid">
        {/* Left: Daily Missions with Claimable Rewards */}
        <section className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-wrap">
              <Sparkles size={18} className="text-gold" />
              <h3>Daily Quests & Rewards</h3>
            </div>
            <span className="panel-badge-sub">Resets in 14h</span>
          </div>

          <div className="missions-list">
            {missions.map((mission) => {
              const isReadyToClaim = !mission.claimed && mission.progress >= mission.total;
              return (
                <div key={mission.id} className={`mission-item-card ${mission.claimed ? 'claimed' : ''}`}>
                  <div className="mission-info-top">
                    <div>
                      <div className="mission-title">{mission.title}</div>
                      <div className="mission-desc">{mission.description}</div>
                    </div>
                    <div className="mission-reward-badge">
                      <Coins size={13} className="text-gold" />
                      <span>+{mission.rewardTokens} V-Tokens</span>
                    </div>
                  </div>

                  <div className="mission-progress-bar-row">
                    <div className="mini-bar-bg">
                      <div 
                        className="mini-bar-fill" 
                        style={{ width: `${Math.min(100, (mission.progress / mission.total) * 100)}%` }} 
                      />
                    </div>
                    <span className="mission-counter">{mission.progress} / {mission.total}</span>
                  </div>

                  <div className="mission-bottom-actions">
                    {mission.claimed ? (
                      <span className="tag-claimed">
                        <CheckCircle2 size={13} /> Claimed
                      </span>
                    ) : isReadyToClaim ? (
                      <button 
                        type="button" 
                        className="btn-claim-reward"
                        onClick={() => claimMissionReward(mission.id)}
                      >
                        <Sparkles size={14} /> Claim Reward (+{mission.rewardTokens} Tokens)
                      </button>
                    ) : (
                      <span className="tag-in-progress">In Progress</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right: Real-time Activity Feed */}
        <section className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-wrap">
              <Activity size={18} className="text-cyan" />
              <h3>Recent Simulation Activity</h3>
            </div>
            <button 
              type="button" 
              className="btn-view-all"
              onClick={() => setActivePage('activity')}
            >
              View All
            </button>
          </div>

          <div className="home-activity-stream">
            {activityLog.slice(0, 4).map((act) => (
              <div key={act.id} className="home-act-item">
                <div className="act-bullet-line" />
                <div className="act-content-box">
                  <div className="act-title-row">
                    <span className="act-title">{act.title}</span>
                    <span className="act-time">{act.timestamp}</span>
                  </div>
                  <p className="act-desc">{act.description}</p>
                  {act.tokens !== 0 && (
                    <span className={`act-token-tag ${act.tokens > 0 ? 'pos' : 'neg'}`}>
                      {act.tokens > 0 ? `+${act.tokens}` : act.tokens} V-Tokens
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Quick Launch Cards */}
      <section className="home-quick-nav-grid">
        <div className="quick-nav-card" onClick={() => setActivePage('market')}>
          <div className="quick-icon-box purple">
            <Store size={22} />
          </div>
          <div>
            <h4>Agent Marketplace</h4>
            <p>Browse and hire specialized designers, developers, and analysts.</p>
          </div>
          <ChevronRight size={18} className="quick-arrow" />
        </div>

        <div className="quick-nav-card" onClick={() => setActivePage('negotiation')}>
          <div className="quick-icon-box pink">
            <MessageSquareCode size={22} />
          </div>
          <div>
            <h4>Negotiation Room</h4>
            <p>Watch agents debate prices, terms, and lock win-win contracts.</p>
          </div>
          <ChevronRight size={18} className="quick-arrow" />
        </div>

        <div className="quick-nav-card" onClick={() => setActivePage('leaderboard')}>
          <div className="quick-icon-box gold">
            <Trophy size={22} />
          </div>
          <div>
            <h4>Agent Arena Leaderboard</h4>
            <p>Check top earning agents and reputation hall of fame.</p>
          </div>
          <ChevronRight size={18} className="quick-arrow" />
        </div>
      </section>
    </div>
  );
}
