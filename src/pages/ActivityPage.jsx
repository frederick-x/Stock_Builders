import React, { useState } from 'react';
import { 
  Activity, 
  MessageSquareCode, 
  CheckCircle2, 
  Coins, 
  Award, 
  Sparkles, 
  Filter, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { useNexora } from '../context/NexoraContext';

export default function ActivityPage() {
  const { activityLog } = useNexora();
  const [filterType, setFilterType] = useState('ALL');

  const filters = [
    { id: 'ALL', label: 'All Activity' },
    { id: 'DEAL', label: 'Negotiations' },
    { id: 'JOB_COMPLETE', label: 'Jobs & Contracts' },
    { id: 'TOKENS', label: 'Token Transfers' },
    { id: 'REPUTATION', label: 'Reputation' },
  ];

  const filteredLog = activityLog.filter(item => {
    if (filterType === 'ALL') return true;
    return item.type === filterType;
  });

  return (
    <div className="activity-page-container">
      {/* Top Banner */}
      <div className="activity-hero-banner">
        <div className="badge-activity-pill">
          <Activity size={14} className="text-cyan" />
          <span>REAL-TIME AUDIT LOG</span>
        </div>
        <h2>Simulation Activity Stream</h2>
        <p>Immutable event stream of all agent discoveries, bargaining rounds, contract executions, and token escrows.</p>
      </div>

      {/* Filter Chips */}
      <div className="activity-filter-bar">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`btn-act-filter ${filterType === f.id ? 'active' : ''}`}
            onClick={() => setFilterType(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="activity-timeline-card">
        {filteredLog.length === 0 ? (
          <div className="empty-activity">
            <Activity size={36} className="text-muted" />
            <p>No activity records matching this filter.</p>
          </div>
        ) : (
          <div className="timeline-items-list">
            {filteredLog.map((event) => {
              const isPositiveTokens = event.tokens > 0;
              const isNegativeTokens = event.tokens < 0;

              return (
                <div key={event.id} className="timeline-node-item">
                  <div className="timeline-indicator-track">
                    <div className="timeline-indicator-dot" />
                    <div className="timeline-indicator-line" />
                  </div>

                  <div className="timeline-content-card">
                    <div className="timeline-card-header">
                      <div className="event-title-group">
                        <span className="event-title">{event.title}</span>
                        {event.agentPair && (
                          <div className="agent-pair-tags">
                            {event.agentPair.map(a => (
                              <span key={a} className="agent-tag">{a}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="event-timestamp">{event.timestamp}</span>
                    </div>

                    <p className="event-description">{event.description}</p>

                    <div className="event-meta-footer">
                      {event.tokens !== 0 && (
                        <span className={`event-badge-token ${isPositiveTokens ? 'positive' : 'negative'}`}>
                          <Coins size={12} />
                          <span>{isPositiveTokens ? `+${event.tokens}` : event.tokens} V-Tokens</span>
                        </span>
                      )}

                      {event.reputationChange !== 0 && (
                        <span className="event-badge-rep">
                          <Award size={12} className="text-cyan" />
                          <span>+{event.reputationChange} Reputation</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
