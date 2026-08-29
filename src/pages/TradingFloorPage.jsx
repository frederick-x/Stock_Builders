import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Bot, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Layers, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sliders, 
  RefreshCw,
  Award,
  ChevronRight
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import AgentOrb from '../components/AgentOrb';

export default function TradingFloorPage({ setActiveTab }) {
  const { 
    stocks, 
    selectedStockSymbol, 
    setSelectedStockSymbol, 
    activeAgent, 
    agentAdvice, 
    followAgentAdvice, 
    executeTrade, 
    cashBalance, 
    holdings 
  } = useGame();

  const [tradeAction, setTradeAction] = useState('BUY'); // 'BUY' | 'SELL'
  const [sharesInput, setSharesInput] = useState('10');

  const selectedStock = stocks.find(s => s.symbol === selectedStockSymbol) || stocks[0];
  const currentHolding = holdings.find(h => h.symbol === selectedStock.symbol);

  const numShares = parseFloat(sharesInput) || 0;
  const estimatedTotal = +(numShares * selectedStock.price).toFixed(2);

  const handleManualTrade = (e) => {
    e.preventDefault();
    if (numShares <= 0) return;
    executeTrade(selectedStock.symbol, tradeAction, numShares);
  };

  return (
    <div className="trading-floor-container">
      {/* Top News & Signal Alert Bar */}
      <div className="market-news-ticker-bar">
        <div className="news-badge-pill">
          <Zap size={14} className="text-gold" />
          <span>MARKET TICKER</span>
        </div>
        <div className="news-headline-text">
          <strong>{selectedStock.symbol} News Flash:</strong> {selectedStock.news}
        </div>
        <div className="volatility-tag">
          VOLATILITY: <span className="vol-val">{selectedStock.volatility}</span>
        </div>
      </div>

      {/* Main Trading Floor Grid Layout */}
      <div className="trading-floor-grid">
        {/* Left Column: Stocks Watchlist & Ticker Grid */}
        <div className="stocks-ticker-panel">
          <div className="panel-sub-header">
            <span className="panel-title">LIVE MARKET ASSETS</span>
            <span className="live-pulse-badge">
              <span className="pulse-dot" /> 3.5s TICKS
            </span>
          </div>

          <div className="stocks-scroll-list">
            {stocks.map((stock) => {
              const isSelected = stock.symbol === selectedStock.symbol;
              const isPositive = stock.changePercent >= 0;
              const userOwns = holdings.find(h => h.symbol === stock.symbol);

              return (
                <div
                  key={stock.symbol}
                  className={`stock-ticker-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedStockSymbol(stock.symbol)}
                >
                  <div className="ticker-left-info">
                    <div className="symbol-avatar-mini" style={{ color: stock.logoColor, borderColor: `${stock.logoColor}60` }}>
                      {stock.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="ticker-symbol-row">
                        <span className="symbol-text">{stock.symbol}</span>
                        {userOwns && <span className="owned-shares-badge">{userOwns.shares} Owned</span>}
                      </div>
                      <div className="ticker-name-text">{stock.name}</div>
                    </div>
                  </div>

                  <div className="ticker-right-price">
                    <div className="price-val font-mono">${stock.price.toFixed(2)}</div>
                    <div className={`change-pill ${isPositive ? 'pos' : 'neg'}`}>
                      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span>{isPositive ? '+' : ''}{stock.changePercent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Live Interactive Price Chart & Agent Advice HUD */}
        <div className="trading-center-stage">
          {/* Main Chart Card */}
          <div className="stock-chart-card">
            <div className="chart-header-row">
              <div className="chart-title-group">
                <h2>{selectedStock.name} ({selectedStock.symbol})</h2>
                <span className="sector-tag">{selectedStock.sector}</span>
              </div>

              <div className="chart-price-group">
                <div className="big-price font-mono font-bold">
                  ${selectedStock.price.toFixed(2)}
                </div>
                <div className={`chart-delta ${selectedStock.changePercent >= 0 ? 'pos' : 'neg'}`}>
                  {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent}%
                </div>
              </div>
            </div>

            {/* Simulated Live SVG Trend Chart */}
            <div className="svg-chart-container">
              <svg className="live-chart-svg" viewBox="0 0 500 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {(() => {
                  const min = Math.min(...selectedStock.sparkline);
                  const max = Math.max(...selectedStock.sparkline);
                  const range = max - min || 1;
                  const points = selectedStock.sparkline
                    .map((val, idx) => {
                      const x = (idx / (selectedStock.sparkline.length - 1)) * 480 + 10;
                      const y = 140 - ((val - min) / range) * 110;
                      return `${x},${y}`;
                    })
                    .join(' ');

                  const fillPoints = `10,150 ${points} 490,150`;

                  return (
                    <>
                      <polygon fill="url(#chartGrad)" points={fillPoints} />
                      <polyline
                        fill="none"
                        stroke={selectedStock.changePercent >= 0 ? '#10B981' : '#F43F5E'}
                        strokeWidth="3"
                        strokeLinecap="round"
                        points={points}
                      />
                    </>
                  );
                })()}
              </svg>
            </div>

            <div className="chart-metrics-strip">
              <div className="c-stat">Base: <strong>${selectedStock.basePrice.toFixed(2)}</strong></div>
              <div className="c-stat">Volatility: <strong>{selectedStock.volatility}</strong></div>
              <div className="c-stat">Agent Win Probability: <strong className="text-cyan">{activeAgent.stats.accuracy}%</strong></div>
            </div>
          </div>

          {/* AGENT ADVISORY DECISION HUD (Core Game Feature) */}
          {agentAdvice && (
            <div className="agent-advice-hud-card">
              <div className="hud-top-strip">
                <div className="hud-agent-identity">
                  <AgentOrb color={activeAgent.orbColor || 'violet'} size="sm" pulse={true} />
                  <div>
                    <div className="agent-hud-name">
                      {activeAgent.name}'S DECISION SIGNAL
                      <span className="badge-confidence">{agentAdvice.confidence} CONFIDENCE</span>
                    </div>
                    <div className="agent-hud-title">{activeAgent.title} &bull; {activeAgent.skillName}</div>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn-switch-agent-link"
                  onClick={() => setActiveTab('forge')}
                >
                  <Bot size={13} /> Switch Agent
                </button>
              </div>

              <div className="hud-speech-bubble">
                <p className="hud-reason-text">"{agentAdvice.reason}"</p>
              </div>

              <div className="hud-action-trigger-bar">
                <div className="hud-action-meta">
                  <span className={`signal-action-badge ${agentAdvice.action === 'BUY' ? 'buy' : 'sell'}`}>
                    SIGNAL: {agentAdvice.action}
                  </span>
                  <span className="signal-amount-hint">
                    Target: <strong>{agentAdvice.shares} shares</strong> (~${agentAdvice.estimatedCost.toLocaleString()})
                  </span>
                </div>

                <button 
                  type="button" 
                  className="btn-follow-agent"
                  onClick={followAgentAdvice}
                >
                  <Zap size={16} />
                  <span>EXECUTE {activeAgent.name}'S ADVICE (1-CLICK)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Manual Trade Terminal & Position Summary */}
        <div className="trade-terminal-panel">
          <div className="terminal-header">
            <span className="panel-title">ORDER TERMINAL</span>
            <span className="badge-stock-selected">{selectedStock.symbol}</span>
          </div>

          {/* Buy/Sell Mode Switcher */}
          <div className="order-mode-tabs">
            <button
              type="button"
              className={`order-tab-btn buy ${tradeAction === 'BUY' ? 'active' : ''}`}
              onClick={() => setTradeAction('BUY')}
            >
              Buy Stock
            </button>
            <button
              type="button"
              className={`order-tab-btn sell ${tradeAction === 'SELL' ? 'active' : ''}`}
              onClick={() => setTradeAction('SELL')}
            >
              Sell Stock
            </button>
          </div>

          <form onSubmit={handleManualTrade} className="terminal-form">
            <div className="form-item">
              <label>Market Execution Price</label>
              <div className="read-only-price font-mono">
                ${selectedStock.price.toFixed(2)} USD
              </div>
            </div>

            <div className="form-item">
              <div className="label-row">
                <label htmlFor="shares-range">Shares Quantity</label>
                <span className="shares-counter font-mono">{sharesInput} Shares</span>
              </div>
              <input
                id="shares-range"
                type="number"
                min="1"
                step="1"
                className="input-shares-field font-mono"
                value={sharesInput}
                onChange={(e) => setSharesInput(e.target.value)}
                required
              />
            </div>

            {/* Quick Share Buttons */}
            <div className="quick-shares-row">
              {['5', '10', '25', '50', '100'].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  className="btn-quick-share"
                  onClick={() => setSharesInput(qty)}
                >
                  {qty}
                </button>
              ))}
            </div>

            <div className="order-cost-breakdown">
              <div className="breakdown-row">
                <span>Estimated Order Total:</span>
                <strong className="font-mono text-gold">${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="breakdown-row">
                <span>Available Cash:</span>
                <strong className="font-mono text-emerald">${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>

            <button
              type="submit"
              className={`btn-execute-order ${tradeAction === 'BUY' ? 'buy' : 'sell'}`}
            >
              {tradeAction === 'BUY' ? `Buy ${sharesInput || 0} ${selectedStock.symbol}` : `Sell ${sharesInput || 0} ${selectedStock.symbol}`}
            </button>
          </form>

          {/* Current Position in this Stock */}
          <div className="current-position-box">
            <div className="pos-head">Your {selectedStock.symbol} Position</div>
            {currentHolding ? (
              <div className="pos-data-grid">
                <div>Shares: <strong className="font-mono">{currentHolding.shares}</strong></div>
                <div>Avg Cost: <strong className="font-mono">${currentHolding.avgPrice.toFixed(2)}</strong></div>
                <div>Market Val: <strong className="font-mono">${(currentHolding.shares * selectedStock.price).toFixed(2)}</strong></div>
                <div>
                  P&L: <strong className={`font-mono ${(selectedStock.price - currentHolding.avgPrice) >= 0 ? 'text-emerald' : 'text-pink'}`}>
                    {((selectedStock.price - currentHolding.avgPrice) * currentHolding.shares) >= 0 ? '+' : ''}
                    ${((selectedStock.price - currentHolding.avgPrice) * currentHolding.shares).toFixed(2)}
                  </strong>
                </div>
              </div>
            ) : (
              <span className="no-pos-text">No open shares owned in {selectedStock.symbol}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
