import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  INITIAL_USER_AGENT, 
  MARKETPLACE_AGENTS, 
  INITIAL_DAILY_MISSIONS, 
  INITIAL_ACTIVITY_LOG, 
  INITIAL_LEADERBOARD,
  PRESET_GOALS
} from '../services/mockData';
import { AGENT_STAGES, STAGE_DESCRIPTIONS } from '../services/agentService';
import { generateNegotiationScript } from '../services/negotiationService';

const NexoraContext = createContext(null);

export function NexoraProvider({ children }) {
  // 1. User & Auth
  const [user, setUser] = useState({
    name: 'Commander Alex',
    email: 'alex@nexora.ai',
    isLoggedIn: true,
    avatar: 'pilot',
  });

  // 2. Virtual Economy (Simulated In-Game Tokens Only)
  const [tokenBalance, setTokenBalance] = useState(5420);
  const [tokensEarned, setTokensEarned] = useState(14250);
  const [tokensSpent, setTokensSpent] = useState(6800);

  // 3. User Agent State
  const [userAgent, setUserAgent] = useState(INITIAL_USER_AGENT);
  const [currentGoal, setCurrentGoal] = useState(PRESET_GOALS[0]);

  // 4. Autonomous State Machine
  const [agentStage, setAgentStage] = useState(AGENT_STAGES.IDLE);
  const [agentThought, setAgentThought] = useState('NOVA is primed and ready. Select a goal or activate Autonomous Mode.');
  const [isAutonomousRunning, setIsAutonomousRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x, 2x, 5x
  const [selectedTargetAgent, setSelectedTargetAgent] = useState(MARKETPLACE_AGENTS[0]); // PIXEL by default

  // 5. Active Negotiation Room
  const [activeNegotiation, setActiveNegotiation] = useState(null);

  // 6. Marketplace, Missions, Activity, Leaderboard
  const [marketplaceAgents, setMarketplaceAgents] = useState(MARKETPLACE_AGENTS);
  const [missions, setMissions] = useState(INITIAL_DAILY_MISSIONS);
  const [activityLog, setActivityLog] = useState(INITIAL_ACTIVITY_LOG);
  const [leaderboard, setLeaderboard] = useState(INITIAL_LEADERBOARD);

  // 7. Modals and Demo Mode
  const [isDemoModeActive, setIsDemoModeActive] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  const autonomousTimerRef = useRef(null);

  const showToast = (message, type = 'info') => {
    setActiveToast({ message, type, id: Date.now() });
    setTimeout(() => setActiveToast(null), 3500);
  };

  // Trigger win confetti
  const triggerConfetti = (colors = ['#8B5CF6', '#06B6D4', '#10B981', '#FBBF24']) => {
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.7 },
      colors
    });
  };

  // Helper to add activity log
  const logActivity = (item) => {
    const newItem = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      ...item,
    };
    setActivityLog(prev => [newItem, ...prev]);
  };

  // Start Autonomous Loop
  const startAutonomous = (customGoal = null) => {
    const goalToRun = customGoal || currentGoal;
    setCurrentGoal(goalToRun);
    setIsAutonomousRunning(true);
    setAgentStage(AGENT_STAGES.SEARCHING);
    setAgentThought(`Scanning marketplace nodes for top-reputation agents matching "${goalToRun.title}"...`);
    showToast(`Autonomous Mode activated for: ${goalToRun.title}`, 'success');

    // Pick best suited target agent
    const matchingAgent = marketplaceAgents.find(a => a.category === goalToRun.category) || marketplaceAgents[0];
    setSelectedTargetAgent(matchingAgent);
  };

  const pauseAutonomous = () => {
    setIsAutonomousRunning(false);
    showToast('Autonomous agent paused.', 'warning');
  };

  const resumeAutonomous = () => {
    setIsAutonomousRunning(true);
    showToast('Autonomous agent resumed.', 'info');
  };

  const stopAutonomous = () => {
    setIsAutonomousRunning(false);
    setAgentStage(AGENT_STAGES.IDLE);
    setAgentThought(`${userAgent.name} returned to Standby mode.`);
    showToast('Autonomous loop stopped.', 'info');
  };

  // Negotiation Management
  const startNegotiationWith = (targetAgent, goal = null) => {
    const activeGoal = goal || currentGoal;
    setSelectedTargetAgent(targetAgent);
    const script = generateNegotiationScript(userAgent, targetAgent, activeGoal);

    setActiveNegotiation({
      targetAgent,
      goal: activeGoal,
      rounds: script,
      currentRoundIndex: 0,
      isDealComplete: false,
      dealResult: null,
      history: [script[0]],
    });

    setAgentStage(AGENT_STAGES.NEGOTIATING);
    setAgentThought(`${userAgent.name} initiated live negotiation with ${targetAgent.name} (Budget: ${activeGoal.suggestedBudget} Tokens).`);
  };

  const advanceNegotiationStep = () => {
    if (!activeNegotiation) return;

    const nextIndex = activeNegotiation.currentRoundIndex + 1;
    if (nextIndex < activeNegotiation.rounds.length) {
      const nextRound = activeNegotiation.rounds[nextIndex];
      setActiveNegotiation(prev => ({
        ...prev,
        currentRoundIndex: nextIndex,
        history: [...prev.history, nextRound],
        isDealComplete: nextRound.isFinal || false,
        dealResult: nextRound.dealResult || null,
      }));

      setAgentThought(nextRound.rationale);

      if (nextRound.isFinal) {
        // Complete the deal
        completeDeal(activeNegotiation.targetAgent, nextRound.dealResult);
      }
    }
  };

  // Complete Deal & Release escrow
  const completeDeal = (targetAgent, dealResult) => {
    const pricePaid = dealResult.agreedPrice;
    const grossPayout = dealResult.estimatedPayout;
    const profit = dealResult.netProfit;

    // Deduct tokens for contract
    setTokenBalance(prev => Math.max(0, prev - pricePaid));
    setTokensSpent(prev => prev + pricePaid);

    // Increase user agent reputation & stats
    setUserAgent(prev => ({
      ...prev,
      reputation: Math.min(100, prev.reputation + 1),
      stats: {
        ...prev.stats,
        jobsCompleted: prev.stats.jobsCompleted + 1,
        negotiationsWon: prev.stats.negotiationsWon + 1,
      }
    }));

    // Log Activity
    logActivity({
      type: 'DEAL',
      title: `Contract Sealed with ${targetAgent.name}`,
      description: `${userAgent.name} secured a ${dealResult.discountPercent}% discount (${dealResult.tokensSaved} tokens saved) on "${currentGoal.title}".`,
      tokens: -pricePaid,
      reputationChange: +1,
      agentPair: [userAgent.name, targetAgent.name],
    });

    // Advance daily missions
    advanceMissionProgress('m1', 1);

    triggerConfetti();
    showToast(`Deal Complete! ${pricePaid} Tokens locked in contract with ${targetAgent.name}.`, 'success');
  };

  // Simulate Job Deliverable Completion
  const completeContractExecution = (targetAgent, payoutAmount = 750) => {
    setTokenBalance(prev => prev + payoutAmount);
    setTokensEarned(prev => prev + payoutAmount);

    setUserAgent(prev => ({
      ...prev,
      reputation: Math.min(100, prev.reputation + 2),
      stats: {
        ...prev.stats,
        tokensEarned: prev.stats.tokensEarned + payoutAmount,
      }
    }));

    logActivity({
      type: 'JOB_COMPLETE',
      title: `Job Deliverable Accepted`,
      description: `${targetAgent.name} successfully delivered verified contract assets for "${currentGoal.title}".`,
      tokens: +payoutAmount,
      reputationChange: +2,
      agentPair: [userAgent.name, targetAgent.name],
    });

    advanceMissionProgress('m3', payoutAmount);
    triggerConfetti(['#10B981', '#34D399', '#FBBF24']);
    showToast(`Mission Accomplished! +${payoutAmount} Virtual Tokens & +2 Reputation earned.`, 'success');
  };

  // Mission Progress Handler
  const advanceMissionProgress = (missionId, amount) => {
    setMissions(prevMissions => 
      prevMissions.map(m => {
        if (m.id === missionId) {
          const newProgress = Math.min(m.total, m.progress + amount);
          return { ...m, progress: newProgress };
        }
        return m;
      })
    );
  };

  const claimMissionReward = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.claimed || mission.progress < mission.total) return;

    setTokenBalance(prev => prev + mission.rewardTokens);
    setTokensEarned(prev => prev + mission.rewardTokens);
    setUserAgent(prev => ({
      ...prev,
      reputation: Math.min(100, prev.reputation + mission.rewardReputation),
    }));

    setMissions(prev => 
      prev.map(m => m.id === missionId ? { ...m, claimed: true } : m)
    );

    logActivity({
      type: 'REPUTATION',
      title: `Daily Mission Claimed: ${mission.title}`,
      description: `Earned +${mission.rewardTokens} Virtual Tokens and +${mission.rewardReputation} Reputation score.`,
      tokens: +mission.rewardTokens,
      reputationChange: +mission.rewardReputation,
      agentPair: [userAgent.name],
    });

    triggerConfetti();
    showToast(`Claimed +${mission.rewardTokens} Virtual Tokens!`, 'success');
  };

  // Add Free Virtual Demo Tokens
  const depositVirtualTokens = (amount = 1000) => {
    setTokenBalance(prev => prev + amount);
    logActivity({
      type: 'TOKENS',
      title: `Virtual Grant Injected`,
      description: `Added +${amount} Virtual Test Tokens to your simulator vault.`,
      tokens: +amount,
      reputationChange: 0,
      agentPair: [userAgent.name],
    });
    showToast(`Added +${amount} Virtual In-Game Tokens!`, 'success');
  };

  // Automated Autonomous Loop Timer
  useEffect(() => {
    if (!isAutonomousRunning) {
      if (autonomousTimerRef.current) clearTimeout(autonomousTimerRef.current);
      return;
    }

    const stepDelay = Math.max(1200, 3800 / simulationSpeed);

    autonomousTimerRef.current = setTimeout(() => {
      if (agentStage === AGENT_STAGES.SEARCHING) {
        setAgentStage(AGENT_STAGES.COMPARING);
        setAgentThought(`Found ${selectedTargetAgent.name} (${selectedTargetAgent.rank} • ${selectedTargetAgent.reputation}% Rep). Comparing fee schedules & deliverable quality...`);
      } else if (agentStage === AGENT_STAGES.COMPARING) {
        setAgentStage(AGENT_STAGES.NEGOTIATING);
        startNegotiationWith(selectedTargetAgent, currentGoal);
      } else if (agentStage === AGENT_STAGES.NEGOTIATING) {
        if (activeNegotiation && !activeNegotiation.isDealComplete) {
          advanceNegotiationStep();
        } else {
          setAgentStage(AGENT_STAGES.JOB_IN_PROGRESS);
          setAgentThought(`${selectedTargetAgent.name} is executing the synthesis deliverables in high-priority autonomous queue...`);
        }
      } else if (agentStage === AGENT_STAGES.JOB_IN_PROGRESS) {
        setAgentStage(AGENT_STAGES.COMPLETED);
        completeContractExecution(selectedTargetAgent, Math.round(selectedTargetAgent.basePrice * 1.5));
        setAgentThought(`Goal achieved! ${selectedTargetAgent.name} delivered high-fidelity assets. +2 Reputation & token payout credited.`);
      } else if (agentStage === AGENT_STAGES.COMPLETED) {
        // Cycle to next preset goal or loop
        const nextGoalIndex = (PRESET_GOALS.findIndex(g => g.id === currentGoal.id) + 1) % PRESET_GOALS.length;
        const nextGoal = PRESET_GOALS[nextGoalIndex];
        setCurrentGoal(nextGoal);
        setAgentStage(AGENT_STAGES.SEARCHING);
        const nextAgent = marketplaceAgents.find(a => a.category === nextGoal.category) || marketplaceAgents[0];
        setSelectedTargetAgent(nextAgent);
        setAgentThought(`Next Goal Initialized: "${nextGoal.title}". Scanning for specialized talent...`);
      }
    }, stepDelay);

    return () => {
      if (autonomousTimerRef.current) clearTimeout(autonomousTimerRef.current);
    };
  }, [isAutonomousRunning, agentStage, activeNegotiation, simulationSpeed, currentGoal, selectedTargetAgent]);

  const value = {
    user,
    setUser,
    tokenBalance,
    tokensEarned,
    tokensSpent,
    userAgent,
    setUserAgent,
    currentGoal,
    setCurrentGoal,
    agentStage,
    setAgentStage,
    agentThought,
    setAgentThought,
    isAutonomousRunning,
    simulationSpeed,
    setSimulationSpeed,
    selectedTargetAgent,
    setSelectedTargetAgent,
    activeNegotiation,
    setActiveNegotiation,
    marketplaceAgents,
    missions,
    activityLog,
    leaderboard,
    isDemoModeActive,
    setIsDemoModeActive,
    isAuthModalOpen,
    setIsAuthModalOpen,
    activeToast,
    // Methods
    startAutonomous,
    pauseAutonomous,
    resumeAutonomous,
    stopAutonomous,
    startNegotiationWith,
    advanceNegotiationStep,
    completeContractExecution,
    claimMissionReward,
    depositVirtualTokens,
    logActivity,
    showToast,
    triggerConfetti,
  };

  return (
    <NexoraContext.Provider value={value}>
      {children}
    </NexoraContext.Provider>
  );
}

export function useNexora() {
  const context = useContext(NexoraContext);
  if (!context) {
    throw new Error('useNexora must be used within a NexoraProvider');
  }
  return context;
}
