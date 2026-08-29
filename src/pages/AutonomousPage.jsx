import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  FastForward, 
  Target, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  MessageSquareCode, 
  Coins, 
  Award, 
  ChevronRight,
  Zap,
  Sliders,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useNexora } from '../context/NexoraContext';
import { AGENT_STAGES, STAGE_DESCRIPTIONS } from '../services/agentService';
import { PRESET_GOALS } from '../services/mockData';
import AgentOrb from '../components/AgentOrb';

export default function AutonomousPage({ setActivePage }) {
  const { 
    userAgent, 
    currentGoal, 
    setCurrentGoal,
    agentStage, 
    agentThought, 
    isAutonomousRunning, 
    simulationSpeed, 
    setSimulationSpeed, 
    selectedTargetAgent,
    startAutonomous, 
    pauseAutonomous, 
    resumeAutonomous, 
    stopAutonomous,
    tokenBalance,
    showToast
  } = useNexora();

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const stageInfo = STAGE_DESCRIPTIONS[agentStage] || STAGE_DESCRIPTIONS.IDLE;

  const stagesList = [
    { id: AGENT_STAGES.SEARCHING, label: 'Discovery' },
    { id: AGENT_STAGES.COMPARING, label: 'Evaluation' },
    { id: AGENT_STAGES.NEGOTIATING, label: 'Negotiation' },
    { id: AGENT_STAGES.JOB_IN_PROGRESS, label: 'Contract Job' },
    { id: AGENT_STAGES.COMPLETED, label: 'Reward & Escrow' },
  ];

  const handleSelectGoal = (goal) => {
    setCurrentGoal(goal);
    setIsGoalModalOpen(false);
    showToast(`Active goal updated to: ${goal.title}`, 'info');
    if (isAutonomousRunning) {
      startAutonomous(goal);
    }
  };

  return (
    <div className="autonomous-page-container">
      {/* Top Controls Header */}
      <div className="autonomous-top-bar">
        <div className="autonomous-title-block">
          <div className="live-status-pill">
            <span className={`pulse-indicator ${isAutonomousRunning ? 'active' : 'idle'}`} />
            <span>{isAutonomousRunning ? 'AUTONOMOUS LOOP RUNNING' : 'STANDBY MODE'}</span>
          </div>
          <h2>{userAgent.name} Autonomous Room</h2>
        </div>

        <div className="autonomous-actions-group">
          {/* Simulation Speed Switcher */}
          <div className="speed-toggle-group">
            <span className="speed-label">SPEED:</span>
            {[1, 2, 5].map(spd => (
              <button
                key={spd}
                type="button"
                className={`btn-speed ${simulationSpeed === spd ? 'active' : ''}`}
                onClick={() => setSimulationSpeed(spd)}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Core Controls */}
          {!isAutonomousRunning ? (
            <button 
              type="button" 
              className="btn-auto-primary"
              onClick={() => startAutonomous()}
            >
              <Play size={16} fill="#042F1D" />
              <span>ACTIVATE AGENT</span>
            </button>
          ) : (
            <>
              <button 
                type="button" 
                className="btn-auto-warning"
                onClick={pauseAutonomous}
              >
                <Pause size={16} />
                <span>PAUSE</span>
              </button>
              <button 
                type="button" 
                className="btn-auto-danger"
                onClick={stopAutonomous}
              >
                <Square size={16} />
                <span>STOP</span>
              </button>
            </>
          )}

          <button 
            type="button" 
            className="btn-auto-secondary"
            onClick={() => setIsGoalModalOpen(true)}
          >
            <Target size={15} />
            <span>Change Goal</span>
          </button>
        </div>
      </div>

      {/* Centerpiece Arena: Big Animated Glowing Agent Orb */}
      <div className="autonomous-center-arena">
        {/* Holographic Radar Rings */}
        <div className={`cyber-radar-ring ${isAutonomousRunning ? 'active' : ''}`} />
        <div className={`cyber-radar-ring outer ${isAutonomousRunning ? 'active' : ''}`} />

        <div className="center-orb-showcase">
          <AgentOrb 
            color={userAgent.orbColor || 'violet'} 
            size="hero" 
            pulse={isAutonomousRunning}
            isAnimated={true}
          />
          <div className="orb-callsign-pill">
            <span className="name">{userAgent.name}</span>
            <span className="status" style={{ color: stageInfo.color }}>&bull; {stageInfo.statusText}</span>
          </div>
        </div>

        {/* Current Focused Action Display */}
        <div className="focused-action-card">
          <div className="action-tag-row">
            <span className="action-tag" style={{ borderColor: stageInfo.color, color: stageInfo.color }}>
              CURRENT STAGE: {agentStage}
            </span>
            <span className="action-agent-ref">
              Collaborator: <strong>{selectedTargetAgent?.name || 'Scanning Node...'}</strong>
            </span>
          </div>

          <div className="thought-quote-box">
            <p className="thought-quote-text">"{agentThought}"</p>
          </div>

          <div className="action-sub-hint">
            <Sparkles size={14} className="text-cyan" />
            <span>{stageInfo.actionText}</span>
          </div>
        </div>
      </div>

      {/* Pipeline Stage Tracker */}
      <div className="autonomous-stages-strip">
        {stagesList.map((stage, idx) => {
          const isCurrent = agentStage === stage.id;
          const isPassed = stagesList.findIndex(s => s.id === agentStage) > idx;

          return (
            <div 
              key={stage.id} 
              className={`stage-strip-node ${isCurrent ? 'current' : ''} ${isPassed ? 'passed' : ''}`}
            >
              <div className="stage-dot-wrap">
                {isPassed ? (
                  <CheckCircle2 size={16} className="text-emerald" />
                ) : (
                  <span className="stage-num">{idx + 1}</span>
                )}
              </div>
              <span className="stage-label">{stage.label}</span>
              {idx < stagesList.length - 1 && <div className="stage-strip-line" />}
            </div>
          );
        })}
      </div>

      {/* Goal & Target Talent Metadata Box */}
      <div className="autonomous-bottom-grid">
        <div className="auto-info-panel">
          <div className="panel-title-row">
            <div className="panel-title-group">
              <Target size={18} className="text-cyan" />
              <h4>Active Objective</h4>
            </div>
            <button 
              type="button" 
              className="btn-text-sm"
              onClick={() => setIsGoalModalOpen(true)}
            >
              Switch Goal
            </button>
          </div>

          <div className="goal-detail-body">
            <div className="goal-detail-title">{currentGoal.title}</div>
            <p className="goal-detail-desc">{currentGoal.description}</p>
            <div className="goal-pills-row">
              <span className="pill-item">Category: <strong>{currentGoal.category}</strong></span>
              <span className="pill-item">Budget Cap: <strong>{currentGoal.suggestedBudget} V-Tokens</strong></span>
              <span className="pill-item">Est. Yield: <strong>+{currentGoal.expectedTokensEarn} Tokens</strong></span>
            </div>
          </div>
        </div>

        <div className="auto-info-panel">
          <div className="panel-title-row">
            <div className="panel-title-group">
              <MessageSquareCode size={18} className="text-pink" />
              <h4>Candidate Agent Match</h4>
            </div>
            <button 
              type="button" 
              className="btn-text-sm"
              onClick={() => setActivePage('negotiation')}
            >
              Enter Negotiation Room &rarr;
            </button>
          </div>

          <div className="target-agent-summary-row">
            <AgentOrb color={selectedTargetAgent.orbColor || 'pink'} size="md" pulse={true} />
            <div className="target-meta">
              <div className="target-name-row">
                <span className="target-name">{selectedTargetAgent.name}</span>
                <span className="target-title">{selectedTargetAgent.title}</span>
              </div>
              <div className="target-stats-line">
                <span>{selectedTargetAgent.rank}</span>
                <span>&bull;</span>
                <span>{selectedTargetAgent.reputation}% Rep</span>
                <span>&bull;</span>
                <span>Base: {selectedTargetAgent.basePrice} Tokens</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHANGE GOAL MODAL */}
      {isGoalModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsGoalModalOpen(false)}>
          <div className="modal-card modal-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Target size={20} className="text-cyan" />
                <div>
                  <h3>Select New Autonomous Goal</h3>
                  <p className="modal-subtitle">Choose a pre-configured mission or configure a custom task</p>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="preset-goals-list">
                {PRESET_GOALS.map((g) => {
                  const isSelected = currentGoal.id === g.id;
                  return (
                    <div 
                      key={g.id}
                      className={`goal-select-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectGoal(g)}
                    >
                      <div className="goal-select-top">
                        <span className="goal-select-category">{g.category}</span>
                        <span className="goal-select-budget">{g.suggestedBudget} V-Tokens</span>
                      </div>
                      <div className="goal-select-title">{g.title}</div>
                      <p className="goal-select-desc">{g.description}</p>
                      <div className="goal-select-footer">
                        <span>Candidate: <strong>{g.targetAgent}</strong></span>
                        <span className="text-emerald">Est. Yield: +{g.expectedTokensEarn} Tokens</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="modal-footer-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setIsGoalModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
