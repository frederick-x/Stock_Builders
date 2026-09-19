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
  Radio,
  SlidersHorizontal,
  Flame,
  Info
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
    activeMarketEvent,
    customApiKey,
    setCustomApiKey,
    playSound,
    showToast
  } = useGame();

  const [tradeAction, setTradeAction] = useState('BUY'); // 'BUY' | 'SELL'
  const [sharesInput, setSharesInput] = useState('10');
  const [newTickerInput, setNewTickerInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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
    tier: 'Tier S',
    logoColor: '#76B900'
  };

  const currentHolding = holdings.find(h => h.symbol === selectedStock.symbol);
  const numShares = parseFloat(sharesInput) || 0;
  const estimatedTotal = +(numShares * selectedStock.price).toFixed(2);

  // Filter stocks by search query
  const filteredStocks = stocks.filter(s => 
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        if (isMounted) setLiveNews({ headline: selectedStock.news || 'Market news streaming live...', datetime: 'Live' });
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
    showToast('Market API Token saved! Live market sync active.', 'success');
  };

  // Quick preset buttons for shares
  const setQuickShares = (val) => {
    playSound('click');
    setSharesInput(String(val));
  };

  const setPercentShares = (pct) => {
    playSound('click');
    if (tradeAction === 'BUY') {
      const maxAffordable = Math.floor(cashBalance / selectedStock.price);
      const calculated = Math.max(1, Math.floor(maxAffordable * (pct / 100)));
      setSharesInput(String(calculated));
    } else if (tradeAction === 'SELL') {
      const owned = currentHolding ? currentHolding.shares : 0;
      const calculated = Math.max(1, Math.floor(owned * (pct / 100)));
      setSharesInput(String(calculated));
    }
  };

  // Sparkline points for SVG rendering
  const activeChartPoints = chartCandles.length >= 3 
    ? chartCandles 
    : (selectedStock.sparkline && selectedStock.sparkline.length > 1 ? selectedStock.sparkline : [selectedStock.basePrice || selectedStock.price, selectedStock.price]);

  const minPoint = Math.min(...activeChartPoints);
  const maxPoint = Math.max(...activeChartPoints);
  const range = maxPoint - minPoint || 1;

  // Generate SVG path for chart
  const svgWidth = 600;
  const svgHeight = 220;
  const pointsString = activeChartPoints.map((val, idx) => {
    const x = (idx / (activeChartPoints.length - 1 || 1)) * svgWidth;
    const y = svgHeight - 20 - ((val - minPoint) / range) * (svgHeight - 40);
    return `${x},${y}`;
  }).join(' ');

  const isUp = selectedStock.changePercent >= 0;
  const chartColor = isUp ? '#10B981' : '#EC4899';

  return (
    <div className="trading-arena-container">
      {/* 1. Top Ticker & Live Arena Status Bar */}
      <div className="arena-top-ticker-bar">
        <div className="ticker-live-tag">
          <Radio size={14} className="text-emerald animate-pulse" />
          <span>ARENA FEED</span>
        </div>

        <div className="ticker-news-headline">
          <strong>{selectedStock.symbol}:</strong> {liveNews ? liveNews.headline : (selectedStock.news || 'Streaming financial market intelligence...')}
        </div>

        <div className="ticker-controls-group">
          {activeMarketEvent && (
            <div className="event-pill-mini font-mono">
              <Flame size={13} className="text-gold" />
              <span>{activeMarketEvent.title}</span>
            </div>
          )}

          <div className="feed-sync-badge font-mono text-xs">
            <span className="sync-dot live" />
            <span>{lastUpdated || 'Live'}</span>
          </div>

          <button 
            type="button" 
            className={`btn-sync-icon ${isFetchingLive ? 'spinning' : ''}`}
            onClick={refreshStockPrices}
            title="Refresh market quotes"
          >
            <RefreshCw size={14} />
          </button>

          <button 
            type="button" 
            className="btn-api-key-pill"
            onClick={() => setShowApiModal(true)}
            title="Configure Finnhub API Key"
          >
            <Key size={13} /> {customApiKey ? 'Live Key' : 'Free Sandbox'}
          </button>
        </div>
      </div>

      {/* 2. Main Arena 3-Column Split */}
      <div className="arena-layout-split">
        {/* Left Column: Watchlist Arena Roster */}
        <div className="arena-watchlist-panel">
          <div className="watchlist-header">
            <div className="title-row-clean">
              <Layers size={16} className="text-cyan" />
              <h4>Market Watchlist</h4>
              <span className="watchlist-count font-mono">{filteredStocks.length}</span>
            </div>

            {/* Search Input */}
            <div className="watchlist-search-box">
              <Search size={14} className="text-dim" />
              <input 
                type="text"
                placeholder="Search ticker or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Watchlist Stock Cards */}
          <div className="watchlist-cards-scroll">
            {filteredStocks.map((stock) => {
              const isSelected = stock.symbol === selectedStock.symbol;
              const isPositive = stock.changePercent >= 0;
              const isHeld = holdings.some(h => h.symbol === stock.symbol);

              return (
                <div 
                  key={stock.symbol}
                  className={`watchlist-stock-card ${isSelected ? 'selected-active' : ''}`}
                  onClick={() => { playSound('click'); setSelectedStockSymbol(stock.symbol); }}
                >
                  <div className="stock-card-left">
                    <div className="stock-sym-row">
                      <span className="stock-symbol font-bold">{stock.symbol}</span>
                      {stock.tier && <span className="tier-tag font-mono">{stock.tier}</span>}
                      {isHeld && <span className="held-badge">OWNED</span>}
                    </div>
                    <span className="stock-name-label text-dim text-xs">{stock.name}</span>
                  </div>

                  <div className="stock-card-right font-mono">
                    <div className="stock-price-val font-bold">${stock.price.toFixed(2)}</div>
                    <div className={`stock-change-pill ${isPositive ? 'pos' : 'neg'}`}>
                      {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      <span>{isPositive ? '+' : ''}{stock.changePercent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Custom Ticker Form */}
          <form className="add-ticker-form" onSubmit={handleAddTicker}>
            <input 
              type="text"
              placeholder="+ Add any symbol (e.g. GOOG, META)"
              value={newTickerInput}
              onChange={(e) => setNewTickerInput(e.target.value)}
            />
            <button type="submit" className="btn-add-ticker-submit" title="Add live ticker">
              <Plus size={15} />
            </button>
          </form>
        </div>

        {/* Center Column: Interactive Hologram Chart & AI Companion Beacon */}
        <div className="arena-center-stage">
          {/* Stock Header Telemetry Bar */}
          <div className="selected-stock-header">
            <div className="stock-hero-info">
              <div className="sym-badge-avatar" style={{ color: selectedStock.logoColor, borderColor: `${selectedStock.logoColor}60` }}>
                {selectedStock.symbol.slice(0, 3)}
              </div>
              <div>
                <div className="sym-title-row">
                  <h2>{selectedStock.symbol}</h2>
                  <span className="sector-tag">{selectedStock.sector}</span>
                </div>
                <div className="stock-full-name text-dim">{selectedStock.name}</div>
              </div>
            </div>

            <div className="stock-price-telemetry">
              <div className="price-big font-mono font-bold">
                ${selectedStock.price.toFixed(2)}
              </div>
              <div className={`price-change-large font-mono font-bold ${isUp ? 'text-emerald' : 'text-pink'}`}>
                {isUp ? '+' : ''}{selectedStock.changePercent}% ({isUp ? '+' : ''}${selectedStock.change || ((selectedStock.price * selectedStock.changePercent) / 100).toFixed(2)})
              </div>
            </div>
          </div>

          {/* Chart Controls & Timeframe Bar */}
          <div className="chart-controls-bar">
            <div className="timeframe-toggles">
              {['1D', '1W', '1M', '1Y'].map((tf) => (
                <button 
                  key={tf}
                  type="button"
                  className={`btn-tf ${timeframe === tf ? 'active' : ''}`}
                  onClick={() => { playSound('click'); setTimeframe(tf); }}
                >
                  {tf}
                </button>
              ))}
            </div>

            <div className="chart-stats-summary font-mono text-xs">
              <span>HIGH: ${(selectedStock.high || selectedStock.price * 1.02).toFixed(2)}</span>
              <span>LOW: ${(selectedStock.low || selectedStock.price * 0.98).toFixed(2)}</span>
              <span>VOL: HIGH</span>
            </div>
          </div>

          {/* Interactive Futuristic Holographic Neon SVG Chart */}
          <div className="chart-canvas-wrapper">
            {isChartLoading && (
              <div className="chart-loading-overlay">
                <RefreshCw size={24} className="spinning text-cyan" />
                <span>Synchronizing telemetry matrix...</span>
              </div>
            )}

            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="hologram-svg-chart">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={chartColor} stopOpacity="0.4" />
                  <stop offset="70%" stopColor={chartColor} stopOpacity="0.08" />
                  <stop offset="100%" stopColor={chartColor} stopOpacity="0.0" />
                </linearGradient>
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Gridlines */}
              <line x1="0" y1="40" x2={svgWidth} y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2={svgWidth} y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="160" x2={svgWidth} y2="160" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              {/* Area Fill */}
              <polygon 
                points={`0,${svgHeight} ${pointsString} ${svgWidth},${svgHeight}`} 
                fill="url(#chartGradient)" 
              />

              {/* Glowing Neon Trendline */}
              <polyline 
                points={pointsString} 
                fill="none" 
                stroke={chartColor} 
                strokeWidth="3"
                filter="url(#neonGlow)"
              />

              {/* Real-time Pulsing Endpoint Beacon */}
              {activeChartPoints.length > 0 && (
                <circle 
                  cx={svgWidth} 
                  cy={svgHeight - 20 - ((selectedStock.price - minPoint) / range) * (svgHeight - 40)} 
                  r="5" 
                  fill={chartColor} 
                  className="animate-pulse"
                />
              )}
            </svg>
          </div>

          {/* AI Companion Tactical Signal Beacon Box */}
          {agentAdvice && (
            <div className="ai-signal-beacon-card">
              <div className="signal-left-col">
                <AgentOrb color={activeAgent.orbColor || 'violet'} size="sm" pulse={true} />
                <div>
                  <span className="signal-agent-name font-mono">{activeAgent.name} (LVL {activeAgent.level})</span>
                  <div className="signal-verdict-row">
                    <span className={`verdict-badge ${agentAdvice.action.toLowerCase()}`}>
                      {agentAdvice.action} SIGNAL
                    </span>
                    <span className="confidence-chip font-mono text-cyan">
                      {agentAdvice.confidence} Conviction
                    </span>
                  </div>
                </div>
              </div>

              <div className="signal-center-reason">
                <p>{agentAdvice.reason}</p>
              </div>

              <button 
                type="button" 
                className="btn-follow-ai-action"
                onClick={() => { playSound('click'); followAgentAdvice(); }}
              >
                <Zap size={15} fill="#042F1D" />
                <span>FOLLOW {agentAdvice.action} ORDER (+50 XP)</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Virtual Gaming Order Pad Terminal */}
        <div className="arena-order-terminal">
          <div className="terminal-header">
            <div className="title-row-clean">
              <SlidersHorizontal size={16} className="text-gold" />
              <h4>Virtual Order Pad</h4>
            </div>
            <span className="cash-avail-tag font-mono">
              Cash: ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* Action Switcher: BUY vs SELL */}
          <div className="action-toggle-grid">
            <button 
              type="button" 
              className={`btn-action-tab buy ${tradeAction === 'BUY' ? 'active' : ''}`}
              onClick={() => { playSound('click'); setTradeAction('BUY'); }}
            >
              BUY / LONG
            </button>
            <button 
              type="button" 
              className={`btn-action-tab sell ${tradeAction === 'SELL' ? 'active' : ''}`}
              onClick={() => { playSound('click'); setTradeAction('SELL'); }}
            >
              SELL / EXIT
            </button>
          </div>

          {/* Current Position Quick Status */}
          <div className="current-pos-card">
            <span className="pos-lbl">Current Position:</span>
            <span className="pos-val font-mono">
              {currentHolding ? `${currentHolding.shares} Shares (Avg $${currentHolding.avgPrice.toFixed(2)})` : '0 Shares (No open position)'}
            </span>
          </div>

          {/* Share Quantity Input & Presets */}
          <form className="order-form-body" onSubmit={handleManualTrade}>
            <div className="input-field-block">
              <label className="field-lbl">Number of Shares to Trade</label>
              <div className="shares-input-wrap">
                <input 
                  type="number"
                  min="1"
                  step="any"
                  value={sharesInput}
                  onChange={(e) => setSharesInput(e.target.value)}
                  className="font-mono font-bold"
                />
                <span className="input-suffix">SHARES</span>
              </div>
            </div>

            {/* Quick Share Preset Chips */}
            <div className="quick-shares-chips">
              {[1, 5, 10, 25, 50].map((qty) => (
                <button 
                  key={qty} 
                  type="button" 
                  className="btn-chip"
                  onClick={() => setQuickShares(qty)}
                >
                  +{qty}
                </button>
              ))}
            </div>

            {/* Percentage Allocation Buttons */}
            <div className="percent-shares-row">
              {[25, 50, 75, 100].map((pct) => (
                <button 
                  key={pct} 
                  type="button" 
                  className="btn-pct"
                  onClick={() => setPercentShares(pct)}
                >
                  {pct === 100 ? 'MAX' : `${pct}%`}
                </button>
              ))}
            </div>

            {/* Order Telemetry Breakdown */}
            <div className="order-telemetry-box font-mono text-xs">
              <div className="tele-row">
                <span>Unit Execution Price</span>
                <span>${selectedStock.price.toFixed(2)}</span>
              </div>
              <div className="tele-row">
                <span>Estimated XP Reward</span>
                <span className="text-cyan font-bold">+35 to +150 XP</span>
              </div>
              <div className="tele-row">
                <span>Companion Profit Booster</span>
                <span className="text-gold font-bold">+{activeAgent.stats.profitBonus}%</span>
              </div>
              <div className="tele-row">
                <span>Aegis Downside Shield</span>
                <span className="text-emerald font-bold">{activeAgent.stats.shield}% Protection</span>
              </div>
              <div className="tele-row total font-bold">
                <span>ESTIMATED TOTAL</span>
                <span className="text-pure text-sm">${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Big Punchy Action Button */}
            <button 
              type="submit" 
              className={`btn-submit-arena-order ${tradeAction === 'BUY' ? 'btn-buy-neon' : 'btn-sell-neon'}`}
            >
              <span>EXECUTE {tradeAction} ({numShares} {selectedStock.symbol})</span>
            </button>
          </form>
        </div>
      </div>

      {/* Finnhub API Key Modal */}
      {showApiModal && (
        <div className="game-modal-backdrop" onClick={() => setShowApiModal(false)}>
          <div className="api-config-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-row">
              <div className="title-row-clean">
                <Key size={18} className="text-cyan" />
                <h3>Custom Live Market API Key</h3>
              </div>
            </div>
            <p className="modal-desc">
              STOCKBUILDERS includes real live quotes by default. You can optionally paste your free <strong>Finnhub.io</strong> API key for personal rate limits.
            </p>
            <form onSubmit={handleSaveApiKey}>
              <input 
                type="text"
                placeholder="Paste Finnhub API Key (e.g. d28as...)"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="api-key-input font-mono"
              />
              <div className="modal-actions-row">
                <button type="button" className="btn-cancel" onClick={() => setShowApiModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save-key">
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
