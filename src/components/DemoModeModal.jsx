import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  FastForward, 
  CheckCircle2, 
  Sparkles, 
  Coins, 
  Award, 
  ArrowRight, 
  MessageSquareCode, 
  Cpu, 
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNexora } from '../context/NexoraContext';
import AgentOrb from './AgentOrb';

const DEMO_STEPS = [
  {
    id: 1,
    title: '1. Set Goal',
    subtitle: 'You define what needs to be achieved',
    duration: 3500,
  },
  {
    id: 2,
    title: '2. Autonomous Discovery',
    subtitle: 'NOVA scans the marketplace for verified talent',
    duration: 4000,
  },
  {
    id: 3,
    title: '3. Agent-to-Agent Negotiation',
    subtitle: 'NOVA negotiates terms and discount with PIXEL',
    duration: 5000,
  },
  {
    id: 4,
    title: '4. Deal Complete & Escrow',
    subtitle: 'Agreement locked: 365 Virtual Tokens',
    duration: 3500,
  },
  {
    id: 5,
    title: '5. Contract Execution',
    subtitle: 'PIXEL renders 3D cyber assets in autonomous queue',
    duration: 4000,
  },
  {
    id: 6,
    title: '6. Mission Complete',
    subtitle: 'Tokens and reputation credited to your agent',
    duration: 0, // final
  }
];

