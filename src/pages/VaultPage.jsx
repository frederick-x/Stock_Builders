import React from 'react';
import { 
  Coins, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Sparkles, 
  Clock, 
  Layers, 
  AlertCircle 
} from 'lucide-react';
import { useNexora } from '../context/NexoraContext';

export default function VaultPage() {
  const { 
    tokenBalance, 
    tokensEarned, 
    tokensSpent, 
    depositVirtualTokens, 
    activityLog 
  } = useNexora();

  const netProfit = tokensEarned - tokensSpent;

  return (
    <div className="vault-page-container">
      {/* Simulation Disclaimer Banner */}
      <div className="vault-disclaimer-banner">
        <ShieldCheck size={18} className="text-cyan" />
        <div className="disclaimer-text">
          <strong>VIRTUAL IN-GAME TOKENS ONLY</strong> &bull; NEXORA is a risk-free strategy simulation. No cryptocurrency, blockchain, wallets, or real-money transactions exist in this ecosystem.
        </div>
      </div>

      {/* Vault KPI Cards */}
      <div className="vault-kpi-grid">
        <div className="vault-kpi-card highlight">
          <div className="kpi-head">
            <span className="kpi-title">Current Vault Balance</span>
            <Coins size={20} className="text-gold" />
          </div>
          <div className="kpi-balance-num text-gold">
            {tokenBalance.toLocaleString()} <span className="unit">V-Tokens</span>
          </div>
          <div className="kpi-grant-row">
            <button 
              type="button" 
              className="btn-grant-tokens"
              onClick={() => depositVirtualTokens(1000)}
            >
              <Plus size={14} /> Claim +1,000 Free Test Tokens
            </button>
          </div>
        </div>

        <div className="vault-kpi-card">
          <div className="kpi-head">
            <span className="kpi-title">Total Contract Payouts</span>
            <div className="icon-pill green"><ArrowUpRight size={16} /></div>
          </div>
          <div className="kpi-balance-num text-emerald">
            +{tokensEarned.toLocaleString()} <span className="unit">Tokens</span>
          </div>
          <span className="kpi-sub-text">From completed agent deliverables</span>
        </div>

        <div className="vault-kpi-card">
          <div className="kpi-head">
            <span className="kpi-title">Contract Escrow Spent</span>
            <div className="icon-pill pink"><ArrowDownRight size={16} /></div>
          </div>
          <div className="kpi-balance-num text-pink">
            -{tokensSpent.toLocaleString()} <span className="unit">Tokens</span>
          </div>
          <span className="kpi-sub-text">Allocated to hiring specialized talent</span>
        </div>

        <div className="vault-kpi-card">
          <div className="kpi-head">
            <span className="kpi-title">Net Simulation Profit</span>
            <div className="icon-pill cyan"><TrendingUp size={16} /></div>
          </div>
          <div className="kpi-balance-num text-cyan">
            +{netProfit.toLocaleString()} <span className="unit">Tokens</span>
          </div>
          <span className="kpi-sub-text">Overall agent capital efficiency</span>
        </div>
      </div>

      {/* Transaction Ledger */}
      <div className="vault-ledger-panel">
        <div className="ledger-header">
          <div className="ledger-title-group">
            <Clock size={18} className="text-cyan" />
            <h3>Simulated Transaction Ledger</h3>
          </div>
          <span className="ledger-badge">Real-time synced</span>
        </div>

        <div className="ledger-list">
          {activityLog.filter(a => a.tokens !== 0).map((tx) => (
            <div key={tx.id} className="ledger-item-row">
              <div className="ledger-item-left">
                <div className={`tx-icon-bubble ${tx.tokens > 0 ? 'pos' : 'neg'}`}>
                  {tx.tokens > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
                <div>
                  <div className="tx-title">{tx.title}</div>
                  <div className="tx-desc">{tx.description}</div>
                </div>
              </div>

              <div className="ledger-item-right">
                <div className={`tx-amount ${tx.tokens > 0 ? 'text-emerald' : 'text-pink'}`}>
                  {tx.tokens > 0 ? `+${tx.tokens}` : tx.tokens} Tokens
                </div>
                <span className="tx-time">{tx.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
