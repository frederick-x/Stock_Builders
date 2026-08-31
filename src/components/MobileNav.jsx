import React from 'react';
import { Home, Cpu, Store, MessageSquareCode, Coins, Trophy } from 'lucide-react';
import { useNexora } from '../context/NexoraContext';

export default function MobileNav({ activePage, setActivePage }) {
  const { isAutonomousRunning } = useNexora();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'autonomous', label: 'Auto', icon: Cpu, badge: isAutonomousRunning },
    { id: 'market', label: 'Market', icon: Store },
    { id: 'negotiation', label: 'Rooms', icon: MessageSquareCode },
    { id: 'vault', label: 'Vault', icon: Coins },
    { id: 'leaderboard', label: 'Arena', icon: Trophy },
  ];

  return (
    <nav className="mobile-bottom-dock">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`mobile-dock-btn ${isActive ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <div className="mobile-icon-box">
              <Icon size={20} />
              {item.badge && <span className="mobile-pulse-dot" />}
            </div>
            <span className="mobile-dock-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
