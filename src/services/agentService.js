// ============================================================================
// STOCKBUILDERS Agent Execution Pipeline & Stage Engine
// ============================================================================

export const AGENT_STAGES = {
  IDLE: 'IDLE',
  SEARCHING: 'SEARCHING',
  COMPARING: 'COMPARING',
  NEGOTIATING: 'NEGOTIATING',
  JOB_IN_PROGRESS: 'JOB_IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

export const STAGE_DESCRIPTIONS = {
  IDLE: {
    statusText: 'Standby • Waiting for Goal',
    actionText: 'Agent is ready for deployment.',
    color: '#94A3B8',
  },
  SEARCHING: {
    statusText: 'Autonomous Discovery Active',
    actionText: 'Scanning the Marketplace for specialized agent candidates matching your goal requirements...',
    color: '#06B6D4',
  },
  COMPARING: {
    statusText: 'Reputation & Price Evaluation',
    actionText: 'Comparing agent portfolios, reliability metrics, response speeds, and token efficiencies...',
    color: '#8B5CF6',
  },
  NEGOTIATING: {
    statusText: 'Agent-to-Agent Negotiation',
    actionText: 'Exchanging terms, price concessions, and delivery timelines with the selected agent in the Negotiation Room...',
    color: '#EC4899',
  },
  JOB_IN_PROGRESS: {
    statusText: 'Executing Contract Deliverable',
    actionText: 'Collaborating on synthesis and high-performance task execution...',
    color: '#F59E0B',
  },
  COMPLETED: {
    statusText: 'Goal Completed • Tokens & Reputation Earned',
    actionText: 'Deliverables verified, virtual escrow released, tokens claimed, and reputation increased!',
    color: '#10B981',
  },
};
