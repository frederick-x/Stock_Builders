import React from 'react';
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
  Award
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import AgentOrb from './AgentOrb';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    cashBalance, 
    gemBalance, 
    activeAgent, 
    unlockedAgentIds, 
    claimFreeDemoGrant 
  } = useGame();

  const navItems = [
    { id: 'trading', label: 'Trading Floor', icon: TrendingUp, badge: 'LIVE' },
    { id: 'forge', label: 'Agent Forge', icon: Bot, badge: `${unlockedAgentIds.length}/6 Unlocked` },
    { id: 'missions', label: 'Missions & Gems', icon: Target, badge: '💎 REWARDS' },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <header className="game-navbar-top">
      <div className="game-navbar-inner">
        {/* Brand Logo */}
        <div className="game-brand-group" onClick={() => setActiveTab('trading')}>
          <div className="brand-gem-logo">
            <TrendingUp size={22} className="text-emerald" />
            <Bot size={16} className="brand-sub-bot text-cyan" />
          </div>
          <div className="brand-text-col">
            <span className="brand-title">NEXORA <span className="brand-stock-tag">STOCKS</span></span>
            <span className="brand-subline">AI-Agent Trading Simulator</span>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="game-nav-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`game-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
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

        {/* Right: Dual Currency + Active Agent Badge */}
        <div className="game-navbar-right">
          {/* Cash Balance ($) */}
          <div className="currency-pill cash-pill" title="Trading Cash to buy and sell stocks">
            <Coins size={15} className="text-emerald" />
            <div className="cur-val-col">
              <span className="cur-label">TRADING CASH</span>
              <span className="cur-amount font-mono">${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Premium Unique Token: 💎 NEXUS GEMS */}
          <div className="currency-pill gem-pill" onClick={() => setActiveTab('forge')} title="Premium Unique Tokens to recruit AI Agents!">
            <div className="gem-shimmer-wrap">
              <Gem size={17} className="gem-icon-pulse" />
            </div>
            <div className="cur-val-col">
              <span className="cur-label text-gold">💎 NEXUS GEMS</span>
              <span className="cur-amount font-mono text-gold font-bold">{gemBalance} GEMS</span>
            </div>
          </div>

          {/* Active Agent Badge */}
          <div className="active-agent-pill" onClick={() => setActiveTab('forge')}>
            <AgentOrb color={activeAgent.orbColor || 'violet'} size="xs" pulse={true} />
            <div className="agent-pill-info">
              <span className="agent-pill-name">{activeAgent.name}</span>
              <span className="agent-pill-skill">{activeAgent.rarity}</span>
            </div>
          </div>

          {/* Emergency Funds Grant */}
          <button 
            type="button" 
            className="btn-demo-grant"
            onClick={claimFreeDemoGrant}
            title="Claim +$5,000 Cash & +35 Gems (Free Simulator Aid)"
          >
            <Plus size={14} /> +Aid
          </button>
        </div>
      </div>
    </header>
  );
}
