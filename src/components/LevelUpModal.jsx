import React from 'react';
import { Trophy, Star, Sparkles, Gem, Coins, ArrowRight, X } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function LevelUpModal() {
  const { levelUpData, setLevelUpData, playSound } = useGame();

  if (!levelUpData) return null;

  const handleClose = () => {
    playSound('click');
    setLevelUpData(null);
  };

  return (
    <div className="game-modal-backdrop animate-fade-in" onClick={handleClose}>
      <div 
        className="levelup-modal-card animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={handleClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="levelup-top-badge">
          <Sparkles size={18} className="text-gold animate-spin-slow" />
          <span>PROMOTION ACHIEVED</span>
          <Sparkles size={18} className="text-gold animate-spin-slow" />
        </div>

        <div className="levelup-emblem-wrap">
          <div className="levelup-ring-pulse" />
          <div className="levelup-level-number font-mono">
            {levelUpData.newLevel}
          </div>
          <div className="levelup-star-icon">
            <Star size={24} fill="#F59E0B" className="text-gold" />
          </div>
        </div>

        <h2 className="levelup-title">LEVEL {levelUpData.newLevel} UNLOCKED!</h2>
        <div className="levelup-rank-chip font-bold">
          <span>{levelUpData.rankIcon}</span>
          <span>{levelUpData.rankTitle}</span>
        </div>

        <p className="levelup-subtitle">
          Your market clearance level has expanded. You have unlocked elevated trading multipliers and league bonuses!
        </p>

        {/* Level Up Loot Cache */}
        <div className="levelup-rewards-box">
          <span className="loot-header-lbl">PROMOTION BOUNTY</span>
          <div className="loot-items-row">
            <div className="loot-item gem">
              <Gem size={20} className="text-gold gem-icon-pulse" />
              <div className="loot-info">
                <span className="loot-qty font-mono font-bold text-gold">+{levelUpData.gemBonus}</span>
                <span className="loot-name">💎 Nexus Gems</span>
              </div>
            </div>

            <div className="loot-item cash">
              <Coins size={20} className="text-emerald" />
              <div className="loot-info">
                <span className="loot-qty font-mono font-bold text-emerald">+${levelUpData.cashBonus.toLocaleString()}</span>
                <span className="loot-name">Trading Cash</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          type="button" 
          className="btn-levelup-claim"
          onClick={handleClose}
        >
          <span>EQUIP & ENTER ARENA</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
