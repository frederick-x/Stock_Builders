import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  Bot, 
  Target, 
  Trophy, 
  Gem, 
  Coins, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  ArrowRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  Radio, 
  Activity, 
  Layers, 
  ChevronRight, 
  Play,
  Award
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useNexora } from '../context/NexoraContext';
import AgentOrb from '../components/AgentOrb';
import { DAILY_STREAK_REWARDS } from '../services/gameData';

export default function CommandCenterPage({ setActiveTab }) {
  const { 
    playerLevel, 
    playerXP, 
    xpForNextLevel, 
    currentRank, 
    streakDays, 
    isStreakClaimedToday, 
    claimDailyStreakReward, 
    cashBalance, 
    gemBalance, 
    totalNetWorth, 
    unrealizedProfit, 
    winRate, 
    currentLeague, 
    activeAgent, 
    activeMarketEvent, 
    missions, 
    claimMissionReward, 
    stocks, 
    setSelectedStockSymbol,
    playSound 
  } = useGame();

  const { user } = useNexora();

  const xpPercent = Math.min(100, Math.round((playerXP / xpForNextLevel) * 100));

  const dailyQuests = missions.filter(m => m.category === 'daily' || !m.category).slice(0, 3);

  // Top gainers
  const topGainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);

  const handleQuickTrade = (symbol) => {
    setSelectedStockSymbol(symbol);
    playSound('click');
    setActiveTab('trading');
  };

  return (
    <div className="command-center-container">
      {/* 1. Commander Profile & Global League Status HUD */}
      <section className="command-hero-hud">
        <div className="hud-player-identity">
          <div className="hud-avatar-ring">
            <div className="hud-level-badge font-mono font-bold">
              LVL {playerLevel}
            </div>
            <AgentOrb color={activeAgent.orbColor || 'violet'} size="md" pulse={true} />
          </div>

          <div className="hud-meta-col">
            <div className="hud-greeting-row">
              <span className="hud-callsign font-mono">COMMANDER // {user?.name?.toUpperCase() || 'OPERATOR'}</span>
              <span className="league-tier-chip" style={{ borderColor: currentLeague.color, color: currentLeague.color }}>
                <span>{currentLeague.badge}</span>
                <span>{currentLeague.name.toUpperCase()}</span>
              </span>
            </div>

            <h1 className="hud-rank-title">
              <span className="hud-rank-icon">{currentRank.icon}</span>
              {currentRank.title}
            </h1>

            {/* XP Progress Bar */}
            <div className="hud-xp-bar-wrap">
              <div className="xp-label-row font-mono text-xs">
                <span>EXPERIENCE // XP PROGRESS</span>
                <span className="text-cyan font-bold">{playerXP} / {xpForNextLevel} XP ({xpPercent}%)</span>
              </div>
              <div className="xp-bar-track">
                <div 
                  className="xp-bar-fill animate-pulse-glow" 
                  style={{ width: `${xpPercent}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick KPI Gauges */}
        <div className="hud-kpi-matrix">
          <div className="hud-kpi-card highlight-glow">
            <span className="hud-kpi-lbl">PORTFOLIO NET WORTH</span>
            <div className="hud-kpi-val font-mono text-pure font-bold">
              ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="hud-kpi-sub">
              <span className={`pnl-mini ${unrealizedProfit >= 0 ? 'pos' : 'neg'}`}>
                {unrealizedProfit >= 0 ? '+' : ''}${unrealizedProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })} P&L
              </span>
              <span className="text-dim"> &bull; Win Rate {winRate}%</span>
            </div>
          </div>

          <div className="hud-kpi-card">
            <span className="hud-kpi-lbl">VIRTUAL TRADING CASH</span>
            <div className="hud-kpi-val font-mono text-emerald font-bold">
              ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="hud-kpi-sub text-dim">Active Buying Power</span>
          </div>

          <div className="hud-kpi-card gem-card" onClick={() => setActiveTab('forge')}>
            <span className="hud-kpi-lbl text-gold">💎 NEXUS GEMS</span>
            <div className="hud-kpi-val font-mono text-gold font-bold">
              {gemBalance} GEMS
            </div>
            <span className="hud-kpi-sub text-gold-glow">Recruit & Train AI &rarr;</span>
          </div>
        </div>
      </section>

      {/* 2. World Market Event Booster Banner */}
      <section className="world-event-banner" style={{ borderColor: activeMarketEvent.color }}>
        <div className="event-badge-tag" style={{ backgroundColor: `${activeMarketEvent.color}22`, color: activeMarketEvent.color, borderColor: activeMarketEvent.color }}>
          <Radio size={14} className="animate-pulse" />
          <span>{activeMarketEvent.badge}</span>
        </div>

        <div className="event-info-main">
          <div className="event-title-row">
            <h3>{activeMarketEvent.title}</h3>
            <span className="event-multiplier-chip font-mono">
              +{Math.round((activeMarketEvent.xpMultiplier - 1) * 100)}% XP MULTIPLIER &bull; +{Math.round((activeMarketEvent.profitMultiplier - 1) * 100)}% PROFIT BONUS
            </span>
          </div>
          <p>{activeMarketEvent.description}</p>
        </div>

        <button 
          type="button" 
          className="btn-event-jump"
          onClick={() => { playSound('click'); setActiveTab('trading'); }}
        >
          <span>TRADE ACTIVE STOCKS</span>
          <ArrowRight size={16} />
        </button>
      </section>

      {/* 3. Main Center Split Grid */}
      <div className="command-grid-layout">
        {/* Left Column: AI Co-Pilot & Daily Login Streak */}
        <div className="command-col-left">
          {/* Active AI Co-Pilot Card */}
          <div className="companion-showcase-card">
            <div className="card-header-clean">
              <div className="title-with-icon">
                <Bot size={18} className="text-cyan" />
                <h4>Active AI Companion Co-Pilot</h4>
              </div>
              <button 
                type="button" 
                className="btn-switch-agent-text"
                onClick={() => { playSound('click'); setActiveTab('forge'); }}
              >
                Agent Forge &rarr;
              </button>
            </div>

            <div className="companion-main-body">
              <div className="comp-avatar-col">
                <AgentOrb color={activeAgent.orbColor || 'violet'} size="lg" pulse={true} />
                <span className="comp-lvl-tag font-mono">LVL {activeAgent.level || 1} / 10</span>
              </div>

              <div className="comp-details-col">
                <div className="comp-name-row">
                  <h3>{activeAgent.name}</h3>
                  <span className="comp-spec-badge">{activeAgent.specialty}</span>
                </div>
                <p className="comp-desc">{activeAgent.skillDescription}</p>

                {/* Companion XP Bar */}
                <div className="comp-xp-block">
                  <div className="xp-labels-mini font-mono text-xs">
                    <span>COMPANION SYNC XP</span>
                    <span>{activeAgent.xp || 0} / {activeAgent.xpMax || 150} XP</span>
                  </div>
                  <div className="comp-xp-track">
                    <div 
                      className="comp-xp-fill" 
                      style={{ width: `${Math.min(100, ((activeAgent.xp || 0) / (activeAgent.xpMax || 150)) * 100)}%` }} 
                    />
                  </div>
                </div>

                {/* Companion Stat Perks */}
                <div className="comp-perks-row">
                  <div className="perk-pill">
                    <span className="lbl">Signal Accuracy:</span>
                    <span className="val font-mono text-cyan">{activeAgent.stats.accuracy}%</span>
                  </div>
                  <div className="perk-pill">
                    <span className="lbl">Profit Booster:</span>
                    <span className="val font-mono text-gold">+{activeAgent.stats.profitBonus}%</span>
                  </div>
                  <div className="perk-pill">
                    <span className="lbl">Crash Shield:</span>
                    <span className="val font-mono text-emerald">{activeAgent.stats.shield}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Login Streak Matrix */}
          <div className="streak-matrix-card">
            <div className="card-header-clean">
              <div className="title-with-icon">
                <Flame size={18} className="text-gold" />
                <h4>Daily Login & Trading Streak</h4>
              </div>
              <span className="streak-count-badge font-mono">
                🔥 {streakDays}-DAY STREAK
              </span>
            </div>

            <p className="streak-hint-text">
              Log in daily to claim escalating virtual cash, 💎 Nexus Gems, and rare AI training boosters!
            </p>

            <div className="streak-days-row">
              {DAILY_STREAK_REWARDS.map((item) => {
                const isCurrent = item.day === streakDays;
                const isPassed = item.day < streakDays;

                return (
                  <div 
                    key={item.day}
                    className={`streak-day-box ${isCurrent ? 'active-today' : (isPassed ? 'claimed-past' : 'locked-future')}`}
                  >
                    <span className="day-num-lbl">Day {item.day}</span>
                    <span className="day-icon-main">{item.icon}</span>
                    <div className="day-reward-text font-mono">
                      <span>+{item.gems}💎</span>
                      <span>+${item.cash}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="streak-claim-footer">
              <button 
                type="button" 
                className={`btn-claim-streak ${isStreakClaimedToday ? 'claimed' : 'ready'}`}
                onClick={claimDailyStreakReward}
                disabled={isStreakClaimedToday}
              >
                {isStreakClaimedToday ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>TODAY'S STREAK CLAIMED</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>CLAIM DAY {streakDays} REWARDS (+{DAILY_STREAK_REWARDS[(streakDays - 1) % 7]?.gems} 💎 GEMS)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Quests & Market Arena Ticker */}
        <div className="command-col-right">
          {/* Daily Quests Quick-Tracker */}
          <div className="quests-quick-card">
            <div className="card-header-clean">
              <div className="title-with-icon">
                <Target size={18} className="text-gold" />
                <h4>Daily Quests & Bounties</h4>
              </div>
              <button 
                type="button" 
                className="btn-switch-agent-text"
                onClick={() => { playSound('click'); setActiveTab('missions'); }}
              >
                All Missions &rarr;
              </button>
            </div>

            <div className="quests-stream">
              {dailyQuests.map((quest) => {
                const isComplete = quest.progress >= quest.target;
                const pct = Math.min(100, Math.round((quest.progress / quest.target) * 100));

                return (
                  <div key={quest.id} className={`quest-item-mini ${quest.claimed ? 'claimed' : (isComplete ? 'ready' : '')}`}>
                    <div className="quest-mini-top">
                      <div>
                        <span className="quest-title-mini">{quest.title}</span>
                        <div className="quest-reward-tags font-mono text-xs">
                          <span className="text-gold">+{quest.rewardGems} 💎</span>
                          <span className="text-emerald">+${quest.rewardCash}</span>
                          <span className="text-cyan">+{quest.rewardXP || 100} XP</span>
                        </div>
                      </div>

                      {quest.claimed ? (
                        <span className="status-claimed-badge">CLAIMED</span>
                      ) : isComplete ? (
                        <button 
                          type="button" 
                          className="btn-claim-mini"
                          onClick={() => claimMissionReward(quest.id)}
                        >
                          CLAIM
                        </button>
                      ) : (
                        <span className="status-progress-num font-mono text-xs">
                          {quest.progress} / {quest.target}
                        </span>
                      )}
                    </div>

                    {!quest.claimed && (
                      <div className="quest-mini-track">
                        <div className="quest-mini-fill" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Market Hot Tickers Arena Preview */}
          <div className="market-arena-preview-card">
            <div className="card-header-clean">
              <div className="title-with-icon">
                <Activity size={18} className="text-emerald" />
                <h4>Live Arena Top Movers</h4>
              </div>
              <button 
                type="button" 
                className="btn-switch-agent-text"
                onClick={() => { playSound('click'); setActiveTab('trading'); }}
              >
                Enter Arena &rarr;
              </button>
            </div>

            <div className="arena-tickers-grid">
              {topGainers.map((stock) => (
                <div 
                  key={stock.symbol} 
                  className="arena-ticker-box"
                  onClick={() => handleQuickTrade(stock.symbol)}
                >
                  <div className="ticker-top-row">
                    <span className="ticker-sym font-bold">{stock.symbol}</span>
                    <span className={`ticker-change font-mono font-bold ${stock.changePercent >= 0 ? 'pos' : 'neg'}`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                    </span>
                  </div>
                  <div className="ticker-name-sub text-dim text-xs">{stock.name}</div>
                  <div className="ticker-price-row font-mono">
                    <span className="price-val">${stock.price.toFixed(2)}</span>
                    <span className="btn-trade-chip">Trade &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Fast Action Gameplay Launchpad */}
      <section className="gameplay-launchpad-section">
        <div 
          className="launchpad-card arena"
          onClick={() => { playSound('click'); setActiveTab('trading'); }}
        >
          <div className="launchpad-icon-wrap">
            <TrendingUp size={24} className="text-emerald" />
          </div>
          <div className="launchpad-text">
            <h4>TRADING ARENA</h4>
            <p>Live stocks, AI signals, instant virtual order executions</p>
          </div>
          <ChevronRight size={20} className="launchpad-arrow" />
        </div>

        <div 
          className="launchpad-card forge"
          onClick={() => { playSound('click'); setActiveTab('forge'); }}
        >
          <div className="launchpad-icon-wrap">
            <Bot size={24} className="text-purple" />
          </div>
          <div className="launchpad-text">
            <h4>AGENT FORGE</h4>
            <p>Unlock AI companions & train skill tree parameters</p>
          </div>
          <ChevronRight size={20} className="launchpad-arrow" />
        </div>

        <div 
          className="launchpad-card quests"
          onClick={() => { playSound('click'); setActiveTab('missions'); }}
        >
          <div className="launchpad-icon-wrap">
            <Target size={24} className="text-gold" />
          </div>
          <div className="launchpad-text">
            <h4>QUEST CENTER</h4>
            <p>Earn 💎 Nexus Gems, cash rewards & XP milestones</p>
          </div>
          <ChevronRight size={20} className="launchpad-arrow" />
        </div>

        <div 
          className="launchpad-card league"
          onClick={() => { playSound('click'); setActiveTab('leaderboard'); }}
        >
          <div className="launchpad-icon-wrap">
            <Trophy size={24} className="text-cyan" />
          </div>
          <div className="launchpad-text">
            <h4>GLOBAL LEAGUE</h4>
            <p>Compete across leagues & challenge rival traders</p>
          </div>
          <ChevronRight size={20} className="launchpad-arrow" />
        </div>
      </section>
    </div>
  );
}
