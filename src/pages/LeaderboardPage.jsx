import React, { useState } from 'react';
import { 
  Trophy, 
  Gem, 
  Coins, 
  Bot, 
  Crown, 
  Award, 
  Swords, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Clock,
  X
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import AgentOrb from '../components/AgentOrb';
import { LEAGUE_TIERS } from '../services/gameData';

export default function LeaderboardPage() {
  const { 
    totalNetWorth, 
    gemBalance, 
    unlockedAgentIds, 
    activeAgent, 
    winRate, 
    currentLeague, 
    addXP, 
    playSound, 
    triggerConfetti, 
    showToast 
  } = useGame();

  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState('all');
  const [activeRivalDuel, setActiveRivalDuel] = useState(null);
  const [duelResult, setDuelResult] = useState(null);
  const [isDuelling, setIsDuelling] = useState(false);

  const mockLeaderboard = [
    { 
      rank: 1, 
      name: 'CyberWhale_99', 
      title: 'Apex Market Legend', 
      netWorth: 342500, 
      gems: 580, 
      agents: 6, 
      orb: 'purple', 
      winRate: 94, 
      tier: 'cyber_legend', 
      tierName: 'Cyber Legend', 
      badge: '👑 Whale Sovereign' 
    },
    { 
      rank: 2, 
      name: 'QuantumBull', 
      title: 'High-Freq Grandmaster', 
      netWorth: 184200, 
      gems: 390, 
      agents: 5, 
      orb: 'cyan', 
      winRate: 91, 
      tier: 'diamond', 
      tierName: 'Diamond League', 
      badge: '🥈 Scalp Overlord' 
    },
    { 
      rank: 3, 
      name: 'You (Player)', 
      title: 'Commander', 
      netWorth: totalNetWorth, 
      gems: gemBalance, 
      agents: unlockedAgentIds.length, 
      orb: activeAgent.orbColor || 'violet', 
      winRate: winRate, 
      tier: currentLeague.id, 
      tierName: currentLeague.name, 
      isUser: true, 
      badge: '🥉 Rising Apex' 
    },
    { 
      rank: 4, 
      name: 'ValkyrieHunter', 
      title: 'Tech Growth Scout', 
      netWorth: 84300, 
      gems: 210, 
      agents: 4, 
      orb: 'pink', 
      winRate: 86, 
      tier: 'platinum', 
      tierName: 'Platinum League', 
      badge: '⚡ Tech Titan' 
    },
    { 
      rank: 5, 
      name: 'AegisShield', 
      title: 'Risk Optimizer', 
      netWorth: 52100, 
      gems: 160, 
      agents: 3, 
      orb: 'gold', 
      winRate: 89, 
      tier: 'gold', 
      tierName: 'Gold League', 
      badge: '🛡️ Safe Haven' 
    },
    { 
      rank: 6, 
      name: 'OraclePredictor', 
      title: 'Neural Seer', 
      netWorth: 38500, 
      gems: 110, 
      agents: 2, 
      orb: 'emerald', 
      winRate: 82, 
      tier: 'silver', 
      tierName: 'Silver League', 
      badge: '🔮 Dip Seer' 
    },
  ];

  // Filtered leaderboard
  const filteredPlayers = selectedLeagueFilter === 'all' 
    ? mockLeaderboard 
    : mockLeaderboard.filter(p => p.tier === selectedLeagueFilter);

  // Top 3 Podium
  const podium = [mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]]; // 2nd, 1st, 3rd

  // Start 1v1 Rival Trade Duel Simulation
  const handleStartDuel = (rival) => {
    playSound('click');
    setActiveRivalDuel(rival);
    setDuelResult(null);
    setIsDuelling(false);
  };

  const handleExecuteDuel = () => {
    setIsDuelling(true);
    playSound('click');

    setTimeout(() => {
      const userPower = (totalNetWorth / 1000) + (activeAgent.stats.accuracy) + Math.random() * 50;
      const rivalPower = (activeRivalDuel.netWorth / 1000) + (activeRivalDuel.winRate) + Math.random() * 50;
      const isWon = userPower >= rivalPower || Math.random() > 0.45;

      const earnedXP = isWon ? 200 : 50;
      addXP(earnedXP, 'Rival Duel');

      if (isWon) {
        playSound('win');
        triggerConfetti();
      } else {
        playSound('sell');
      }

      setDuelResult({
        won: isWon,
        userScore: Math.round(userPower),
        rivalScore: Math.round(rivalPower),
        xpReward: earnedXP,
      });
      setIsDuelling(false);
    }, 1800);
  };

  return (
    <div className="leaderboard-page-container">
      {/* 1. Hero Arena Banner */}
      <div className="lb-hero-banner">
        <div className="lb-badge-pill">
          <Trophy size={15} className="text-gold" />
          <span>COMPETITIVE GLOBAL MARKET LEAGUE</span>
        </div>

        <h2>Global Trader Arena & Ranks</h2>
        <p>
          Battle against top market commanders worldwide. Climb from Bronze League to Cyber Legend based on Portfolio Net Worth, 💎 Nexus Gems, and AI Companion synergy.
        </p>

        <div className="lb-season-status font-mono text-xs">
          <div className="season-item">
            <Clock size={14} className="text-cyan" />
            <span>SEASON 4 ENDS IN: <strong>2d 14h 22m</strong></span>
          </div>
          <div className="season-item">
            <span>YOUR STATUS: <strong className="text-gold font-bold">#{mockLeaderboard.find(p => p.isUser)?.rank || 3} • {currentLeague.name}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Top 3 Podium Showcase */}
      <div className="lb-podium-section">
        {podium.map((player, idx) => {
          if (!player) return null;
          const isFirst = player.rank === 1;
          const isSecond = player.rank === 2;
          const isThird = player.rank === 3;

          return (
            <div 
              key={player.rank}
              className={`podium-card rank-${player.rank} ${player.isUser ? 'is-user-podium' : ''}`}
            >
              <div className="podium-crown-icon">
                {isFirst && <Crown size={32} fill="#FFD700" className="text-gold animate-bounce" />}
                {isSecond && <Award size={28} className="text-muted" />}
                {isThird && <Award size={26} className="text-gold" />}
              </div>

              <div className="podium-avatar-wrap">
                <AgentOrb color={player.orb} size="md" pulse={isFirst} />
                <span className={`podium-rank-tag r-${player.rank}`}>#{player.rank}</span>
              </div>

              <div className="podium-name-col">
                <h3 className="font-bold">{player.name}</h3>
                <span className="podium-title-text text-dim text-xs">{player.title}</span>
                <span className="podium-badge-chip">{player.badge}</span>
              </div>

              <div className="podium-wealth-box font-mono font-bold">
                <div className="text-emerald text-sm">${player.netWorth.toLocaleString()}</div>
                <div className="text-gold text-xs">+{player.gems} 💎 GEMS</div>
              </div>

              {!player.isUser && (
                <button 
                  type="button" 
                  className="btn-challenge-rival"
                  onClick={() => handleStartDuel(player)}
                >
                  <Swords size={13} />
                  <span>Duel Rival</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. League Tier Filter Tabs */}
      <div className="lb-tier-filter-row">
        <button 
          type="button"
          className={`btn-filter-tier ${selectedLeagueFilter === 'all' ? 'active' : ''}`}
          onClick={() => { playSound('click'); setSelectedLeagueFilter('all'); }}
        >
          All Ranks
        </button>
        {LEAGUE_TIERS.map((tier) => (
          <button 
            key={tier.id}
            type="button"
            className={`btn-filter-tier ${selectedLeagueFilter === tier.id ? 'active' : ''}`}
            onClick={() => { playSound('click'); setSelectedLeagueFilter(tier.id); }}
          >
            <span>{tier.badge}</span>
            <span>{tier.name}</span>
          </button>
        ))}
      </div>

      {/* 4. Full Leaderboard Table */}
      <div className="lb-table-card">
        <table className="game-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Trader & Co-Pilot</th>
              <th>League Tier</th>
              <th>Win Rate</th>
              <th>Portfolio Net Worth</th>
              <th>💎 Gems</th>
              <th>Fleet</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player) => (
              <tr key={player.rank} className={`game-table-row ${player.isUser ? 'user-highlight-row' : ''}`}>
                <td>
                  <span className={`rank-tag rank-${player.rank}`}>
                    #{player.rank}
                  </span>
                </td>
                <td>
                  <div className="trader-cell">
                    <AgentOrb color={player.orb} size="xs" />
                    <div>
                      <div className="font-bold text-pure">{player.name} {player.isUser && '(YOU)'}</div>
                      <div className="text-xs text-dim">{player.badge}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="league-tier-cell-tag font-mono">
                    {player.tierName}
                  </span>
                </td>
                <td>
                  <span className="font-mono text-emerald font-bold">{player.winRate}%</span>
                </td>
                <td className="font-mono font-bold text-emerald">${player.netWorth.toLocaleString()}</td>
                <td className="font-mono font-bold text-gold">{player.gems} 💎</td>
                <td>
                  <span className="agents-count-pill font-mono">
                    <Bot size={13} /> {player.agents}/6
                  </span>
                </td>
                <td className="text-right">
                  {!player.isUser ? (
                    <button 
                      type="button" 
                      className="btn-tbl-duel"
                      onClick={() => handleStartDuel(player)}
                    >
                      <Swords size={13} /> Duel
                    </button>
                  ) : (
                    <span className="user-active-chip">ACTIVE PLAYER</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. 1v1 Rival Duel Simulation Modal */}
      {activeRivalDuel && (
        <div className="game-modal-backdrop" onClick={() => setActiveRivalDuel(null)}>
          <div className="rival-duel-modal-card animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="modal-close-btn"
              onClick={() => setActiveRivalDuel(null)}
            >
              <X size={18} />
            </button>

            <div className="duel-top-badge font-mono">
              <Swords size={16} className="text-pink" />
              <span>1V1 RIVAL TRADE DUEL</span>
            </div>

            <h3 className="duel-title">Challenging {activeRivalDuel.name}</h3>
            <p className="duel-subtitle">Simulate a high-frequency algorithmic trade showdown between your active AI co-pilot and the rival's neural matrix.</p>

            {/* Duelists Matchup */}
            <div className="duel-matchup-row">
              <div className="duel-player-box you">
                <AgentOrb color={activeAgent.orbColor || 'violet'} size="md" pulse={true} />
                <span className="duel-name font-bold">YOU ({activeAgent.name})</span>
                <span className="font-mono text-xs text-dim">Accuracy: {activeAgent.stats.accuracy}%</span>
              </div>

              <div className="vs-emblem font-mono font-bold">
                VS
              </div>

              <div className="duel-player-box rival">
                <AgentOrb color={activeRivalDuel.orb} size="md" pulse={true} />
                <span className="duel-name font-bold">{activeRivalDuel.name}</span>
                <span className="font-mono text-xs text-dim">Win Rate: {activeRivalDuel.winRate}%</span>
              </div>
            </div>

            {/* Duel Result */}
            {duelResult ? (
              <div className={`duel-result-box ${duelResult.won ? 'victory' : 'defeat'}`}>
                <h4>{duelResult.won ? '🏆 DUEL VICTORY!' : '⚡ DEFEAT — TACTICAL RETREAT'}</h4>
                <p>
                  {duelResult.won 
                    ? `Your co-pilot outperformed ${activeRivalDuel.name}'s strategy algorithm in market simulation!`
                    : `${activeRivalDuel.name}'s high-frequency engine locked in faster execution yield.`}
                </p>
                <div className="duel-bounty-pills font-mono">
                  <span className="text-cyan font-bold">+{duelResult.xpReward} XP Gained</span>
                </div>
              </div>
            ) : isDuelling ? (
              <div className="duel-running-box font-mono">
                <Sparkles size={24} className="spinning text-gold" />
                <span>Simulating high-frequency trade vectors...</span>
              </div>
            ) : (
              <button 
                type="button" 
                className="btn-start-duel-action"
                onClick={handleExecuteDuel}
              >
                <Swords size={18} />
                <span>START SIMULATED DUEL</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
