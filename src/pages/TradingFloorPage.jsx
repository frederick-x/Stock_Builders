import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Search,
  Plus,
  Key,
  Globe,
  Radio
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import AgentOrb from '../components/AgentOrb';
import { fetchStockCandles, fetchStockNews } from '../services/realStockService';

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
    holdings,
    isFetchingLive,
    lastUpdated,
    marketDataSource,
    refreshStockPrices,
    addStockSymbol,
    customApiKey,
    setCustomApiKey,
    showToast
  } = useGame();

  const [tradeAction, setTradeAction] = useState('BUY'); // 'BUY' | 'SELL'
  const [sharesInput, setSharesInput] = useState('10');
  const [newTickerInput, setNewTickerInput] = useState('');
  const [timeframe, setTimeframe] = useState('1D'); // '1D' | '1W' | '1M'
  const [chartCandles, setChartCandles] = useState([]);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [liveNews, setLiveNews] = useState(null);
  const [showApiModal, setShowApiModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(customApiKey);

  const selectedStock = stocks.find(s => s.symbol === selectedStockSymbol) || stocks[0] || {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 128.50,
    basePrice: 128.50,
    changePercent: 0,
    sparkline: [128.5],
    sector: 'Technology',
    volatility: 'HIGH',
    logoColor: '#76B900'
  };

  const currentHolding = holdings.find(h => h.symbol === selectedStock.symbol);

  const numShares = parseFloat(sharesInput) || 0;
  const estimatedTotal = +(numShares * selectedStock.price).toFixed(2);

  // Load real candle chart points when selected stock or timeframe changes
  useEffect(() => {
    let isMounted = true;
    async function loadCandles() {
      setIsChartLoading(true);
      try {
        const points = await fetchStockCandles(selectedStock.symbol, timeframe, customApiKey);
        if (isMounted && points && points.length > 0) {
          setChartCandles(points);
        }
      } catch (err) {
        if (isMounted) {
          setChartCandles(selectedStock.sparkline || [selectedStock.basePrice, selectedStock.price]);
        }
      } finally {
        if (isMounted) setIsChartLoading(false);
      }
    }

    loadCandles();
    return () => { isMounted = false; };
  }, [selectedStock.symbol, timeframe, selectedStock.price, customApiKey]);

  // Load real company news for selected stock
  useEffect(() => {
    let isMounted = true;
    async function loadNews() {
      try {
        const news = await fetchStockNews(selectedStock.symbol, customApiKey);
        if (isMounted) setLiveNews(news);
      } catch (e) {
        if (isMounted) setLiveNews({ headline: selectedStock.news || 'Market news loading...', datetime: 'Live' });
      }
    }
    loadNews();
    return () => { isMounted = false; };
  }, [selectedStock.symbol, customApiKey]);

  const handleManualTrade = (e) => {
    e.preventDefault();
    if (numShares <= 0) return;
    executeTrade(selectedStock.symbol, tradeAction, numShares);
  };

  const handleAddTicker = async (e) => {
    e.preventDefault();
    if (!newTickerInput.trim()) return;
    const ok = await addStockSymbol(newTickerInput.trim());
    if (ok) setNewTickerInput('');
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setCustomApiKey(tempApiKey.trim());
    setShowApiModal(false);
    showToast('Market API Token saved successfully! Fetching fresh quotes...', 'success');
  };

  // Sparkline points for SVG rendering
  const activeChartPoints = chartCandles.length >= 3 ? chartCandles : (selectedStock.sparkline || [selectedStock.price, selectedStock.price]);

  return (
    <div className="trading-floor-container">
      {/* Top Live Market Status & Control Bar */}
      <div className="market-news-ticker-bar">
        <div className="news-badge-pill">
          <Radio size={14} className="text-emerald animate-pulse" />
          <span>LIVE MARKET FEED</span>
        </div>

        <div className="news-headline-text">
          <strong>{selectedStock.symbol} Market Flash:</strong> {liveNews ? liveNews.headline : (selectedStock.news || 'Loading real financial feed...')}
        </div>

        <div className="market-feed-controls">
          <div className="feed-sync-info font-mono text-xs">
            <span className="sync-dot live" />
            <span>{marketDataSource} &bull; {lastUpdated}</span>
          </div>

          <button 
            type="button" 
            className={`btn-sync-refresh ${isFetchingLive ? 'spinning' : ''}`}
            onClick={refreshStockPrices}
            title="Refresh Live Market Quotes"
            disabled={isFetchingLive}
          >
            <RefreshCw size={13} />
            <span>{isFetchingLive ? 'Syncing...' : 'Sync Live'}</span>
          </button>

          <button 
            type="button" 
            className="btn-api-settings"
            onClick={() => setShowApiModal(true)}
            title="Configure Real Market API Token"
          >
            <Key size={13} />
            <span>API Feed</span>
          </button>
        </div>
      </div>

      {/* Main Trading Floor Grid Layout */}
      <div className="trading-floor-grid">
        {/* Left Column: Stocks Watchlist & Real Ticker Search */}
        <div className="stocks-ticker-panel">
          <div className="panel-sub-header">
            <span className="panel-title">LIVE MARKET ASSETS</span>
            <span className="live-pulse-badge">
              <span className="pulse-dot" /> REAL-TIME QUOTES
            </span>
          </div>

          {/* Add Any Real Stock Symbol Search Bar */}
          <form onSubmit={handleAddTicker} className="add-ticker-form">
            <Search size={14} className="search-icon-mini text-dim" />
            <input 
              type="text" 
              placeholder="Add Ticker (e.g. META, GOOGL)..."
              value={newTickerInput}
              onChange={(e) => setNewTickerInput(e.target.value.toUpperCase())}
              className="input-add-ticker font-mono"
            />
            <button type="submit" className="btn-add-ticker" title="Add to Live Watchlist">
              <Plus size={14} />
            </button>
          </form>

          {/* Stocks Scroll List */}
          <div className="stocks-scroll-list">
            {stocks.map((stock) => {
              const isSelected = stock.symbol === selectedStock.symbol;
              const isPositive = (stock.changePercent || 0) >= 0;
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
                    <div className="price-val font-mono">${(stock.price || 0).toFixed(2)}</div>
                    <div className={`change-pill ${isPositive ? 'pos' : 'neg'}`}>
                      {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span>{isPositive ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%</span>
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
                <div className="chart-title-flex">
                  <h2>{selectedStock.name} ({selectedStock.symbol})</h2>
                  <span className="live-tag-pill">● REAL QUOTE</span>
                </div>
                <span className="sector-tag">{selectedStock.sector}</span>
              </div>

              <div className="chart-price-and-timeframe">
                <div className="chart-price-group">
                  <div className="big-price font-mono font-bold">
                    ${(selectedStock.price || 0).toFixed(2)}
                  </div>
                  <div className={`chart-delta ${(selectedStock.changePercent || 0) >= 0 ? 'pos' : 'neg'}`}>
                    {(selectedStock.changePercent || 0) >= 0 ? '+' : ''}{(selectedStock.changePercent || 0).toFixed(2)}%
                    <span className="change-abs font-mono text-xs">
                      ({(selectedStock.change || 0) >= 0 ? '+' : ''}${(selectedStock.change || 0).toFixed(2)})
                    </span>
                  </div>
                </div>

                {/* Real Timeframe Selector */}
                <div className="timeframe-pills">
                  {['1D', '1W', '1M'].map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      className={`btn-tf ${timeframe === tf ? 'active' : ''}`}
                      onClick={() => setTimeframe(tf)}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Real SVG Historical Trend Chart */}
            <div className="svg-chart-container">
              {isChartLoading && (
                <div className="chart-loading-overlay">
                  <RefreshCw size={20} className="spinning text-emerald" />
                  <span>Loading Real Market Trajectory...</span>
                </div>
              )}
              <svg className="live-chart-svg" viewBox="0 0 500 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={(selectedStock.changePercent || 0) >= 0 ? '#10B981' : '#F43F5E'} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={(selectedStock.changePercent || 0) >= 0 ? '#10B981' : '#F43F5E'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {(() => {
                  const min = Math.min(...activeChartPoints);
                  const max = Math.max(...activeChartPoints);
                  const range = max - min || 1;
                  const points = activeChartPoints
                    .map((val, idx) => {
                      const x = (idx / (activeChartPoints.length - 1)) * 480 + 10;
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
                        stroke={(selectedStock.changePercent || 0) >= 0 ? '#10B981' : '#F43F5E'}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={points}
                      />
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Real Day Market Metrics Strip */}
            <div className="chart-metrics-strip">
              <div className="c-stat">Day High: <strong className="font-mono text-emerald">${(selectedStock.high || selectedStock.price).toFixed(2)}</strong></div>
              <div className="c-stat">Day Low: <strong className="font-mono text-pink">${(selectedStock.low || selectedStock.price).toFixed(2)}</strong></div>
              <div className="c-stat">Prev Close: <strong className="font-mono">${(selectedStock.prevClose || selectedStock.basePrice || selectedStock.price).toFixed(2)}</strong></div>
              <div className="c-stat">Open: <strong className="font-mono">${(selectedStock.open || selectedStock.price).toFixed(2)}</strong></div>
              <div className="c-stat">Agent Signal Accuracy: <strong className="text-cyan">{activeAgent.stats.accuracy}%</strong></div>
            </div>
          </div>

          {/* AGENT ADVISORY DECISION HUD (Calibrated with Real Market Data) */}
          {agentAdvice && (
            <div className="agent-advice-hud-card">
              <div className="hud-top-strip">
                <div className="hud-agent-identity">
                  <AgentOrb color={activeAgent.orbColor || 'violet'} size="sm" pulse={true} />
                  <div>
                    <div className="agent-hud-name">
                      {activeAgent.name}'S REAL-MARKET SIGNAL
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
              <label>Live Market Execution Price</label>
              <div className="read-only-price font-mono">
                ${(selectedStock.price || 0).toFixed(2)} USD
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
              {tradeAction === 'BUY' ? `Buy ${sharesInput || 0} ${selectedStock.symbol} ($${estimatedTotal.toLocaleString()})` : `Sell ${sharesInput || 0} ${selectedStock.symbol}`}
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

      {/* API Key Settings Modal */}
      {showApiModal && (
        <div className="modal-backdrop-overlay" onClick={() => setShowApiModal(false)}>
          <div className="modal-glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head-row">
              <div className="modal-title-wrap">
                <Globe size={18} className="text-cyan" />
                <h3>Real-Time Financial Market Feed Settings</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setShowApiModal(false)}>&times;</button>
            </div>

            <p className="modal-desc-p">
              The platform connects to live financial data streams (Finnhub & Yahoo Finance) to deliver authentic, real-world stock market quotes, prices, and daily metrics.
            </p>

            <form onSubmit={handleSaveApiKey} className="api-config-form">
              <div className="form-item">
                <label>Custom Finnhub API Key (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Enter free API key or leave blank for default sandbox feed"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="input-api-token font-mono"
                />
                <span className="hint-text">
                  A free token is included by default. You can also paste your own free key from <a href="https://finnhub.io" target="_blank" rel="noreferrer">Finnhub.io</a> for higher rate limits.
                </span>
              </div>

              <div className="modal-btn-row">
                <button type="button" className="btn-secondary" onClick={() => setShowApiModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save & Sync Market Feed</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
