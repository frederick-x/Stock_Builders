import React from 'react';
import { useGame } from '../context/GameContext';

export default function FloatingCombatText() {
  const { floatingTexts } = useGame();

  if (!floatingTexts || floatingTexts.length === 0) return null;

  return (
    <div className="floating-text-container" aria-live="polite">
      {floatingTexts.map((item) => (
        <div 
          key={item.id} 
          className={`floating-combat-badge type-${item.type}`}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
