import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import LoginPage from './pages/LoginPage';
import { useNexora } from './context/NexoraContext';
import Navbar from './components/Navbar';
import CommandCenterPage from './pages/CommandCenterPage';
import TradingFloorPage from './pages/TradingFloorPage';
import AgentForgePage from './pages/AgentForgePage';
import MissionsPage from './pages/MissionsPage';
import PortfolioPage from './pages/PortfolioPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LevelUpModal from './components/LevelUpModal';
import FloatingCombatText from './components/FloatingCombatText';

function ToastContainer() {
  const { toast } = useGame();
  if (!toast) return null;

  return (
    <div className="game-toast-container">
      <div className={`game-toast toast-${toast.type || 'info'}`}>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

function MainApp() {
  const [activeTab, setActiveTab] = useState('command'); // 'command' | 'trading' | 'forge' | 'missions' | 'portfolio' | 'leaderboard'

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'command':
        return <CommandCenterPage setActiveTab={setActiveTab} />;
      case 'trading':
        return <TradingFloorPage setActiveTab={setActiveTab} />;
      case 'forge':
        return <AgentForgePage setActiveTab={setActiveTab} />;
      case 'missions':
        return <MissionsPage setActiveTab={setActiveTab} />;
      case 'portfolio':
        return <PortfolioPage setActiveTab={setActiveTab} />;
      case 'leaderboard':
        return <LeaderboardPage />;
      default:
        return <CommandCenterPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="stockbuilders-stock-game-app">
      {/* Top Navbar with Level/XP, Dual Tokens ($ Cash + 💎 Gems), Sound Toggle & Active Co-Pilot */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Game Screen Canvas */}
      <main className="game-main-content">
        {renderActiveScreen()}
      </main>

      {/* Global Game Feedback Overlays */}
      <FloatingCombatText />
      <LevelUpModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AuthGate />
    </GameProvider>
  );
}

function AuthGate() {
  const { user } = useNexora();

  if (!user) return <LoginPage />;
  return <MainApp />;
}
