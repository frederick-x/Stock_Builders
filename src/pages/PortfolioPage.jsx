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
  Clock
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function PortfolioPage({ setActiveTab }) {
  const { 
    cashBalance, 
    holdingsMarketValue, 
    totalNetWorth, 
    unrealizedProfit, 
    totalRealizedProfit, 
    holdings, 
    stocks, 
    executeTrade, 
    tradeLog 
  } = useGame();

  return (
    <div className="portfolio-page-container">
      {/* KPI Stats Grid */}
      <div className="portfolio-kpi-grid">
        <div className="p-kpi-card highlight">
          <div className="kpi-top-row">
            <span className="kpi-label">Total Portfolio Net Worth</span>
            <Coins size={18} className="text-emerald" />
          </div>
          <div className="kpi-main-val font-mono font-bold">
            ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="kpi-footer-sub">
            Cash: ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} &bull; Stocks: ${holdingsMarketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Unrealized Stock P&L</span>
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
            <span className="kpi-label">Total Realized Trading Profit</span>
            <div className="p-icon-pill pos">
              <TrendingUp size={15} />
            </div>
          </div>
          <div className={`kpi-main-val font-mono font-bold ${totalRealizedProfit >= 0 ? 'text-emerald' : 'text-pink'}`}>
            {totalRealizedProfit >= 0 ? '+' : ''}${totalRealizedProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="kpi-footer-sub">Accumulated from closed sell orders</span>
        </div>
      </div>

      {/* Main Holdings Table */}
      <div className="portfolio-holdings-panel">
        <div className="holdings-panel-header">
          <div className="panel-title-group">
            <Layers size={18} className="text-cyan" />
            <h3>Open Stock Holdings ({holdings.length})</h3>
          </div>
          <button 
            type="button" 
            className="btn-add-more-stocks"
            onClick={() => setActiveTab('trading')}
          >
            <Plus size={14} /> Buy More Stocks
          </button>
        </div>

        {holdings.length === 0 ? (
          <div className="empty-holdings-box">
            <PieChart size={42} className="text-dim" />
            <h4>No open stock positions yet</h4>
            <p>Go to the Trading Floor and execute your active agent's decision signals to build your portfolio.</p>
            <button 
              type="button" 
              className="btn-primary" 
              onClick={() => setActiveTab('trading')}
            >
              Open Trading Floor
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="game-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Sector</th>
                  <th>Shares Owned</th>
                  <th>Avg Cost</th>
                  <th>Live Price</th>
                  <th>Total Market Value</th>
                  <th>Open P&L</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const liveStock = stocks.find(s => s.symbol === h.symbol) || { price: h.avgPrice };
                  const liveVal = h.shares * liveStock.price;
                  const cost = h.shares * h.avgPrice;
                  const gainLoss = liveVal - cost;
                  const gainLossPct = cost > 0 ? (gainLoss / cost) * 100 : 0;

                  return (
                    <tr key={h.symbol} className="game-table-row">
                      <td>
                        <div className="asset-td-cell">
                          <div className="asset-avatar-mini" style={{ color: h.logoColor, borderColor: `${h.logoColor}60` }}>
                            {h.symbol.slice(0, 3)}
                          </div>
                          <div>
                            <div className="font-bold text-pure">{h.symbol}</div>
                            <div className="text-dim text-xs">{h.name}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="sector-badge">{h.sector}</span></td>
                      <td className="font-mono font-semibold">{h.shares}</td>
                      <td className="font-mono">${h.avgPrice.toFixed(2)}</td>
                      <td className="font-mono font-bold">${liveStock.price.toFixed(2)}</td>
                      <td className="font-mono font-bold text-gold">${liveVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>
                        <div className={`pnl-pill ${gainLoss >= 0 ? 'pos' : 'neg'}`}>
                          {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)} ({gainLossPct.toFixed(2)}%)
                        </div>
                      </td>
                      <td>
                        <div className="table-actions-right">
                          <button 
                            type="button" 
                            className="btn-tbl-sell"
                            onClick={() => executeTrade(h.symbol, 'SELL', h.shares)}
                          >
                            Sell All
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Trade History Ledger */}
      {tradeLog.length > 0 && (
        <div className="portfolio-ledger-panel">
          <div className="holdings-panel-header">
            <div className="panel-title-group">
              <Clock size={16} className="text-cyan" />
              <h4>Recent Execution History</h4>
            </div>
          </div>

          <div className="trade-log-stream">
            {tradeLog.slice(0, 5).map((log) => (
              <div key={log.id} className="trade-log-row">
                <div className="log-left">
                  <span className={`log-type-tag ${log.type === 'BUY' ? 'buy' : 'sell'}`}>
                    {log.type}
                  </span>
                  <div>
                    <span className="log-sym font-bold">{log.shares} shares of {log.symbol}</span>
                    <span className="log-agent text-xs text-dim"> &bull; Signal by {log.agentUsed}</span>
                  </div>
                </div>

                <div className="log-right font-mono">
                  <div className="log-total font-bold">${log.total.toLocaleString()}</div>
                  {log.type === 'SELL' && (
                    <div className={`log-pnl text-xs ${log.profit >= 0 ? 'text-emerald' : 'text-pink'}`}>
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
