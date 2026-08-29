import React, { useState } from 'react';
import { 
  Sparkles, 
  UserPlus, 
  CheckCircle2, 
  Sliders, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Zap, 
  RotateCw,
  Target
} from 'lucide-react';
import { useNexora } from '../context/NexoraContext';
import { PRESET_GOALS } from '../services/mockData';
import AgentOrb from '../components/AgentOrb';

const NAME_SUGGESTIONS = ['NOVA', 'VORTEX', 'SYNAPSE', 'AURORA', 'VALKYRIE', 'CYPHER', 'KINETIC', 'PRISM'];

export default function CreateAgentPage({ setActivePage }) {
  const { userAgent, setUserAgent, setCurrentGoal, startAutonomous, showToast } = useNexora();

  const [name, setName] = useState(userAgent.name || 'NOVA');
  const [orbColor, setOrbColor] = useState(userAgent.orbColor || 'violet');
  const [behavior, setBehavior] = useState(userAgent.behavior || 'BALANCED');
  const [selectedGoal, setSelectedGoal] = useState(PRESET_GOALS[0]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [traits, setTraits] = useState(userAgent.traits || {
    risk: 45,
    negotiation: 94,
    creativity: 86,
    reliability: 98,
  });

  const orbColorOptions = [
    { id: 'violet', label: 'Neon Violet', color: '#8B5CF6' },
    { id: 'cyan', label: 'Cyber Cyan', color: '#06B6D4' },
    { id: 'pink', label: 'Hyper Pink', color: '#EC4899' },
    { id: 'emerald', label: 'Matrix Mint', color: '#10B981' },
    { id: 'gold', label: 'Solar Gold', color: '#F59E0B' },
    { id: 'purple', label: 'Royal Plasma', color: '#A855F7' },
  ];

  const handleRandomName = () => {
    const random = NAME_SUGGESTIONS[Math.floor(Math.random() * NAME_SUGGESTIONS.length)];
    setName(random);
  };

  const handleSaveAndDeploy = (e) => {
    e.preventDefault();

    const updated = {
      ...userAgent,
      name: name.trim() || 'NOVA',
      orbColor,
      behavior,
      traits,
    };

    setUserAgent(updated);
    setCurrentGoal(selectedGoal);
    showToast(`Agent ${updated.name} synthesized and deployed!`, 'success');
    startAutonomous(selectedGoal);
    setActivePage('autonomous');
  };

  return (
    <div className="create-agent-page-container">
      {/* Top Banner */}
      <div className="create-hero-banner">
        <div className="badge-create-pill">
          <UserPlus size={14} className="text-purple" />
          <span>AGENT FORGE & SYNTHESIS</span>
        </div>
        <h2>Synthesize & Deploy Your AI Delegate</h2>
        <p>Customize your agent's visual avatar, strategic bargaining behavior, and initial mission objective.</p>
      </div>

      <form onSubmit={handleSaveAndDeploy} className="create-agent-grid-layout">
        {/* Left Column: Live Agent Avatar Preview */}
        <div className="agent-preview-card">
          <h4 className="preview-heading">Holographic Avatar Preview</h4>

          <div className="preview-orb-showcase">
            <AgentOrb color={orbColor} size="hero" pulse={true} isAnimated={true} />
            <div className="preview-name-tag">
              <span className="p-name">{name || 'AGENT'}</span>
              <span className="p-behavior">{behavior} PROTOCOL</span>
            </div>
          </div>

          {/* Color Palettes Picker */}
          <div className="color-palette-section">
            <span className="palette-label">Orb Energy Signature</span>
            <div className="color-dots-row">
              {orbColorOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`color-dot-btn ${orbColor === opt.id ? 'active' : ''}`}
                  style={{ backgroundColor: opt.color }}
                  onClick={() => setOrbColor(opt.id)}
                  title={opt.label}
                />
              ))}
            </div>
          </div>

          <div className="preview-perk-box">
            <ShieldCheck size={16} className="text-cyan" />
            <span>Equipped with Autonomous Negotiation Protocol V4</span>
          </div>
        </div>

        {/* Right Column: Configuration Controls */}
        <div className="agent-form-card">
          {/* Agent Name Input */}
          <div className="form-group-block">
            <div className="label-with-action">
              <label htmlFor="agent-name-input">Agent Callsign</label>
              <button 
                type="button" 
                className="btn-random-name"
                onClick={handleRandomName}
              >
                <RotateCw size={12} /> Randomize
              </button>
            </div>
            <input
              id="agent-name-input"
              type="text"
              className="input-text-dark"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. NOVA, VORTEX"
              required
            />
          </div>

          {/* Strategic Behavior Mode */}
          <div className="form-group-block">
            <label>Strategic Negotiation Behavior</label>
            <div className="behavior-cards-grid">
              <div 
                className={`behavior-card ${behavior === 'SAFE' ? 'selected' : ''}`}
                onClick={() => setBehavior('SAFE')}
              >
                <div className="behavior-head">
                  <span className="b-name">SAFE</span>
                  <span className="b-disc">10-15% Ask</span>
                </div>
                <p className="b-desc">Conservative bargaining, prioritizes high-reputation verified agents.</p>
              </div>

              <div 
                className={`behavior-card ${behavior === 'BALANCED' ? 'selected' : ''}`}
                onClick={() => setBehavior('BALANCED')}
              >
                <div className="behavior-head">
                  <span className="b-name text-cyan">BALANCED</span>
                  <span className="b-disc">18-22% Ask</span>
                </div>
                <p className="b-desc">Recommended. Optimal win-win compromise rate and speedy delivery.</p>
              </div>

              <div 
                className={`behavior-card ${behavior === 'BOLD' ? 'selected' : ''}`}
                onClick={() => setBehavior('BOLD')}
              >
                <div className="behavior-head">
                  <span className="b-name text-pink">BOLD</span>
                  <span className="b-disc">25-30% Ask</span>
                </div>
                <p className="b-desc">Aggressive discount bargaining. High token savings potential.</p>
              </div>
            </div>
          </div>

          {/* Initial Mission Goal */}
          <div className="form-group-block">
            <label>Initial Mission Goal</label>
            <div className="preset-goals-mini-list">
              {PRESET_GOALS.map((g) => (
                <div 
                  key={g.id}
                  className={`mini-goal-item ${selectedGoal.id === g.id ? 'active' : ''}`}
                  onClick={() => setSelectedGoal(g)}
                >
                  <div className="mg-top">
                    <span className="mg-title">{g.title}</span>
                    <span className="mg-budget">{g.suggestedBudget} V-Tokens</span>
                  </div>
                  <span className="mg-cat">{g.category} &bull; Target: {g.targetAgent}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Collapsible Advanced Parameters */}
          <div className="advanced-accordion-wrap">
            <button 
              type="button" 
              className="btn-accordion-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <div className="toggle-left">
                <Sliders size={15} />
                <span>Advanced Neural Trait Tuning</span>
              </div>
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showAdvanced && (
              <div className="advanced-sliders-box animate-fadeIn">
                <div className="slider-item">
                  <div className="slider-head">
                    <span>Negotiation Flex Index</span>
                    <span className="font-mono">{traits.negotiation}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={traits.negotiation}
                    onChange={(e) => setTraits(prev => ({ ...prev, negotiation: Number(e.target.value) }))}
                    className="range-slider purple"
                  />
                </div>

                <div className="slider-item">
                  <div className="slider-head">
                    <span>Creativity & Synthesis</span>
                    <span className="font-mono">{traits.creativity}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={traits.creativity}
                    onChange={(e) => setTraits(prev => ({ ...prev, creativity: Number(e.target.value) }))}
                    className="range-slider pink"
                  />
                </div>

                <div className="slider-item">
                  <div className="slider-head">
                    <span>Risk Appetite</span>
                    <span className="font-mono">{traits.risk}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={traits.risk}
                    onChange={(e) => setTraits(prev => ({ ...prev, risk: Number(e.target.value) }))}
                    className="range-slider gold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="form-submit-row">
            <button type="submit" className="btn-deploy-agent">
              <Zap size={18} />
              <span>ACTIVATE & DEPLOY {name.toUpperCase() || 'AGENT'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