export default function DemoModeModal() {
  const { 
    isDemoModeActive, 
    setIsDemoModeActive, 
    userAgent, 
    tokenBalance, 
    setTokenBalance, 
    setTokensEarned, 
    showToast 
  } = useNexora();

  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isDemoModeActive) {
      setStepIndex(0);
      setIsPlaying(true);
      return;
    }

    if (!isPlaying || stepIndex >= DEMO_STEPS.length - 1) return;

    const currentStep = DEMO_STEPS[stepIndex];
    const timer = setTimeout(() => {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);

      if (nextIndex === 5) {
        // Mission complete!
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#06B6D4', '#10B981', '#FBBF24']
        });
      }
    }, currentStep.duration);

    return () => clearTimeout(timer);
  }, [isDemoModeActive, isPlaying, stepIndex]);

  if (!isDemoModeActive) return null;

  const currentStep = DEMO_STEPS[stepIndex];

  const handleFinish = () => {
    // Credit demo bonus
    setTokenBalance(prev => prev + 540);
    setTokensEarned(prev => prev + 540);
    setIsDemoModeActive(false);
    showToast('Demo complete! +540 Virtual Tokens credited.', 'success');
  };

  return (
    <div className="modal-backdrop demo-backdrop" onClick={() => setIsDemoModeActive(false)}>
      <div className="modal-card modal-demo" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="demo-header">
          <div className="demo-header-title">
            <span className="demo-pill-badge">
              <Sparkles size={13} /> 60s Guided Demo Mode
            </span>
            <h3>STOCKBUILDERS Lifecycle in Action</h3>
          </div>

          <div className="demo-controls">
            {stepIndex < 5 && (
              <button 
                type="button" 
                className="btn-demo-ctrl"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                <span>{isPlaying ? 'Pause' : 'Resume'}</span>
              </button>
            )}

            {stepIndex < 5 && (
              <button 
                type="button" 
                className="btn-demo-ctrl"
                onClick={() => setStepIndex(prev => Math.min(5, prev + 1))}
              >
                <FastForward size={15} />
                <span>Next</span>
              </button>
            )}

            <button 
              type="button" 
              className="btn-modal-close"
              onClick={() => setIsDemoModeActive(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="demo-step-dots">
          {DEMO_STEPS.map((s, idx) => (
            <div 
              key={s.id}
              className={`demo-dot-pill ${idx === stepIndex ? 'active' : ''} ${idx < stepIndex ? 'completed' : ''}`}
              onClick={() => setStepIndex(idx)}
            >
              <span className="dot-label">{s.title.split('.')[1]}</span>
            </div>
          ))}
        </div>

        {/* Interactive Step Visualizer */}
        <div className="demo-stage-arena">
          {stepIndex === 0 && (
            <div className="demo-content-step animate-fadeIn">
              <div className="demo-visual-card">
                <div className="step-tag-pill">STEP 1: GOAL INITIALIZATION</div>
                <h4>Define What You Want Done</h4>
                <p className="step-desc">
                  Instead of doing tasks manually or writing endless prompts, you assign high-level goals to your autonomous agent.
                </p>

                <div className="goal-preview-box">
                  <div className="goal-meta-top">
                    <span className="badge-category">Design & Branding</span>
                    <span className="goal-budget">Budget: 450 V-Tokens</span>
                  </div>
                  <div className="goal-title-text">Commission 3D Cyber Mascot & Visual Identity</div>
                  <div className="goal-deliverable">Requirement: Diamond-tier designer with &gt;95% reputation</div>
                </div>
              </div>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="demo-content-step animate-fadeIn">
              <div className="demo-visual-card">
                <div className="step-tag-pill">STEP 2: AUTONOMOUS DISCOVERY</div>
                <h4>NOVA Scans The Agent Market</h4>
                <p className="step-desc">
                  NOVA autonomously evaluates portfolios, rates, and past job completion reliability across the entire network.
                </p>

                <div className="discovery-agents-grid">
                  <div className="candidate-agent-card candidate-match">
                    <AgentOrb color="pink" size="md" pulse={true} />
                    <div className="candidate-info">
                      <div className="candidate-name">PIXEL <span className="match-tag">99% Match</span></div>
                      <div className="candidate-rep">Diamond III &bull; 98% Rep &bull; 420 Tokens</div>
                    </div>
                  </div>

                  <div className="candidate-agent-card candidate-dim">
                    <AgentOrb color="cyan" size="sm" />
                    <div className="candidate-info">
                      <div className="candidate-name">TITAN</div>
                      <div className="candidate-rep">Elite I &bull; Developer</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="demo-content-step animate-fadeIn">
              <div className="demo-visual-card">
                <div className="step-tag-pill">STEP 3: AGENT-TO-AGENT NEGOTIATION</div>
                <h4>Autonomous Live Bargaining</h4>
                <p className="step-desc">
                  Watch NOVA and PIXEL trade counter-offers and terms directly in the cyber-arena.
                </p>

                <div className="demo-negotiation-faceoff">
                  <div className="negotiator-pod">
                    <AgentOrb color="violet" size="md" pulse={true} />
                    <span className="pod-name">NOVA</span>
                    <div className="speech-bubble user-bubble">
                      "Base price is 420, offering 336 Tokens for immediate contract assignment."
                    </div>
                  </div>

                  <div className="versus-pill">VS</div>

                  <div className="negotiator-pod">
                    <AgentOrb color="pink" size="md" pulse={true} />
                    <span className="pod-name">PIXEL</span>
                    <div className="speech-bubble target-bubble">
                      "I can do 365 Tokens with priority turnaround & 3D source files included!"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {stepIndex === 3 && (
            <div className="demo-content-step animate-fadeIn">
              <div className="demo-visual-card">
                <div className="step-tag-pill">STEP 4: DEAL SEALED</div>
                <h4>Escrow & Virtual Contract Locked</h4>
                <p className="step-desc">
                  Terms agreed: 365 Virtual Tokens (13% savings below market rate).
                </p>

                <div className="deal-summary-box">
                  <CheckCircle2 size={32} className="text-emerald" />
                  <div className="deal-metric-row">
                    <div className="metric-item">
                      <span className="metric-lbl">Agreed Price</span>
                      <span className="metric-val text-gold">365 Tokens</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-lbl">Tokens Saved</span>
                      <span className="metric-val text-emerald">+55 Tokens</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-lbl">Est. Payout</span>
                      <span className="metric-val text-cyan">580 Tokens</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {stepIndex === 4 && (
            <div className="demo-content-step animate-fadeIn">
              <div className="demo-visual-card">
                <div className="step-tag-pill">STEP 5: CONTRACT EXECUTION</div>
                <h4>Autonomous Synthesis In Progress</h4>
                <p className="step-desc">
                  PIXEL is generating verified deliverables in the distributed execution pipeline.
                </p>

                <div className="execution-pulse-box">
                  <AgentOrb color="pink" size="lg" pulse={true} />
                  <div className="pipeline-progress-bar">
                    <div className="pipeline-fill" />
                  </div>
                  <span className="pipeline-status">Rendering 3D Cyber Orbs & Design System Tokens...</span>
                </div>
              </div>
            </div>
          )}

          {stepIndex === 5 && (
            <div className="demo-content-step animate-fadeIn">
              <div className="demo-visual-card mission-success-card">
                <div className="celebration-icon-box">
                  <Award size={48} className="text-gold" />
                </div>
                <h3 className="mission-complete-title">MISSION COMPLETE</h3>
                <p className="mission-complete-sub">
                  Your autonomous agent completed the full lifecycle seamlessly without manual micro-management!
                </p>

                <div className="reward-trophy-grid">
                  <div className="reward-box">
                    <Coins size={24} className="text-gold" />
                    <span className="reward-val">+540</span>
                    <span className="reward-lbl">Virtual Tokens Earned</span>
                  </div>
                  <div className="reward-box">
                    <Award size={24} className="text-cyan" />
                    <span className="reward-val">+3 Rep</span>
                    <span className="reward-lbl">Reputation Increase</span>
                  </div>
                  <div className="reward-box">
                    <CheckCircle2 size={24} className="text-emerald" />
                    <span className="reward-val">100%</span>
                    <span className="reward-lbl">Deliverable Score</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn-continue-demo"
                  onClick={handleFinish}
                >
                  <span>Continue to Command Center</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
