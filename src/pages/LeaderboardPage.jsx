import React from 'react';
import { Trophy, Gem, Coins, Bot, Crown, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import AgentOrb from '../components/AgentOrb';

export default function LeaderboardPage() {
  const { totalNetWorth, gemBalance, unlockedAgentIds, activeAgent } = useGame();

  const mockLeaderboard = [
    { rank: 1, name: 'CyberWhale_99', title: 'Apex Grandmaster', netWorth: 184500, gems: 520, agents: 6, orb: 'purple', badge: '👑 Whale Apex' },
    { rank: 2, name: 'QuantumBull', title: 'High-Freq Trader', netWorth: 124200, gems: 380, agents: 5, orb: 'cyan', badge: '🥈 Scalp Master' },
    { rank: 3, name: 'You (Player)', title: 'Active Commander', netWorth: totalNetWorth, gems: gemBalance, agents: unlockedAgentIds.length, orb: activeAgent.orbColor || 'violet', isUser: true, badge: '🥉 Rising Star' },
    { rank: 4, name: 'ValkyrieHunter', title: 'Tech Growth Scout', netWorth: 84300, gems: 190, agents: 4, orb: 'pink', badge: 'Growth King' },
    { rank: 5, name: 'AegisShield', title: 'Risk Optimizer', netWorth: 62100, gems: 140, agents: 3, orb: 'gold', badge: 'Safe Haven' },
    { rank: 6, name: 'OraclePredictor', title: 'Swing Seer', netWorth: 49500, gems: 95, agents: 2, orb: 'emerald', badge: 'Dip Seer' },
  ];

  return (
    <div className="leaderboard-page-container">
      {/* Hero Banner */}
      <div className="lb-hero-banner">
        <div className="lb-badge-pill">
          <Trophy size={15} className="text-gold" />
          <span>SIMULATED TRADER ARENA</span>
        </div>
        <h2>Global Stock Trader Leaderboard</h2>
        <p>Rankings across all stock commanders based on Portfolio Net Worth, 💎 Premium Gems earned, and specialized AI Agents recruited.</p>
      </div>

      {/* Leaderboard Table */}
      <div className="lb-table-card">
        <table className="game-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Trader & Active Agent</th>
              <th>Trader Title</th>
              <th>Portfolio Net Worth</th>
              <th>💎 Gems Earned</th>
              <th>Agents Owned</th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboard.map((player) => (
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
                <td><span className="title-pill">{player.title}</span></td>
                <td className="font-mono font-bold text-emerald">${player.netWorth.toLocaleString()}</td>
                <td className="font-mono font-bold text-gold">{player.gems} 💎 GEMS</td>
                <td>
                  <span className="agents-count-pill font-mono">
                    <Bot size={13} /> {player.agents} / 6
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
