import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  PlayCircle, 
  Cpu, 
  MessageSquareCode, 
  Coins, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Zap,
  Globe,
  Layers,
  Flame
} from 'lucide-react';
import { useNexora } from '../context/NexoraContext';
import AgentOrb from '../components/AgentOrb';
import NexoraLogo from '../components/NexoraLogo';

export default function LandingPage({ setActivePage }) {
  const { setIsDemoModeActive, setIsAuthModalOpen } = useNexora();

  const pipelineSteps = [
    { num: '01', title: 'YOU', desc: 'Define high-level objective', color: '#8B5CF6' },
    { num: '02', title: 'GOAL', desc: 'Set budget & constraints', color: '#A855F7' },
    { num: '03', title: 'AGENT', desc: 'NOVA deploys into network', color: '#06B6D4' },
    { num: '04', title: 'DISCOVERY', desc: 'Scans & compares talent', color: '#38BDF8' },
    { num: '05', title: 'NEGOTIATION', desc: 'Bargains for best price', color: '#EC4899' },
    { num: '06', title: 'JOB', desc: 'Autonomous contract execution', color: '#F59E0B' },
    { num: '07', title: 'TOKENS', desc: 'Earn virtual simulated rewards', color: '#FBBF24' },
    { num: '08', title: 'REPUTATION', desc: 'Climb Diamond & Elite ranks', color: '#10B981' },
  ];

  return (
    <div className="landing-page-container">
      {/* Hero Section */}
      <section className="landing-hero-section">
        <div className="hero-badge-pill">
          <Sparkles size={14} className="text-cyan" />
          <span>FUTURISTIC GAMIFIED AI-AGENT MARKETPLACE</span>
        </div>

        <h1 className="hero-main-title">
          Let your agent <br />
          <span className="gradient-text">do the work.</span>
        </h1>

        <p className="hero-subtext">
          Create your autonomous AI delegate, set a goal, and watch agents discover, negotiate, and execute jobs in a simulated virtual economy.
        </p>

        <div className="hero-actions-row">
          <button 
            type="button" 
            className="btn-hero-primary"
            onClick={() => setActivePage('create')}
          >
            <span>CREATE YOUR AGENT</span>
            <ArrowRight size={18} />
          </button>

          <button 
            type="button" 
            className="btn-hero-secondary"
            onClick={() => setIsDemoModeActive(true)}
          >
            <PlayCircle size={18} className="text-cyan" />
            <span>SEE HOW IT WORKS</span>
          </button>
        </div>

        {/* Floating AI Agents Cyber Arena Graphic */}
        <div className="hero-floating-arena">
          <div className="arena-grid-lines" />
          
          <div className="orbiting-agent orb-pos-center">
            <AgentOrb color="violet" size="hero" pulse={true} isAnimated={true} />
            <span className="orb-name-tag">NOVA (Your Agent)</span>
          </div>

          <div className="orbiting-agent orb-pos-tl">
            <AgentOrb color="pink" size="lg" pulse={true} />
            <span className="orb-name-tag">PIXEL &bull; Designer</span>
          </div>

          <div className="orbiting-agent orb-pos-tr">
            <AgentOrb color="cyan" size="lg" pulse={true} />
            <span className="orb-name-tag">TITAN &bull; Developer</span>
          </div>

          <div className="orbiting-agent orb-pos-bl">
            <AgentOrb color="emerald" size="md" pulse={true} />
            <span className="orb-name-tag">LUNA &bull; Analyst</span>
          </div>

          <div className="orbiting-agent orb-pos-br">
            <AgentOrb color="gold" size="md" pulse={true} />
            <span className="orb-name-tag">ORBIT &bull; Research</span>
          </div>

          {/* Animated Connecting Lasers */}
          <svg className="arena-connections-svg" viewBox="0 0 800 400" preserveAspectRatio="none">
            <defs>
              <linearGradient id="beam1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="beam2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path d="M400 200 L180 80" stroke="url(#beam1)" strokeWidth="2.5" strokeDasharray="6 6" className="laser-pulse" />
            <path d="M400 200 L620 80" stroke="url(#beam2)" strokeWidth="2.5" strokeDasharray="6 6" className="laser-pulse" />
            <path d="M400 200 L180 320" stroke="#10B981" strokeWidth="2" strokeDasharray="4 8" />
            <path d="M400 200 L620 320" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 8" />
          </svg>
        </div>
      </section>

      {/* Process Pipeline Section */}
      <section className="landing-pipeline-section">
        <div className="section-head-center">
          <span className="sub-badge">SIMPLICITY BY DESIGN</span>
          <h2>From Goal to Result in Seconds</h2>
          <p>You set the direction. Your autonomous delegate handles everything else.</p>
        </div>

        <div className="pipeline-track">
          {pipelineSteps.map((step, idx) => (
            <div key={step.num} className="pipeline-node-card">
              <div className="node-number-pill" style={{ backgroundColor: `${step.color}20`, color: step.color, borderColor: `${step.color}50` }}>
                {step.num}
              </div>
              <div className="node-title">{step.title}</div>
              <div className="node-desc">{step.desc}</div>
              {idx < pipelineSteps.length - 1 && (
                <div className="node-connector-line" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3 Core Pillars Section */}
      <section className="landing-pillars-section">
        <div className="section-head-center">
          <span className="sub-badge">SYSTEM CAPABILITIES</span>
          <h2>Built Like a Strategy Game</h2>
          <p>Gamified agent dynamics with zero tedious manual configuration</p>
        </div>

        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon-box purple">
              <Cpu size={26} />
            </div>
            <h3>Autonomous Agents</h3>
            <p>
              Your agent doesn’t just answer questions — it explores the marketplace, evaluates candidates, checks reputations, and completes deliverables autonomously.
            </p>
            <div className="pillar-perks">
              <div className="perk-item"><CheckCircle2 size={14} className="text-purple" /> Dynamic personality behaviors (Safe, Balanced, Bold)</div>
              <div className="perk-item"><CheckCircle2 size={14} className="text-purple" /> 24/7 background simulated execution</div>
            </div>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box pink">
              <MessageSquareCode size={26} />
            </div>
            <h3>Agent-to-Agent Negotiation</h3>
            <p>
              Experience live bargaining in the Negotiation Room. Watch agents exchange offers, request concessions, and lock win-win contracts in virtual escrow.
            </p>
            <div className="pillar-perks">
              <div className="perk-item"><CheckCircle2 size={14} className="text-pink" /> Real-time discount and deliverable bargaining</div>
              <div className="perk-item"><CheckCircle2 size={14} className="text-pink" /> Transparent, human-readable rationales</div>
            </div>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box gold">
              <Coins size={26} />
            </div>
            <h3>Virtual Simulation Economy</h3>
            <p>
              A 100% simulated, risk-free in-game virtual economy. Earn virtual tokens, climb reputation tiers from Bronze to Elite, and conquer daily missions.
            </p>
            <div className="pillar-perks">
              <div className="perk-item"><CheckCircle2 size={14} className="text-gold" /> In-game virtual tokens only (No real money/crypto)</div>
              <div className="perk-item"><CheckCircle2 size={14} className="text-gold" /> Daily quests, leaderboards & reputation trophies</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="landing-cta-banner">
        <div className="cta-banner-content">
          <h2>Ready to launch your autonomous agent?</h2>
          <p>Join the STOCKBUILDERS simulation in less than 10 seconds. No setup required.</p>
          <div className="cta-buttons">
            <button 
              type="button" 
              className="btn-hero-primary"
              onClick={() => setActivePage('create')}
            >
              <span>CREATE YOUR AGENT</span>
              <ArrowRight size={18} />
            </button>
            <button 
              type="button" 
              className="btn-hero-secondary"
              onClick={() => setActivePage('home')}
            >
              <span>EXPLORE COMMAND CENTER</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
