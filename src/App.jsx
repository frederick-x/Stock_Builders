import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Navbar from './components/Navbar';
import TradingFloorPage from './pages/TradingFloorPage';
import AgentForgePage from './pages/AgentForgePage';
import MissionsPage from './pages/MissionsPage';
import PortfolioPage from './pages/PortfolioPage';
import LeaderboardPage from './pages/LeaderboardPage';

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
  const [activeTab, setActiveTab] = useState('trading'); // 'trading' | 'forge' | 'missions' | 'portfolio' | 'leaderboard'

  const renderActiveScreen = () => {
    switch (activeTab) {
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
        return <TradingFloorPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="nexora-stock-game-app">
      {/* Top Navbar with Dual Tokens ($ Cash + 💎 Gems) & Active Agent */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Game Screen Canvas */}
      <main className="game-main-content">
        {renderActiveScreen()}
      </main>

      {/* Global Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainApp />
    </GameProvider>
  );
}
