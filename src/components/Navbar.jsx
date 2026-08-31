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
  Award,
  Radio
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useNexora } from '../context/NexoraContext';
import AgentOrb from './AgentOrb';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    cashBalance, 
    gemBalance, 
    activeAgent, 
    unlockedAgentIds, 
    claimFreeDemoGrant,
    lastUpdated
  } = useGame();
  const { user, signOut } = useNexora();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const navItems = [
    { id: 'trading', label: 'Trading Floor', icon: TrendingUp, badge: 'LIVE REAL' },
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
            <span className="brand-title">NEXORA <span className="brand-stock-tag">LIVE STOCKS</span></span>
            <span className="brand-subline">Real-Time Market & AI Agent Floor</span>
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

          {/* User Profile / Logout */}
          <div className="profile-root" style={{ position: 'relative', marginLeft: 12 }}>
            <button
              type="button"
              className="profile-btn"
              onClick={() => setShowProfileMenu(s => !s)}
              title={user ? `Signed in as ${user.name || user.email}` : 'Not signed in'}
            >
              <div style={{ width:36, height:36, borderRadius:999, background: 'linear-gradient(90deg,#06b6d4,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#071024', fontWeight:700 }}>
                {user ? (user.name ? user.name[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')) : 'G'}
              </div>
            </button>

            {showProfileMenu && (
              <div className="profile-menu" style={{ position: 'absolute', right: 0, top: 44, background: '#0b1220', border: '1px solid #172033', padding: 8, borderRadius: 8, minWidth: 160, zIndex: 60 }}>
                <div style={{ padding: '8px 10px', color: '#cbd5e1' }}>
                  <div style={{ fontWeight: 600 }}>{user?.name || 'Guest'}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{user?.email || ''}</div>
                </div>
                <div style={{ height: 1, background: '#14202b', margin: '6px 0' }} />
                <button className="btn-auth-submit" style={{ width: '100%' }} onClick={() => { setShowProfileMenu(false); signOut(); }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
