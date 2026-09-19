import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  AGENTS_CATALOG, 
  INITIAL_STOCKS, 
  INITIAL_MISSIONS,
  ACHIEVEMENTS_LIST,
  DAILY_STREAK_REWARDS,
  MARKET_EVENTS,
  PLAYER_RANKS,
  LEAGUE_TIERS
} from '../services/gameData';
import { 
  fetchRealQuote, 
  fetchStockNews, 
  DEFAULT_STOCK_METADATA 
} from '../services/realStockService';
import { generateAgentSignal } from '../services/llmService';
import { soundFx } from '../services/soundService';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  // Local storage helper
  const readLS = (primary, fallback = null) => {
    const v = localStorage.getItem(primary);
    if (v !== null) return v;
    if (fallback) return localStorage.getItem(fallback);
    return null;
  };

  // 1. Dual Economy
  const [cashBalance, setCashBalance] = useState(() => {
    const saved = readLS('STOCKBUILDERS_CASH_BALANCE', 'NEXORA_CASH_BALANCE');
    return saved ? Number(saved) : 10000;
  });

  const [gemBalance, setGemBalance] = useState(() => {
    const saved = readLS('STOCKBUILDERS_GEM_BALANCE', 'NEXORA_GEM_BALANCE');
    return saved ? Number(saved) : 35;
  });

  // 2. Player Level & XP Engine
  const [playerLevel, setPlayerLevel] = useState(() => {
    const saved = readLS('STOCKBUILDERS_PLAYER_LEVEL');
    return saved ? Number(saved) : 1;
  });

  const [playerXP, setPlayerXP] = useState(() => {
    const saved = readLS('STOCKBUILDERS_PLAYER_XP');
    return saved ? Number(saved) : 0;
  });

  // 3. Daily Login Streak Engine
  const [streakDays, setStreakDays] = useState(() => {
    const saved = readLS('STOCKBUILDERS_STREAK_DAYS');
    return saved ? Number(saved) : 1;
  });

  const [lastStreakClaimDate, setLastStreakClaimDate] = useState(() => {
    return readLS('STOCKBUILDERS_LAST_STREAK_DATE') || '';
  });

  // 4. Agents & Companion Roster
  const [agentsCatalog, setAgentsCatalog] = useState(() => {
    const saved = readLS('STOCKBUILDERS_AGENTS_CATALOG');
    return saved ? JSON.parse(saved) : AGENTS_CATALOG;
  });

  const [unlockedAgentIds, setUnlockedAgentIds] = useState(() => {
    const raw = readLS('STOCKBUILDERS_UNLOCKED_AGENTS', 'NEXORA_UNLOCKED_AGENTS');
    return raw ? JSON.parse(raw) : ['agent-scout'];
  });

  const [activeAgentId, setActiveAgentId] = useState(() => {
    return readLS('STOCKBUILDERS_ACTIVE_AGENT', 'NEXORA_ACTIVE_AGENT') || 'agent-scout';
  });

  // 5. Stocks & Market Data
  const [stocks, setStocks] = useState(() => {
    const raw = readLS('STOCKBUILDERS_STOCKS_DATA', 'NEXORA_STOCKS_DATA');
    return raw ? JSON.parse(raw) : INITIAL_STOCKS;
  });
  const [selectedStockSymbol, setSelectedStockSymbol] = useState('NVDA');
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [marketDataSource, setMarketDataSource] = useState('Real-Time Market Feed');
  const [customApiKey, setCustomApiKey] = useState(() => readLS('STOCKBUILDERS_API_KEY', 'NEXORA_API_KEY') || '');

  // 6. Active Market Event Booster
  const [activeMarketEventIndex, setActiveMarketEventIndex] = useState(0);
  const activeMarketEvent = MARKET_EVENTS[activeMarketEventIndex] || MARKET_EVENTS[0];

  // 7. Optional LLM toggle
  const [llmEnabled, setLlmEnabled] = useState(() => {
    const raw = readLS('STOCKBUILDERS_LLM_ENABLED', 'NEXORA_LLM_ENABLED');
    return raw ? raw === 'true' : false;
  });

  // 8. Portfolio & Missions & Achievements
  const [holdings, setHoldings] = useState(() => {
    const raw = readLS('STOCKBUILDERS_PORTFOLIO_HOLDINGS', 'NEXORA_PORTFOLIO_HOLDINGS');
    return raw ? JSON.parse(raw) : [];
  });

  const [missions, setMissions] = useState(() => {
    const raw = readLS('STOCKBUILDERS_MISSIONS', 'NEXORA_MISSIONS');
    return raw ? JSON.parse(raw) : INITIAL_MISSIONS;
  });

  const [achievements, setAchievements] = useState(() => {
    const raw = readLS('STOCKBUILDERS_ACHIEVEMENTS');
    return raw ? JSON.parse(raw) : ACHIEVEMENTS_LIST;
  });

  const [tradeLog, setTradeLog] = useState(() => {
    const raw = readLS('STOCKBUILDERS_TRADE_LOG', 'NEXORA_TRADE_LOG');
    return raw ? JSON.parse(raw) : [];
  });

  const [totalRealizedProfit, setTotalRealizedProfit] = useState(() => {
    const raw = readLS('STOCKBUILDERS_TOTAL_PROFIT', 'NEXORA_TOTAL_PROFIT');
    return raw ? Number(raw) : 0;
  });

  // 9. Sound FX & UI feedback
  const [soundMuted, setSoundMuted] = useState(() => soundFx.isMuted());
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [levelUpData, setLevelUpData] = useState(null);
  const [agentAdvice, setAgentAdvice] = useState(null);
  const [toast, setToast] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Helper to toggle sound
  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    soundFx.setMuted(next);
    if (!next) soundFx.play('click');
  };

  const playSound = (type) => {
    soundFx.play(type);
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  // Add floating combat numbers (+50 XP, +10 Gems, +$500 WIN)
  const addFloatingText = (text, type = 'xp', x = null, y = null) => {
    const id = `float-${Date.now()}-${Math.random()}`;
    setFloatingTexts(prev => [...prev.slice(-6), { id, text, type, x, y }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 2200);
  };

  // Trigger win confetti
  const triggerConfetti = (colors = ['#8B5CF6', '#06B6D4', '#10B981', '#FBBF24', '#EC4899']) => {
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.65 },
      colors
    });
  };

  // XP Engine: Calculate required XP for a given level
  const getXpThreshold = (lvl) => {
    return Math.floor(120 * Math.pow(lvl, 1.32));
  };

  const xpForNextLevel = getXpThreshold(playerLevel);

  // Current Player Rank Title
  const currentRank = [...PLAYER_RANKS].reverse().find(r => playerLevel >= r.level) || PLAYER_RANKS[0];

  // Current Active Agent Object
  const activeAgent = agentsCatalog.find(a => a.id === activeAgentId) || agentsCatalog[0] || AGENTS_CATALOG[0];

  // Award XP and handle Level Ups
  const addXP = useCallback((amount, source = 'Trade Execution') => {
    if (amount <= 0) return;
    
    // Check if market event boosts XP
    let finalXP = Math.round(amount * (activeMarketEvent?.xpMultiplier || 1));
    addFloatingText(`+${finalXP} XP`, 'xp');

    setPlayerXP(prevXP => {
      let curXP = prevXP + finalXP;
      let curLevel = playerLevel;
      let threshold = getXpThreshold(curLevel);

      if (curXP >= threshold) {
        // Level up!
        curXP -= threshold;
        const newLevel = curLevel + 1;
        setPlayerLevel(newLevel);

        const gemBonus = newLevel * 10;
        const cashBonus = newLevel * 500;
        setGemBalance(g => g + gemBonus);
        setCashBalance(c => c + cashBonus);

        soundFx.play('levelUp');
        triggerConfetti(['#F59E0B', '#10B981', '#06B6D4', '#EC4899']);

        const rankObj = [...PLAYER_RANKS].reverse().find(r => newLevel >= r.level) || PLAYER_RANKS[0];

        setLevelUpData({
          oldLevel: curLevel,
          newLevel: newLevel,
          rankTitle: rankObj.title,
          rankIcon: rankObj.icon,
          gemBonus,
          cashBonus,
        });

        showToast(`🎉 LEVEL UP! You reached Level ${newLevel} (${rankObj.title})!`, 'success');
      }
      return curXP;
    });

    // Also award XP to the currently active AI Companion
    setAgentsCatalog(prevCatalog => 
      prevCatalog.map(agent => {
        if (agent.id === activeAgentId) {
          const compXP = (agent.xp || 0) + Math.round(finalXP * 0.8);
          const compMax = agent.xpMax || 150;
          if (compXP >= compMax && agent.level < 10) {
            const newCompLvl = agent.level + 1;
            soundFx.play('levelUp');
            showToast(`🤖 ${agent.name} ranked up to Companion Level ${newCompLvl}! Stats boosted!`, 'success');
            return {
              ...agent,
              level: newCompLvl,
              xp: compXP - compMax,
              xpMax: Math.round(compMax * 1.5),
              stats: {
                ...agent.stats,
                accuracy: Math.min(99, agent.stats.accuracy + 2),
                profitBonus: agent.stats.profitBonus + 3,
                shield: Math.min(99, agent.stats.shield + 2),
              }
            };
          }
          return { ...agent, xp: compXP };
        }
        return agent;
      })
    );
  }, [playerLevel, activeAgentId, activeMarketEvent]);

  // Train AI Companion directly with Gems
  const trainCompanion = (agentId) => {
    const target = agentsCatalog.find(a => a.id === agentId);
    if (!target) return;

    if (target.level >= 10) {
      showToast(`${target.name} is already at MAX Level 10!`, 'info');
      return;
    }

    const cost = target.trainCostGems || 20;
    if (gemBalance < cost) {
      soundFx.play('error');
      showToast(`Need ${cost - gemBalance} more 💎 Gems to train ${target.name}!`, 'warning');
      return;
    }

    setGemBalance(prev => prev - cost);
    soundFx.play('levelUp');
    triggerConfetti();

    setAgentsCatalog(prev => 
      prev.map(a => {
        if (a.id === agentId) {
          const newLevel = a.level + 1;
          return {
            ...a,
            level: newLevel,
            xp: 0,
            xpMax: Math.round((a.xpMax || 150) * 1.4),
            stats: {
              ...a.stats,
              accuracy: Math.min(99, a.stats.accuracy + 3),
              profitBonus: a.stats.profitBonus + 4,
              shield: Math.min(99, a.stats.shield + 3),
            }
          };
        }
        return a;
      })
    );

    addXP(150, 'Companion Training');
    addFloatingText(`-${cost} 💎`, 'gem');
    showToast(`🧬 Enhanced ${target.name} to Level ${target.level + 1}! Skill parameters elevated.`, 'success');
  };

  // Check Daily Streak Claim Status
  const todayStr = new Date().toISOString().slice(0, 10);
  const isStreakClaimedToday = lastStreakClaimDate === todayStr;

  const claimDailyStreakReward = () => {
    if (isStreakClaimedToday) {
      showToast('Daily streak bonus already claimed for today! Come back tomorrow.', 'info');
      return;
    }

    const currentReward = DAILY_STREAK_REWARDS[(streakDays - 1) % DAILY_STREAK_REWARDS.length] || DAILY_STREAK_REWARDS[0];

    setCashBalance(c => c + currentReward.cash);
    setGemBalance(g => g + currentReward.gems);
    setLastStreakClaimDate(todayStr);

    const nextStreak = streakDays + 1;
    setStreakDays(nextStreak);

    soundFx.play('gemClaim');
    triggerConfetti(['#F59E0B', '#10B981', '#06B6D4']);
    addXP(currentReward.xp, 'Daily Streak Claim');
    addFloatingText(`+${currentReward.gems} 💎`, 'gem');
    addFloatingText(`+$${currentReward.cash}`, 'cash');

    showToast(`🔥 Claimed Day ${streakDays} Bonus: +$${currentReward.cash.toLocaleString()} Cash & +${currentReward.gems} 💎 Gems!`, 'success');
  };

  // Persist State to Local Storage
  useEffect(() => {
    localStorage.setItem('STOCKBUILDERS_CASH_BALANCE', String(cashBalance));
    localStorage.setItem('STOCKBUILDERS_GEM_BALANCE', String(gemBalance));
    localStorage.setItem('STOCKBUILDERS_PLAYER_LEVEL', String(playerLevel));
    localStorage.setItem('STOCKBUILDERS_PLAYER_XP', String(playerXP));
    localStorage.setItem('STOCKBUILDERS_STREAK_DAYS', String(streakDays));
    localStorage.setItem('STOCKBUILDERS_LAST_STREAK_DATE', lastStreakClaimDate);
    localStorage.setItem('STOCKBUILDERS_AGENTS_CATALOG', JSON.stringify(agentsCatalog));
    localStorage.setItem('STOCKBUILDERS_UNLOCKED_AGENTS', JSON.stringify(unlockedAgentIds));
    localStorage.setItem('STOCKBUILDERS_ACTIVE_AGENT', activeAgentId);
    localStorage.setItem('STOCKBUILDERS_PORTFOLIO_HOLDINGS', JSON.stringify(holdings));
    localStorage.setItem('STOCKBUILDERS_MISSIONS', JSON.stringify(missions));
    localStorage.setItem('STOCKBUILDERS_ACHIEVEMENTS', JSON.stringify(achievements));
    localStorage.setItem('STOCKBUILDERS_TRADE_LOG', JSON.stringify(tradeLog));
    localStorage.setItem('STOCKBUILDERS_TOTAL_PROFIT', String(totalRealizedProfit));
    localStorage.setItem('STOCKBUILDERS_STOCKS_DATA', JSON.stringify(stocks));
    if (customApiKey) localStorage.setItem('STOCKBUILDERS_API_KEY', customApiKey);
    localStorage.setItem('STOCKBUILDERS_LLM_ENABLED', String(llmEnabled));
  }, [
    cashBalance, gemBalance, playerLevel, playerXP, streakDays, lastStreakClaimDate,
    agentsCatalog, unlockedAgentIds, activeAgentId, holdings, missions, achievements,
    tradeLog, totalRealizedProfit, stocks, customApiKey, llmEnabled
  ]);

  // World Events Rotation (Cycles every 3 minutes)
  useEffect(() => {
    const eventInterval = setInterval(() => {
      setActiveMarketEventIndex(prev => (prev + 1) % MARKET_EVENTS.length);
    }, 180000);
    return () => clearInterval(eventInterval);
  }, []);

  // Real-time Market Quote Polling (Every 10 seconds)
  const refreshStockPrices = useCallback(async () => {
    setIsFetchingLive(true);
    try {
      const updated = await Promise.all(
        stocks.map(async (stock) => {
          try {
            const quote = await fetchRealQuote(stock.symbol, customApiKey);
            const prevSpark = Array.isArray(stock.sparkline) && stock.sparkline.length > 0 
              ? stock.sparkline 
              : [quote.basePrice || quote.price];
            const newSparkline = [...prevSpark.slice(-14), quote.price];

            return {
              ...stock,
              price: quote.price,
              basePrice: quote.basePrice,
              change: quote.change,
              changePercent: quote.changePercent,
              high: quote.high,
              low: quote.low,
              open: quote.open,
              prevClose: quote.prevClose,
              sparkline: newSparkline,
              isLive: quote.isLive,
              lastUpdated: new Date(quote.timestamp).toLocaleTimeString()
            };
          } catch (e) {
            return stock;
          }
        })
      );

      setStocks(updated);
      setLastUpdated(new Date().toLocaleTimeString());
      setMarketDataSource('Real-Time Market Feed (Live)');
    } catch (err) {
      console.error('Market quote sync error:', err);
    } finally {
      setIsFetchingLive(false);
    }
  }, [stocks, customApiKey]);

  useEffect(() => {
    refreshStockPrices();
    const interval = setInterval(() => {
      refreshStockPrices();
    }, 10000);
    return () => clearInterval(interval);
  }, [customApiKey]);

  // Add custom ticker symbol to watchlist
  const addStockSymbol = async (symbolStr) => {
    const sym = symbolStr.toUpperCase().trim();
    if (!sym) return false;
    if (stocks.some(s => s.symbol === sym)) {
      setSelectedStockSymbol(sym);
      showToast(`${sym} is already in your active watchlist!`, 'info');
      return true;
    }

    try {
      setIsFetchingLive(true);
      const quote = await fetchRealQuote(sym, customApiKey);
      const meta = DEFAULT_STOCK_METADATA[sym] || {
        name: `${sym} Corporation`,
        sector: 'Equities',
        logoColor: '#38BDF8',
        defaultPrice: quote.price
      };

      const newsItem = await fetchStockNews(sym, customApiKey);

      const newStock = {
        symbol: sym,
        name: meta.name,
        sector: meta.sector,
        price: quote.price,
        basePrice: quote.basePrice,
        change: quote.change,
        changePercent: quote.changePercent,
        high: quote.high,
        low: quote.low,
        open: quote.open,
        prevClose: quote.prevClose,
        sparkline: [quote.basePrice, quote.price],
        volatility: 'HIGH',
        tier: 'Tier A',
        logoColor: meta.logoColor,
        news: newsItem.headline,
        isLive: quote.isLive,
      };

      setStocks(prev => [newStock, ...prev]);
      setSelectedStockSymbol(sym);
      addXP(40, 'Watchlist Asset Registration');
      soundFx.play('click');
      showToast(`Added ${sym} (${meta.name}) to Arena with live data! +40 XP earned`, 'success');
      return true;
    } catch (e) {
      showToast(`Could not fetch live data for ticker: ${sym}`, 'warning');
      return false;
    } finally {
      setIsFetchingLive(false);
    }
  };

  // QUANTUM Agent Passive Yield (Every 30s)
  useEffect(() => {
    if (activeAgent.id === 'agent-quantum') {
      const yieldInterval = setInterval(() => {
        const bonusYield = 25;
        setCashBalance(prev => prev + bonusYield);
        addFloatingText(`+$${bonusYield}`, 'cash');
        soundFx.play('gemClaim');
        showToast('⚡ QUANTUM High-Frequency Micro-Scalp: +$25 Passive Yield credited!', 'success');
      }, 30000);
      return () => clearInterval(yieldInterval);
    }
  }, [activeAgent.id]);

  // Real-Time Decision Advice from Active AI Agent
  useEffect(() => {
    const selectedStock = stocks.find(s => s.symbol === selectedStockSymbol) || stocks[0];
    if (!selectedStock) return;

    const isDip = selectedStock.changePercent <= -0.5 || selectedStock.price < selectedStock.basePrice;
    const isRally = selectedStock.changePercent >= 1.5;

    let action = isDip ? 'BUY' : (isRally ? 'SELL' : 'BUY');
    let shares = Math.max(1, Math.floor(1500 / selectedStock.price));
    let confidence = activeAgent.stats.accuracy;

    let reason = '';
    if (activeAgent.id === 'agent-scout') {
      reason = isDip 
        ? `${selectedStock.symbol} has pulled back to $${selectedStock.price.toFixed(2)} (${selectedStock.changePercent}% today). SCOUT recommends buying ${shares} shares on the dip to start your quest!`
        : `${selectedStock.symbol} is gaining upward real market momentum at $${selectedStock.price.toFixed(2)} (+${selectedStock.changePercent}%). Buy ${shares} shares to ride the rally wave.`;
    } else if (activeAgent.id === 'agent-oracle') {
      reason = isDip
        ? `ORACLE Neural Forecast: 88% confidence breakout cycle detected! High conviction entry on ${selectedStock.symbol} at $${selectedStock.price.toFixed(2)}.`
        : `ORACLE Price Ceiling warning: High resistance near today's high ($${(selectedStock.high || selectedStock.price).toFixed(2)}). Lock in partial profit on ${selectedStock.symbol}.`;
    } else if (activeAgent.id === 'agent-quantum') {
      reason = `QUANTUM High-Speed Matrix: Live spread captured on ${selectedStock.symbol}. Instant scalp opportunity for ${shares} shares at $${selectedStock.price.toFixed(2)}.`;
    } else if (activeAgent.id === 'agent-valkyrie') {
      reason = `VALKYRIE Tech Radar: High-Beta breakout vector active on ${selectedStock.symbol} (${selectedStock.changePercent}% day change). +${activeAgent.stats.profitBonus}% profit multiplier engaged!`;
    } else if (activeAgent.id === 'agent-aegis') {
      reason = `AEGIS Risk Shield: Optimal risk-reward ratio verified for ${selectedStock.symbol}. Loss protection cap enabled at max -2%.`;
    } else if (activeAgent.id === 'agent-titan') {
      reason = `TITAN Whale Insight: Institutional accumulation cluster identified on ${selectedStock.symbol}. Unlocks 3x buying power leverage.`;
    }

    setAgentAdvice({
      agent: activeAgent,
      stock: selectedStock,
      action,
      shares,
      estimatedCost: +(shares * selectedStock.price).toFixed(2),
      confidence: `${confidence}%`,
      reason,
      timestamp: 'Live Agent Signal',
    });
  }, [selectedStockSymbol, stocks, activeAgent]);

  // Optional LLM advice override
  useEffect(() => {
    if (!llmEnabled) return;
    const selectedStock = stocks.find(s => s.symbol === selectedStockSymbol) || stocks[0];
    if (!selectedStock) return;

    let cancelled = false;
    (async () => {
      try {
        const prompt = `You are a concise trading game assistant. Given agent ${activeAgent.name} (Lv ${activeAgent.level}) and stock ${selectedStock.symbol} priced at $${selectedStock.price}, recommend action (BUY/SELL), shares, and a 1-sentence game rationale. Return JSON: {"action":"BUY","shares":10,"rationale":"..."}`;
        const text = await generateAgentSignal(prompt);
        if (cancelled) return;
        let parsed = null;
        try { parsed = JSON.parse(text); } catch (e) { parsed = null; }

        setAgentAdvice(prev => {
          if (!parsed) return { ...prev, reason: String(text).slice(0, 500) };
          return {
            ...prev,
            action: parsed.action || prev.action,
            shares: parsed.shares || prev.shares,
            reason: parsed.rationale || prev.reason,
          };
        });
      } catch (err) {
        console.error('LLM advice error:', err);
      }
    })();

    return () => { cancelled = true; };
  }, [llmEnabled, selectedStockSymbol, stocks, activeAgentId]);

  // Execute Trade Method (BUY / SELL)
  const executeTrade = (symbol, type, sharesToTrade) => {
    const stock = stocks.find(s => s.symbol === symbol);
    const sharesNum = parseFloat(sharesToTrade);
    if (!stock || isNaN(sharesNum) || sharesNum <= 0) return false;

    const totalTransaction = sharesNum * stock.price;

    if (type === 'BUY') {
      if (cashBalance < totalTransaction) {
        soundFx.play('error');
        showToast('Insufficient virtual cash balance to execute this trade!', 'warning');
        return false;
      }

      setCashBalance(prev => +(prev - totalTransaction).toFixed(2));

      // Update holdings
      const existingIdx = holdings.findIndex(h => h.symbol === symbol);
      let updatedHoldings = [...holdings];

      if (existingIdx >= 0) {
        const existing = updatedHoldings[existingIdx];
        const newTotalShares = existing.shares + sharesNum;
        const newAvg = ((existing.shares * existing.avgPrice) + totalTransaction) / newTotalShares;
        updatedHoldings[existingIdx] = {
          ...existing,
          shares: newTotalShares,
          avgPrice: +newAvg.toFixed(2),
          currentPrice: stock.price,
        };
      } else {
        updatedHoldings.push({
          symbol: stock.symbol,
          name: stock.name,
          sector: stock.sector,
          shares: sharesNum,
          avgPrice: stock.price,
          currentPrice: stock.price,
          logoColor: stock.logoColor,
        });
      }

      setHoldings(updatedHoldings);

      // Sound & floating feedback
      soundFx.play('buy');
      addFloatingText(`-$${totalTransaction.toLocaleString()}`, 'cash');
      addXP(35, 'Stock Acquisition');

      // Check Mission 1 & 3
      advanceMission('m-rookie-1', 1);
      if (['AI & Semiconductors', 'Cloud & AI Kernel', 'Defense AI & Data', 'AI Hardware & Chips', 'Consumer Tech'].includes(stock.sector)) {
        advanceMission('m-tier-1', 1);
      }

      // Check Achievements
      checkAchievementUnlock('ach-first-trade', 1);

      // Log trade
      logTradeItem({
        id: `trade-${Date.now()}`,
        symbol: stock.symbol,
        type: 'BUY',
        shares: sharesNum,
        price: stock.price,
        total: totalTransaction,
        profit: 0,
        agentUsed: activeAgent.name,
        timestamp: 'Just now',
      });

      showToast(`⚡ Bought ${sharesNum} shares of ${stock.symbol} at $${stock.price.toFixed(2)} ($${totalTransaction.toLocaleString()})`, 'success');
      return true;

    } else if (type === 'SELL') {
      const existing = holdings.find(h => h.symbol === symbol);
      if (!existing || existing.shares < sharesNum) {
        soundFx.play('error');
        showToast(`You do not own enough shares of ${symbol} to sell!`, 'warning');
        return false;
      }

      const costBasis = sharesNum * existing.avgPrice;
      let rawProfit = totalTransaction - costBasis;

      // Apply Agent Perks & Market Event Multipliers
      if (rawProfit > 0) {
        const agentBonusPct = (activeAgent.stats.profitBonus || 0);
        const eventBonusPct = ((activeMarketEvent?.profitMultiplier || 1) - 1) * 100;
        const totalBonusPct = agentBonusPct + eventBonusPct;
        if (totalBonusPct > 0) {
          rawProfit += rawProfit * (totalBonusPct / 100);
        }
      }

      // Apply Aegis Crash Shield Loss Protection
      if (activeAgent.id === 'agent-aegis' && rawProfit < 0) {
        const maxLoss = costBasis * 0.02; // max -2%
        if (Math.abs(rawProfit) > maxLoss) {
          rawProfit = -maxLoss;
          showToast('🛡️ AEGIS Crash Shield triggered! Position loss capped at only -2%.', 'info');
        }
      }

      const finalPayout = costBasis + rawProfit;
      setCashBalance(prev => +(prev + finalPayout).toFixed(2));
      setTotalRealizedProfit(prev => +(prev + rawProfit).toFixed(2));

      // Update holdings
      let updatedHoldings;
      if (existing.shares === sharesNum) {
        updatedHoldings = holdings.filter(h => h.symbol !== symbol);
      } else {
        updatedHoldings = holdings.map(h => 
          h.symbol === symbol ? { ...h, shares: h.shares - sharesNum } : h
        );
      }
      setHoldings(updatedHoldings);

      // Sound & feedback
      if (rawProfit > 0) {
        soundFx.play('win');
        triggerConfetti(['#10B981', '#34D399', '#FBBF24', '#06B6D4']);
        addFloatingText(`+$${rawProfit.toFixed(2)} WIN!`, 'win');
        addXP(75 + Math.min(200, Math.floor(rawProfit / 10)), 'Winning Trade');

        // Chance of bonus gem drop on win
        if (Math.random() < (activeMarketEvent?.gemDropChance || 0.3)) {
          const dropGems = Math.floor(Math.random() * 3) + 2;
          setGemBalance(g => g + dropGems);
          addFloatingText(`+${dropGems} 💎 BONUS!`, 'gem');
        }

        showToast(`🎉 Sold ${sharesNum} ${stock.symbol} at $${stock.price.toFixed(2)} (++$${rawProfit.toFixed(2)} PROFIT)!`, 'success');
      } else {
        soundFx.play('sell');
        addFloatingText(`+$${finalPayout.toFixed(2)}`, 'cash');
        addXP(25, 'Trade Close');
        showToast(`Sold ${sharesNum} ${stock.symbol} at $${stock.price.toFixed(2)} ($${rawProfit.toFixed(2)})`, 'info');
      }

      // Advance Missions
      if (rawProfit >= 150) {
        advanceMission('m-rookie-2', rawProfit);
      }
      if (rawProfit > 0) {
        advanceMission('m-tier-2', rawProfit);
        checkAchievementUnlock('ach-profit-1k', totalRealizedProfit + rawProfit);
      }

      // Log trade
      logTradeItem({
        id: `trade-${Date.now()}`,
        symbol: stock.symbol,
        type: 'SELL',
        shares: sharesNum,
        price: stock.price,
        total: finalPayout,
        profit: +rawProfit.toFixed(2),
        agentUsed: activeAgent.name,
        timestamp: 'Just now',
      });

      return true;
    }
  };

  const logTradeItem = (item) => {
    setTradeLog(prev => [item, ...prev]);
  };

  // Follow Agent's Active Advice in 1 Click
  const followAgentAdvice = () => {
    if (!agentAdvice) return;
    executeTrade(agentAdvice.stock.symbol, agentAdvice.action, agentAdvice.shares);
  };

  // Advance Mission Progress Helper
  const advanceMission = (missionId, amount) => {
    setMissions(prevMissions => 
      prevMissions.map(m => {
        if (m.id === missionId && !m.claimed) {
          const newProgress = Math.min(m.target, m.progress + amount);
          return { ...m, progress: newProgress };
        }
        return m;
      })
    );
  };

  // Check Achievement Progress
  const checkAchievementUnlock = (achId, progressValue) => {
    setAchievements(prev => 
      prev.map(ach => {
        if (ach.id === achId && !ach.unlocked && progressValue >= ach.target) {
          soundFx.play('win');
          triggerConfetti(['#F59E0B', '#EC4899', '#10B981']);
          showToast(`🏆 UNLOCKED ACHIEVEMENT: "${ach.title}"! Claim rewards in Quest Hub.`, 'success');
          return { ...ach, unlocked: true, readyToClaim: true };
        }
        return ach;
      })
    );
  };

  // Claim Mission Rewards
  const claimMissionReward = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.claimed || mission.progress < mission.target) return;

    setGemBalance(prev => prev + mission.rewardGems);
    setCashBalance(prev => prev + mission.rewardCash);

    setMissions(prev => 
      prev.map(m => m.id === missionId ? { ...m, claimed: true } : m)
    );

    soundFx.play('gemClaim');
    triggerConfetti(['#F59E0B', '#FBBF24', '#10B981', '#8B5CF6']);
    addXP(mission.rewardXP || 150, 'Quest Completion');
    addFloatingText(`+${mission.rewardGems} 💎`, 'gem');
    addFloatingText(`+$${mission.rewardCash}`, 'cash');

    showToast(`Claimed Mission Reward: +${mission.rewardGems} 💎 Gems, +$${mission.rewardCash} Cash & +${mission.rewardXP || 150} XP!`, 'success');
  };

  // Claim Lifetime Achievement Reward
  const claimAchievement = (achId) => {
    const ach = achievements.find(a => a.id === achId);
    if (!ach || ach.claimed || !ach.unlocked) return;

    setGemBalance(prev => prev + ach.rewardGems);
    setAchievements(prev => 
      prev.map(a => a.id === achId ? { ...a, claimed: true } : a)
    );

    soundFx.play('gemClaim');
    triggerConfetti(['#EC4899', '#A855F7', '#F59E0B']);
    addXP(ach.rewardXP, 'Achievement Unlocked');
    addFloatingText(`+${ach.rewardGems} 💎`, 'gem');

    showToast(`Claimed Achievement: +${ach.rewardGems} 💎 Gems & +${ach.rewardXP} XP!`, 'success');
  };

  // Unlock Advanced Agent in Agent Forge using 💎 Gems
  const unlockAgent = (agent) => {
    if (unlockedAgentIds.includes(agent.id)) {
      setActiveAgentId(agent.id);
      soundFx.play('click');
      showToast(`Switched active companion co-pilot to ${agent.name}!`, 'info');
      return;
    }

    if (gemBalance < agent.unlockCostGems) {
      soundFx.play('error');
      showToast(`Need ${agent.unlockCostGems - gemBalance} more 💎 Gems to recruit ${agent.name}! Complete quests to earn gems.`, 'warning');
      return;
    }

    // Deduct Gems and Unlock
    setGemBalance(prev => prev - agent.unlockCostGems);
    const newUnlocked = [...unlockedAgentIds, agent.id];
    setUnlockedAgentIds(newUnlocked);
    setActiveAgentId(agent.id);

    soundFx.play('win');
    triggerConfetti(['#EC4899', '#A855F7', '#06B6D4', '#F59E0B']);
    addXP(300, 'Agent Recruitment');
    addFloatingText(`-${agent.unlockCostGems} 💎`, 'gem');

    // Advance Mission & Achievements
    advanceMission('m-tier-3', 1);
    if (newUnlocked.length >= 3) {
      checkAchievementUnlock('ach-agents-3', 3);
    }

    showToast(`🎉 RECRUITED ${agent.name} (${agent.title})! Companion skills now active in Arena.`, 'success');
  };

  // Free Emergency Demo Aid
  const claimFreeDemoGrant = () => {
    setCashBalance(prev => prev + 5000);
    setGemBalance(prev => prev + 35);
    soundFx.play('gemClaim');
    addXP(100, 'Simulator Aid Grant');
    addFloatingText('+35 💎', 'gem');
    addFloatingText('+$5,000', 'cash');
    showToast('Claimed Free Simulator Aid: +$5,000 Cash & +35 💎 Gems!', 'success');
  };

  // Portfolio Net Worth & League Tier Calculation
  const holdingsMarketValue = holdings.reduce((sum, h) => {
    const liveStock = stocks.find(s => s.symbol === h.symbol);
    const price = liveStock ? liveStock.price : h.avgPrice;
    return sum + (h.shares * price);
  }, 0);

  const totalNetWorth = +(cashBalance + holdingsMarketValue).toFixed(2);
  const totalCostBasis = holdings.reduce((sum, h) => sum + (h.shares * h.avgPrice), 0);
  const unrealizedProfit = +(holdingsMarketValue - totalCostBasis).toFixed(2);

  // League Tier Calculation
  const currentLeague = [...LEAGUE_TIERS].reverse().find(t => totalNetWorth >= t.minNetWorth) || LEAGUE_TIERS[0];

  // Win rate calculation
  const totalClosedTrades = tradeLog.filter(t => t.type === 'SELL').length;
  const winningTrades = tradeLog.filter(t => t.type === 'SELL' && t.profit > 0).length;
  const winRate = totalClosedTrades > 0 ? Math.round((winningTrades / totalClosedTrades) * 100) : 100;

  const value = {
    // Economy & Player Progress
    cashBalance,
    gemBalance,
    playerLevel,
    playerXP,
    xpForNextLevel,
    currentRank,
    streakDays,
    isStreakClaimedToday,
    claimDailyStreakReward,
    addXP,
    // Portfolio & League
    totalNetWorth,
    holdingsMarketValue,
    unrealizedProfit,
    totalRealizedProfit,
    currentLeague,
    winRate,
    holdings,
    // Stocks & Real-Time Data
    stocks,
    selectedStockSymbol,
    setSelectedStockSymbol,
    isFetchingLive,
    lastUpdated,
    marketDataSource,
    refreshStockPrices,
    addStockSymbol,
    customApiKey,
    setCustomApiKey,
    // World Events
    activeMarketEvent,
    // AI Companions (Agent Forge)
    agentsCatalog,
    unlockedAgentIds,
    activeAgent,
    activeAgentId,
    setActiveAgentId,
    unlockAgent,
    trainCompanion,
    llmEnabled,
    setLlmEnabled,
    agentAdvice,
    // Quests, Achievements, Trades
    missions,
    achievements,
    claimMissionReward,
    claimAchievement,
    executeTrade,
    followAgentAdvice,
    tradeLog,
    claimFreeDemoGrant,
    // Audio & Feedback
    soundMuted,
    toggleSound,
    playSound,
    floatingTexts,
    addFloatingText,
    levelUpData,
    setLevelUpData,
    toast,
    showToast,
    triggerConfetti,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
