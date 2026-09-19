import React from 'react';
import { 
  PieChart, 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Sparkles, 
  Layers, 
  Clock, 
  Trophy, 
  ShieldCheck, 
  Award,
  Box,
  ChevronRight
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { LEAGUE_TIERS } from '../services/gameData';

export default function PortfolioPage({ setActiveTab }) {
  const { 
    cashBalance, 
    holdingsMarketValue, 
    totalNetWorth, 
    unrealizedProfit, 
    totalRealizedProfit, 
    winRate,
    currentLeague,
    holdings, 
    stocks, 
    executeTrade, 
    tradeLog,
    playSound 
  } = useGame();

  // Sector allocation summary
  const sectorMap = holdings.reduce((acc, h) => {
    const liveStock = stocks.find(s => s.symbol === h.symbol) || { price: h.avgPrice };
    const val = h.shares * liveStock.price;
    acc[h.sector] = (acc[h.sector] || 0) + val;
    return acc;
  }, {});

  const totalHoldingVal = Object.values(sectorMap).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="portfolio-page-container">
      {/* 1. Top Player Progression KPI Grid */}
      <div className="portfolio-kpi-grid">
        <div className="p-kpi-card highlight-glow">
          <div className="kpi-top-row">
            <span className="kpi-label">TOTAL PORTFOLIO NET WORTH</span>
            <span className="league-pill-badge font-mono" style={{ borderColor: currentLeague.color, color: currentLeague.color }}>
              {currentLeague.badge} {currentLeague.name}
            </span>
          </div>
          <div className="kpi-main-val font-mono font-bold text-pure">
            ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="kpi-footer-sub">
            Cash: ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} &bull; Equities: ${holdingsMarketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">UNREALIZED STOCK P&L</span>
            <div className={`p-icon-pill ${unrealizedProfit >= 0 ? 'pos' : 'neg'}`}>
              {unrealizedProfit >= 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
            </div>
          </div>
          <div className={`kpi-main-val font-mono font-bold ${unrealizedProfit >= 0 ? 'text-emerald' : 'text-pink'}`}>
            {unrealizedProfit >= 0 ? '+' : ''}${unrealizedProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="kpi-footer-sub">Live open market positions</span>
        </div>

        <div className="p-kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">REALIZED TRADING PROFIT</span>
            <div className="p-icon-pill pos">
              <TrendingUp size={15} />
            </div>
          </div>
          <div className={`kpi-main-val font-mono font-bold ${totalRealizedProfit >= 0 ? 'text-emerald' : 'text-pink'}`}>
            {totalRealizedProfit >= 0 ? '+' : ''}${totalRealizedProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="kpi-footer-sub">Win Rate: {winRate}% ({tradeLog.filter(t => t.type === 'SELL').length} closed trades)</span>
        </div>
      </div>

      {/* 2. Milestone Trophy Room Banner */}
      <div className="trophy-room-banner">
        <div className="trophy-title-row">
          <Trophy size={18} className="text-gold" />
          <h4>Wealth Milestone Trophies</h4>
        </div>
        <div className="trophy-ladder-row">
          {LEAGUE_TIERS.map((tier) => {
            const isUnlocked = totalNetWorth >= tier.minNetWorth;
            return (
              <div 
                key={tier.id}
                className={`trophy-tier-item ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="trophy-icon-wrap" style={{ borderColor: isUnlocked ? tier.color : 'rgba(255,255,255,0.1)' }}>
                  <span>{tier.badge}</span>
                </div>
                <div className="trophy-text font-mono">
                  <span className="trophy-name">{tier.name}</span>
                  <span className="trophy-thresh text-dim text-xs">${tier.minNetWorth.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Sector Allocation Hologram Bar */}
      {holdings.length > 0 && (
        <div className="sector-allocation-card">
          <div className="sector-alloc-header font-mono text-xs">
            <span>SECTOR DIVERSIFICATION LOADOUT</span>
            <span>{Object.keys(sectorMap).length} Sectors Active</span>
          </div>
          <div className="sector-bar-stacked">
            {Object.entries(sectorMap).map(([sector, val], idx) => {
              const pct = Math.round((val / totalHoldingVal) * 100);
              const colors = ['#06B6D4', '#10B981', '#A855F7', '#F59E0B', '#EC4899'];
              const col = colors[idx % colors.length];
              return (
                <div 
                  key={sector} 
                  className="sector-segment" 
                  style={{ width: `${pct}%`, backgroundColor: col }}
                  title={`${sector}: ${pct}% ($${val.toLocaleString()})`}
                />
              );
            })}
          </div>
          <div className="sector-legend-row font-mono text-xs">
            {Object.entries(sectorMap).map(([sector, val], idx) => {
              const pct = Math.round((val / totalHoldingVal) * 100);
              const colors = ['#06B6D4', '#10B981', '#A855F7', '#F59E0B', '#EC4899'];
              const col = colors[idx % colors.length];
              return (
                <div key={sector} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: col }} />
                  <span>{sector} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Stock Inventory Holdings Grid */}
      <div className="portfolio-inventory-panel">
        <div className="inventory-panel-header">
          <div className="title-with-icon">
            <Box size={18} className="text-cyan" />
            <h3>Equities Inventory ({holdings.length} Positions)</h3>
          </div>
          <button 
            type="button" 
            className="btn-add-more-stocks"
            onClick={() => { playSound('click'); setActiveTab('trading'); }}
          >
            <Plus size={14} /> Trade in Arena
          </button>
        </div>

        {holdings.length === 0 ? (
          <div className="empty-inventory-box">
            <Box size={44} className="text-dim" />
            <h4>Your Inventory Vault is Empty</h4>
            <p>Go to the Trading Arena and execute your AI companion's decision signals to acquire stock assets.</p>
            <button 
              type="button" 
              className="btn-jump-arena" 
              onClick={() => { playSound('click'); setActiveTab('trading'); }}
            >
              <span>Launch Trading Arena</span>
              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <div className="inventory-cards-grid">
            {holdings.map((h) => {
              const liveStock = stocks.find(s => s.symbol === h.symbol) || { price: h.avgPrice };
              const liveVal = h.shares * liveStock.price;
              const cost = h.shares * h.avgPrice;
              const gainLoss = liveVal - cost;
              const gainLossPct = cost > 0 ? (gainLoss / cost) * 100 : 0;
              const isProfit = gainLoss >= 0;

              return (
                <div key={h.symbol} className="inventory-asset-card">
                  <div className="inv-card-top">
                    <div className="inv-sym-avatar" style={{ color: h.logoColor || '#06B6D4', borderColor: `${h.logoColor || '#06B6D4'}60` }}>
                      {h.symbol.slice(0, 3)}
                    </div>
                    <div className="inv-sym-info">
                      <div className="inv-sym-name font-bold">{h.symbol}</div>
                      <span className="inv-sector-badge">{h.sector}</span>
                    </div>
                    <div className={`inv-pnl-chip font-mono ${isProfit ? 'pos' : 'neg'}`}>
                      {isProfit ? '+' : ''}{gainLossPct.toFixed(2)}%
                    </div>
                  </div>

                  <div className="inv-telemetry-grid font-mono text-xs">
                    <div className="tele-item">
                      <span className="lbl">Shares Owned:</span>
                      <span className="val font-bold text-pure">{h.shares}</span>
                    </div>
                    <div className="tele-item">
                      <span className="lbl">Avg Cost Basis:</span>
                      <span className="val">${h.avgPrice.toFixed(2)}</span>
                    </div>
                    <div className="tele-item">
                      <span className="lbl">Live Market Price:</span>
                      <span className="val">${liveStock.price.toFixed(2)}</span>
                    </div>
                    <div className="tele-item">
                      <span className="lbl">Total Position Value:</span>
                      <span className="val font-bold text-gold">${liveVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="inv-card-footer">
                    <div className={`pnl-dollar font-mono ${isProfit ? 'text-emerald' : 'text-pink'}`}>
                      {isProfit ? '+' : ''}${gainLoss.toFixed(2)} P&L
                    </div>

                    <button 
                      type="button" 
                      className="btn-inv-sell"
                      onClick={() => { playSound('click'); executeTrade(h.symbol, 'SELL', h.shares); }}
                    >
                      Sell All Positions
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Trade History Ledger */}
      {tradeLog.length > 0 && (
        <div className="portfolio-ledger-panel">
          <div className="inventory-panel-header">
            <div className="title-with-icon">
              <Clock size={16} className="text-cyan" />
              <h4>Recent Execution Telemetry</h4>
            </div>
          </div>

          <div className="trade-log-stream font-mono text-xs">
            {tradeLog.slice(0, 6).map((log) => (
              <div key={log.id} className="trade-log-row">
                <div className="log-left">
                  <span className={`log-type-tag ${log.type === 'BUY' ? 'buy' : 'sell'}`}>
                    {log.type}
                  </span>
                  <div>
                    <span className="log-sym font-bold">{log.shares} shares of {log.symbol}</span>
                    <span className="log-agent text-dim"> &bull; AI Co-Pilot: {log.agentUsed}</span>
                  </div>
                </div>

                <div className="log-right">
                  <div className="log-total font-bold">${log.total.toLocaleString()}</div>
                  {log.type === 'SELL' && (
                    <div className={`log-pnl ${log.profit >= 0 ? 'text-emerald' : 'text-pink'}`}>
                      {log.profit >= 0 ? '+' : ''}${log.profit} Profit
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
