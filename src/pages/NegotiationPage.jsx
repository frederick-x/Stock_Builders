import React, { useEffect, useRef } from 'react';
import { 
  MessageSquareCode, 
  Sparkles, 
  Coins, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  TrendingDown, 
  Zap,
  RotateCcw,
  Check
} from 'lucide-react';
import { useNexora } from '../context/NexoraContext';
import AgentOrb from '../components/AgentOrb';

export default function NegotiationPage({ setActivePage }) {
  const { 
    userAgent, 
    activeNegotiation, 
    selectedTargetAgent, 
    advanceNegotiationStep, 
    startNegotiationWith, 
    currentGoal,
    tokenBalance,
    completeContractExecution
  } = useNexora();

  const chatEndRef = useRef(null);

  useEffect(() => {
    // If no active negotiation exists, auto-initialize with selected target agent
    if (!activeNegotiation && selectedTargetAgent) {
      startNegotiationWith(selectedTargetAgent, currentGoal);
    }
  }, [activeNegotiation, selectedTargetAgent, currentGoal]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeNegotiation?.history]);

  if (!activeNegotiation) {
    return (
      <div className="empty-state-panel">
        <MessageSquareCode size={40} className="text-pink" />
        <h3>No Active Negotiation</h3>
        <p>Select an agent from the marketplace to initialize an autonomous bargaining session.</p>
        <button type="button" className="btn-primary" onClick={() => setActivePage('market')}>
          Open Agent Market
        </button>
      </div>
    );
  }

  const { targetAgent, history, isDealComplete, dealResult, currentRoundIndex, rounds } = activeNegotiation;
  const hasMoreRounds = currentRoundIndex < rounds.length - 1;

  const handleExecuteDeliverable = () => {
    completeContractExecution(targetAgent, Math.round(dealResult.agreedPrice * 1.6));
    setActivePage('home');
  };

  return (
    <div className="negotiation-page-container">
      {/* Top Banner */}
      <div className="negotiation-top-bar">
        <div className="negotiation-title-group">
          <div className="badge-room-pill">
            <span className="live-dot" />
            <span>AGENT NEGOTIATION ROOM &bull; PROTOCOL V4</span>
          </div>
          <h2>Live Bargaining Arena</h2>
          <p className="room-subtext">Objective: "{currentGoal.title}" &bull; Target Budget: {currentGoal.suggestedBudget} V-Tokens</p>
        </div>

        <div className="room-actions">
          <button 
            type="button" 
            className="btn-room-reset"
            onClick={() => startNegotiationWith(targetAgent, currentGoal)}
            title="Restart negotiation"
          >
            <RotateCcw size={15} />
            <span>Restart</span>
          </button>

          <button 
            type="button" 
            className="btn-room-switch"
            onClick={() => setActivePage('market')}
          >
            Switch Target Agent
          </button>
        </div>
      </div>

      {/* Face-off Visual Arena */}
      <div className="negotiation-faceoff-stage">
        <div className="faceoff-agent-pod left">
          <AgentOrb color={userAgent.orbColor || 'violet'} size="lg" pulse={true} />
          <div className="pod-meta">
            <span className="pod-callsign">{userAgent.name} (Your Agent)</span>
            <span className="pod-rank">{userAgent.rank} &bull; {userAgent.behavior}</span>
          </div>
        </div>

        {/* Center Price Pulse Hub */}
        <div className="faceoff-center-hub">
          <div className="negotiation-status-badge">
            {isDealComplete ? (
              <span className="deal-sealed-tag">
                <CheckCircle2 size={14} /> DEAL SEALED
              </span>
            ) : (
              <span className="bargaining-tag">
                <RefreshCw size={13} className="icon-spin" /> BARGAINING IN PROGRESS
              </span>
            )}
          </div>

          <div className="live-price-anchor">
            <span className="price-label">Current Offer</span>
            <span className="price-number">
              {history[history.length - 1]?.offer || targetAgent.basePrice} <span className="unit">Tokens</span>
            </span>
          </div>

          <div className="base-price-ref">
            <span>Base Listing: {targetAgent.basePrice} Tokens</span>
          </div>
        </div>

        <div className="faceoff-agent-pod right">
          <AgentOrb color={targetAgent.orbColor || 'pink'} size="lg" pulse={true} />
          <div className="pod-meta">
            <span className="pod-callsign">{targetAgent.name} (Candidate)</span>
            <span className="pod-rank">{targetAgent.rank} &bull; {targetAgent.category}</span>
          </div>
        </div>
      </div>

      {/* Dialogue Stream */}
      <div className="negotiation-dialogue-card">
        <div className="dialogue-header">
          <MessageSquareCode size={16} className="text-cyan" />
          <span>Autonomous Dialogue Protocol Log</span>
        </div>

        <div className="dialogue-scroll-area">
          {history.map((turn, idx) => {
            const isUserAgent = turn.sender === userAgent.name;
            return (
              <div key={idx} className={`chat-message-row ${isUserAgent ? 'msg-left' : 'msg-right'}`}>
                <div className="chat-avatar-thumb">
                  <AgentOrb color={turn.senderOrb || 'violet'} size="xs" />
                </div>
                <div className="chat-bubble-content">
                  <div className="chat-sender-header">
                    <span className="chat-sender-name">{turn.sender}</span>
                    <span className="chat-offer-pill">
                      Offer: <strong>{turn.offer} V-Tokens</strong>
                    </span>
                  </div>
                  <p className="chat-message-text">{turn.message}</p>
                  <div className="chat-rationale-note">
                    <Sparkles size={12} className="text-gold" />
                    <span><strong>Strategy:</strong> {turn.rationale}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Bottom Control / Deal Banner */}
        <div className="dialogue-footer-bar">
          {!isDealComplete ? (
            <div className="negotiation-ongoing-controls">
              <div className="ongoing-text">
                Round {currentRoundIndex + 1} of {rounds.length} &bull; Agents are finding common ground
              </div>
              <button 
                type="button" 
                className="btn-advance-round"
                onClick={advanceNegotiationStep}
              >
                <span>Advance Next Counter-Offer</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="deal-celebration-banner">
              <div className="deal-celebration-left">
                <div className="deal-icon-glow">
                  <Check size={22} className="text-emerald" />
                </div>
                <div>
                  <h4 className="deal-banner-title">Contract Terms Agreed!</h4>
                  <p className="deal-banner-desc">
                    {targetAgent.name} agreed to deliver verified assets for <strong>{dealResult.agreedPrice} Tokens</strong> ({dealResult.discountPercent}% below base rate).
                  </p>
                </div>
              </div>

              <div className="deal-celebration-actions">
                <button 
                  type="button" 
                  className="btn-execute-contract"
                  onClick={handleExecuteDeliverable}
                >
                  <Zap size={16} />
                  <span>Execute Job & Claim Payout</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
