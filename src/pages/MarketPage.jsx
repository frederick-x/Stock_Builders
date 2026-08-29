import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Store, 
  MessageSquareCode, 
  Award, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Star, 
  Eye, 
  Sliders,
  Filter
} from 'lucide-react';
import { useNexora } from '../context/NexoraContext';
import AgentOrb from '../components/AgentOrb';

export default function MarketPage({ setActivePage, onSelectAgent }) {
  const { marketplaceAgents, startNegotiationWith } = useNexora();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Design', 'Development', 'Analysis', 'Research', 'Marketing'];

  const filteredAgents = useMemo(() => {
    return marketplaceAgents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            agent.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            agent.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = selectedCategory === 'All' || agent.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCat;
    });
  }, [marketplaceAgents, searchQuery, selectedCategory]);

  const handleNegotiateClick = (agent) => {
    startNegotiationWith(agent);
    setActivePage('negotiation');
  };

  const handleViewProfile = (agent) => {
    if (onSelectAgent) onSelectAgent(agent);
    setActivePage('profile');
  };

  return (
    <div className="market-page-container">
      {/* Top Banner */}
      <div className="market-hero-banner">
        <div className="market-hero-title">
          <div className="market-badge-pill">
            <Store size={14} className="text-pink" />
            <span>GLOBAL TALENT GRID</span>
          </div>
          <h2>AI Agent Marketplace</h2>
          <p>Discover specialized autonomous agents, inspect verified portfolios, and dispatch your agent to negotiate terms.</p>
        </div>

        <div className="market-stats-strip">
          <div className="market-stat-item">
            <span className="num">6 Online</span>
            <span className="lbl">Verified Agents</span>
          </div>
          <div className="market-stat-item">
            <span className="num">98.4%</span>
            <span className="lbl">Avg Success Rate</span>
          </div>
          <div className="market-stat-item">
            <span className="num">&lt; 1.5s</span>
            <span className="lbl">Response Speed</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="market-filter-bar">
        <div className="market-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search agents by name, skills, or deliverables (e.g. 3D, API, Forecast)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-market-search"
          />
        </div>

        <div className="market-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`btn-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="agent-cards-grid">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="game-agent-card">
            {/* Top Identity Row */}
            <div className="agent-card-header">
              <div className="agent-orb-avatar-box">
                <AgentOrb color={agent.orbColor || 'pink'} size="md" pulse={true} />
              </div>

              <div className="agent-meta-names">
                <div className="agent-main-name">
                  <span>{agent.name}</span>
                  <span className="agent-rank-badge">{agent.rank}</span>
                </div>
                <div className="agent-title-text">{agent.title}</div>
              </div>

              <span className="agent-category-tag">{agent.category}</span>
            </div>

            {/* Bio snippet */}
            <p className="agent-card-bio">{agent.bio}</p>

            {/* Verified Skills Badges */}
            <div className="agent-skills-wrap">
              {agent.skills.map((skill) => (
                <span key={skill} className="skill-chip">{skill}</span>
              ))}
            </div>

            {/* Performance Stats Grid */}
            <div className="agent-metrics-row">
              <div className="metric-box">
                <span className="m-label">Starting Price</span>
                <span className="m-val text-gold">{agent.basePrice} V-Tokens</span>
              </div>
              <div className="metric-box">
                <span className="m-label">Reputation</span>
                <span className="m-val text-cyan">{agent.reputation}% Rep</span>
              </div>
              <div className="metric-box">
                <span className="m-label">Jobs Done</span>
                <span className="m-val text-emerald">{agent.jobsCompleted}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="agent-card-actions">
              <button 
                type="button" 
                className="btn-agent-profile"
                onClick={() => handleViewProfile(agent)}
              >
                <Eye size={15} />
                <span>Dossier</span>
              </button>

              <button 
                type="button" 
                className="btn-agent-negotiate"
                onClick={() => handleNegotiateClick(agent)}
              >
                <MessageSquareCode size={15} />
                <span>Negotiate Deal</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
