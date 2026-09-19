import React, { useState } from 'react';
import { 
  TrendingUp, 
  Bot, 
  Target, 
  PieChart, 
  Trophy, 
  Coins, 
  Gem, 
  Plus, 
  Sparkles,
  Zap,
  ShieldCheck,
  Award,
  Radio,
  Volume2,
  VolumeX,
  Compass,
  Box,
  Flame,
  User,
  LogOut
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useNexora } from '../context/NexoraContext';
import AgentOrb from './AgentOrb';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    cashBalance, 
    gemBalance, 
    playerLevel,
    playerXP,
    xpForNextLevel,
    currentRank,
    activeAgent, 
    unlockedAgentIds, 
    claimFreeDemoGrant,
    soundMuted,
    toggleSound,
    playSound
  } = useGame();

  const { user, signOut } = useNexora();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const xpPct = Math.min(100, Math.round((playerXP / xpForNextLevel) * 100));

  const navItems = [
    { id: 'command', label: 'Command Center', icon: Compass, badge: 'HOME' },
    { id: 'trading', label: 'Trading Arena', icon: TrendingUp, badge: 'LIVE' },
    { id: 'forge', label: 'Agent Forge', icon: Bot, badge: `${unlockedAgentIds.length}/6 AI` },
    { id: 'missions', label: 'Quest Hub', icon: Target, badge: '💎 BOUNTIES' },
    { id: 'portfolio', label: 'Inventory', icon: Box },
    { id: 'leaderboard', label: 'Market League', icon: Trophy },
  ];

  const handleTabClick = (tabId) => {
    playSound('click');
    setActiveTab(tabId);
  };

  return (
    <header className="game-navbar-top">
      <div className="game-navbar-inner">
        {/* 1. Left Brand Group */}
        <div className="game-brand-group" onClick={() => handleTabClick('command')}>
          <div className="brand-gem-logo">
            <TrendingUp size={22} className="text-emerald" />
            <Bot size={15} className="brand-sub-bot text-cyan" />
          </div>
          <div className="brand-text-col">
            <span className="brand-title">
              STOCKBUILDERS <span className="brand-stock-tag font-mono">GAME ARENA</span>
            </span>
            <span className="brand-subline">Futuristic Market Strategy Game</span>
          </div>
        </div>

        {/* 2. Center Nav Tabs */}
        <nav className="game-nav-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`game-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleTabClick(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`nav-pill-badge ${item.id === 'missions' ? 'gem-badge' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 3. Right Status HUD: Level/XP + Dual Currency + Sound + Profile */}
        <div className="game-navbar-right">
          {/* Player Level & XP Mini Bar */}
          <div 
            className="player-level-nav-pill font-mono" 
            onClick={() => handleTabClick('command')}
            title={`Level ${playerLevel} (${currentRank.title}) — ${playerXP}/${xpForNextLevel} XP`}
          >
            <div className="lvl-chip font-bold">LVL {playerLevel}</div>
            <div className="nav-xp-bar-track">
              <div className="nav-xp-bar-fill" style={{ width: `${xpPct}%` }} />
            </div>
          </div>

          {/* Virtual Trading Cash */}
          <div className="currency-pill cash-pill" title="Virtual Trading Cash for stock orders">
            <Coins size={15} className="text-emerald" />
            <div className="cur-val-col">
              <span className="cur-label">VIRTUAL CASH</span>
              <span className="cur-amount font-mono">${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
          </div>

          {/* Premium Unique Token: 💎 NEXUS GEMS */}
          <div 
            className="currency-pill gem-pill" 
            onClick={() => handleTabClick('forge')} 
            title="Premium Nexus Gems to recruit & train AI Companions!"
          >
            <div className="gem-shimmer-wrap">
              <Gem size={16} className="gem-icon-pulse text-gold" />
            </div>
            <div className="cur-val-col">
              <span className="cur-label text-gold">💎 GEMS</span>
              <span className="cur-amount font-mono text-gold font-bold">{gemBalance}</span>
            </div>
          </div>

          {/* Active AI Companion Co-Pilot */}
          <div 
            className="active-agent-pill" 
            onClick={() => handleTabClick('forge')}
            title={`Active Co-Pilot: ${activeAgent.name} (Level ${activeAgent.level})`}
          >
            <AgentOrb color={activeAgent.orbColor || 'violet'} size="xs" pulse={true} />
            <div className="agent-pill-info">
              <span className="agent-pill-name">{activeAgent.name}</span>
              <span className="agent-pill-skill font-mono">LVL {activeAgent.level}</span>
            </div>
          </div>

          {/* Sound FX Mute Toggle */}
          <button 
            type="button" 
            className={`btn-sound-toggle ${soundMuted ? 'muted' : 'active'}`}
            onClick={toggleSound}
            title={soundMuted ? 'Unmute Game Sounds' : 'Mute Game Sounds'}
          >
            {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Free Simulator Aid Grant */}
          <button 
            type="button" 
            className="btn-demo-grant"
            onClick={claimFreeDemoGrant}
            title="Claim +$5,000 Cash & +35 Gems (Free Simulator Aid)"
          >
            <Plus size={13} /> +Aid
          </button>

          {/* User Profile / Logout */}
          <div className="profile-root">
            <button
              type="button"
              className="profile-btn"
              onClick={() => { playSound('click'); setShowProfileMenu(s => !s); }}
              title={user ? `Commander: ${user.name || user.email}` : 'Guest Explorer'}
            >
              <div className="profile-avatar-circle">
                {user ? (user.name ? user.name[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')) : 'C'}
              </div>
            </button>

            {showProfileMenu && (
              <div className="profile-menu-dropdown animate-scale-up">
                <div className="profile-menu-header">
                  <div className="font-bold text-pure">{user?.name || 'Commander'}</div>
                  <div className="text-xs text-dim">{user?.email || 'simulation@stockbuilders.ai'}</div>
                  <div className="profile-rank-tag font-mono text-xs text-gold">
                    {currentRank.icon} {currentRank.title} (Lvl {playerLevel})
                  </div>
                </div>
                <div className="profile-menu-divider" />
                <button 
                  className="btn-logout-menu" 
                  onClick={() => { setShowProfileMenu(false); signOut(); }}
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
