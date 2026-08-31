import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  AGENTS_CATALOG, 
  INITIAL_STOCKS, 
  INITIAL_MISSIONS 
} from '../services/gameData';
import { 
  fetchRealQuote, 
  fetchStockNews, 
  DEFAULT_STOCK_METADATA 
} from '../services/realStockService';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  // 1. Dual Economy
  const [cashBalance, setCashBalance] = useState(() => {
    const saved = localStorage.getItem('NEXORA_CASH_BALANCE');
    return saved ? Number(saved) : 10000;
  });

  const [gemBalance, setGemBalance] = useState(() => {
    const saved = localStorage.getItem('NEXORA_GEM_BALANCE');
    return saved ? Number(saved) : 25; // 25 starter gems!
  });

  // 2. Unlocked Agents Roster (Starter is SCOUT)
  const [unlockedAgentIds, setUnlockedAgentIds] = useState(() => {
    const saved = localStorage.getItem('NEXORA_UNLOCKED_AGENTS');
    return saved ? JSON.parse(saved) : ['agent-scout'];
  });

  const [activeAgentId, setActiveAgentId] = useState(() => {
    const saved = localStorage.getItem('NEXORA_ACTIVE_AGENT');
    return saved || 'agent-scout';
  });

  // 3. Stocks Market Ticker & Real Live Data States
  const [stocks, setStocks] = useState(() => {
    const saved = localStorage.getItem('NEXORA_STOCKS_DATA');
    return saved ? JSON.parse(saved) : INITIAL_STOCKS;
  });
  const [selectedStockSymbol, setSelectedStockSymbol] = useState('NVDA');
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [marketDataSource, setMarketDataSource] = useState('Real-Time Market Feed');
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('NEXORA_API_KEY') || '');

  // 4. Portfolio Holdings
  const [holdings, setHoldings] = useState(() => {
    const saved = localStorage.getItem('NEXORA_PORTFOLIO_HOLDINGS');
    return saved ? JSON.parse(saved) : [];
  });

  // 5. Missions & Achievements
  const [missions, setMissions] = useState(() => {
    const saved = localStorage.getItem('NEXORA_MISSIONS');
    return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
  });

  // 6. Realized Trading History & Stats
  const [tradeLog, setTradeLog] = useState(() => {
    const saved = localStorage.getItem('NEXORA_TRADE_LOG');
    return saved ? JSON.parse(saved) : [];
  });

  const [totalRealizedProfit, setTotalRealizedProfit] = useState(() => {
    const saved = localStorage.getItem('NEXORA_TOTAL_PROFIT');
    return saved ? Number(saved) : 0;
  });

  // 7. Active Agent Decision Advice State
  const [agentAdvice, setAgentAdvice] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  const triggerConfetti = (colors = ['#8B5CF6', '#06B6D4', '#10B981', '#FBBF24']) => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 },
      colors
    });
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('NEXORA_CASH_BALANCE', String(cashBalance));
    localStorage.setItem('NEXORA_GEM_BALANCE', String(gemBalance));
    localStorage.setItem('NEXORA_UNLOCKED_AGENTS', JSON.stringify(unlockedAgentIds));
    localStorage.setItem('NEXORA_ACTIVE_AGENT', activeAgentId);
    localStorage.setItem('NEXORA_PORTFOLIO_HOLDINGS', JSON.stringify(holdings));
    localStorage.setItem('NEXORA_MISSIONS', JSON.stringify(missions));
    localStorage.setItem('NEXORA_TRADE_LOG', JSON.stringify(tradeLog));
    localStorage.setItem('NEXORA_TOTAL_PROFIT', String(totalRealizedProfit));
    localStorage.setItem('NEXORA_STOCKS_DATA', JSON.stringify(stocks));
    if (customApiKey) localStorage.setItem('NEXORA_API_KEY', customApiKey);
  }, [cashBalance, gemBalance, unlockedAgentIds, activeAgentId, holdings, missions, tradeLog, totalRealizedProfit, stocks, customApiKey]);

  // Current Active Agent Object
  const activeAgent = AGENTS_CATALOG.find(a => a.id === activeAgentId) || AGENTS_CATALOG[0];

  // Fetch real-time market data quotes for all active watchlist stocks
  const refreshStockPrices = useCallback(async () => {
    setIsFetchingLive(true);
    try {
      const updated = await Promise.all(
        stocks.map(async (stock) => {
          try {
            const quote = await fetchRealQuote(stock.symbol, customApiKey);
            const prevSpark = Array.isArray(stock.sparkline) && stock.sparkline.length > 0 ? stock.sparkline : [quote.basePrice || quote.price];
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
      setMarketDataSource('Real-Time Financial Markets (Live)');
    } catch (err) {
      console.error('Market quote sync error:', err);
    } finally {
      setIsFetchingLive(false);
    }
  }, [stocks, customApiKey]);

  // Real-time market feed polling loop (Every 10 seconds)
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
        logoColor: meta.logoColor,
        news: newsItem.headline,
        isLive: quote.isLive,
      };

      setStocks(prev => [newStock, ...prev]);
      setSelectedStockSymbol(sym);
      showToast(`Added ${sym} (${meta.name}) with live market data!`, 'success');
      return true;
    } catch (e) {
      showToast(`Could not fetch data for ticker: ${sym}`, 'warning');
      return false;
    } finally {
      setIsFetchingLive(false);
    }
  };

  // Passive Yield for QUANTUM agent
  useEffect(() => {
    if (activeAgent.id === 'agent-quantum') {
      const yieldInterval = setInterval(() => {
        setCashBalance(prev => prev + 25);
        showToast('QUANTUM High-Frequency Micro-Scalp: +$25 Passive Yield credited!', 'success');
      }, 30000);
      return () => clearInterval(yieldInterval);
    }
  }, [activeAgent.id]);

  // Generate Real-Time Decision Advice from Active Agent
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
        ? `${selectedStock.symbol} has pulled back to $${selectedStock.price.toFixed(2)} (${selectedStock.changePercent}% today). SCOUT recommends buying ${shares} shares on the dip to start Mission #1!`
        : `${selectedStock.symbol} is gaining upward real market momentum at $${selectedStock.price.toFixed(2)} (+${selectedStock.changePercent}%). Buy ${shares} shares to ride the wave.`;
    } else if (activeAgent.id === 'agent-oracle') {
      reason = isDip
        ? `ORACLE Neural Forecast: 88% confidence breakout cycle detected! High conviction real-market entry on ${selectedStock.symbol} at $${selectedStock.price.toFixed(2)}.`
        : `ORACLE Price Ceiling warning: High resistance near today's high ($${(selectedStock.high || selectedStock.price).toFixed(2)}). Lock in partial profit on ${selectedStock.symbol}.`;
    } else if (activeAgent.id === 'agent-quantum') {
      reason = `QUANTUM High-Speed Matrix: Real spread captured on ${selectedStock.symbol}. Instant scalp opportunity for ${shares} shares at $${selectedStock.price.toFixed(2)}.`;
    } else if (activeAgent.id === 'agent-valkyrie') {
      reason = `VALKYRIE Tech Radar: High-Beta breakout vector active on ${selectedStock.symbol} (${selectedStock.changePercent}% day change). +25% profit multiplier engaged!`;
    } else if (activeAgent.id === 'agent-aegis') {
      reason = `AEGIS Risk Shield: Optimal risk-reward ratio verified for ${selectedStock.symbol}. Real loss protection cap enabled at max -2%.`;
    } else if (activeAgent.id === 'agent-titan') {
      reason = `TITAN Whale Insight: Real liquidity accumulation cluster identified on ${selectedStock.symbol}. Unlocks 3x buying power leverage for massive yield.`;
    }

    setAgentAdvice({
      agent: activeAgent,
      stock: selectedStock,
      action,
      shares,
      estimatedCost: +(shares * selectedStock.price).toFixed(2),
      confidence: `${confidence}%`,
      reason,
      timestamp: 'Live Real Market Signal',
    });
  }, [selectedStockSymbol, stocks, activeAgent]);

  // Execute Trade Method
  const executeTrade = (symbol, type, sharesToTrade) => {
    const stock = stocks.find(s => s.symbol === symbol);
    const sharesNum = parseFloat(sharesToTrade);
    if (!stock || isNaN(sharesNum) || sharesNum <= 0) return false;

    const totalTransaction = sharesNum * stock.price;

    if (type === 'BUY') {
      if (cashBalance < totalTransaction) {
        showToast('Insufficient cash balance to execute this trade!', 'warning');
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

      // Advance Mission 1 ("First Market Entry")
      advanceMission('m-rookie-1', 1);

      // Advance Mission 3 ("Tech Sector Surge")
      if (['AI & Semiconductors', 'Cloud & AI Kernel', 'Defense AI & Data', 'AI Hardware & Chips', 'Consumer Tech'].includes(stock.sector)) {
        advanceMission('m-tier-1', 1);
      }

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

      showToast(`Bought ${sharesNum} shares of ${stock.symbol} at live price $${stock.price.toFixed(2)} ($${totalTransaction.toLocaleString()})`, 'success');
      return true;

    } else if (type === 'SELL') {
      const existing = holdings.find(h => h.symbol === symbol);
      if (!existing || existing.shares < sharesNum) {
        showToast(`You do not own enough shares of ${symbol} to sell!`, 'warning');
        return false;
      }

      const costBasis = sharesNum * existing.avgPrice;
      let rawProfit = totalTransaction - costBasis;

      // Apply Agent Perks
      if (activeAgent.stats.profitBonus > 0 && rawProfit > 0) {
        const bonusAmount = rawProfit * (activeAgent.stats.profitBonus / 100);
        rawProfit += bonusAmount;
      }

      // Apply Aegis Crash Shield Loss Protection
      if (activeAgent.id === 'agent-aegis' && rawProfit < 0) {
        const maxLoss = costBasis * 0.02; // max -2%
        if (Math.abs(rawProfit) > maxLoss) {
          rawProfit = -maxLoss;
          showToast('AEGIS Crash Shield triggered! Position loss capped at only -2%.', 'info');
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

      // Advance Mission 2 ("Lock In First Profit")
      if (rawProfit >= 150) {
        advanceMission('m-rookie-2', rawProfit);
      }

      // Advance Mission 4 ("Accumulate $2000 Profit")
      if (rawProfit > 0) {
        advanceMission('m-tier-2', rawProfit);
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

      if (rawProfit > 0) {
        triggerConfetti();
        showToast(`Sold ${sharesNum} ${stock.symbol} at live price $${stock.price.toFixed(2)} (++$${rawProfit.toFixed(2)} Profit)!`, 'success');
      } else {
        showToast(`Sold ${sharesNum} ${stock.symbol} at $${stock.price.toFixed(2)} ($${rawProfit.toFixed(2)})`, 'info');
      }
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

  // Claim Mission Rewards (Awards 💎 Premium Gems + Bonus Cash!)
  const claimMissionReward = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || mission.claimed || mission.progress < mission.target) return;

    setGemBalance(prev => prev + mission.rewardGems);
    setCashBalance(prev => prev + mission.rewardCash);

    setMissions(prev => 
      prev.map(m => m.id === missionId ? { ...m, claimed: true } : m)
    );

    triggerConfetti(['#F59E0B', '#FBBF24', '#10B981', '#8B5CF6']);
    showToast(`Claimed Mission Reward: +${mission.rewardGems} 💎 Premium Gems & +$${mission.rewardCash} Cash!`, 'success');
  };

  // Unlock Advanced Agent in Agent Forge using 💎 Premium Gems
  const unlockAgent = (agent) => {
    if (unlockedAgentIds.includes(agent.id)) {
      setActiveAgentId(agent.id);
      showToast(`Switched active trading agent to ${agent.name}!`, 'info');
      return;
    }

    if (gemBalance < agent.unlockCostGems) {
      showToast(`Need ${agent.unlockCostGems - gemBalance} more 💎 Nexus Gems to recruit ${agent.name}! Complete missions to earn gems.`, 'warning');
      return;
    }

    // Deduct Gems and Unlock
    setGemBalance(prev => prev - agent.unlockCostGems);
    const newUnlocked = [...unlockedAgentIds, agent.id];
    setUnlockedAgentIds(newUnlocked);
    setActiveAgentId(agent.id);

    // Advance Mission 5 ("Recruit Your Second AI Agent")
    advanceMission('m-tier-3', 1);

    triggerConfetti(['#EC4899', '#A855F7', '#06B6D4', '#F59E0B']);
    showToast(`🎉 UNLOCKED ${agent.name} (${agent.title})! New decision skills now active on Trading Floor.`, 'success');
  };

  // Free Emergency Demo Aid
  const claimFreeDemoGrant = () => {
    setCashBalance(prev => prev + 5000);
    setGemBalance(prev => prev + 35);
    showToast('Claimed Free Simulator Aid: +$5,000 Cash & +35 💎 Gems!', 'success');
  };

  // Portfolio Totals Calculation
  const holdingsMarketValue = holdings.reduce((sum, h) => {
    const liveStock = stocks.find(s => s.symbol === h.symbol);
    const price = liveStock ? liveStock.price : h.avgPrice;
    return sum + (h.shares * price);
  }, 0);

  const totalNetWorth = +(cashBalance + holdingsMarketValue).toFixed(2);
  const totalCostBasis = holdings.reduce((sum, h) => sum + (h.shares * h.avgPrice), 0);
  const unrealizedProfit = +(holdingsMarketValue - totalCostBasis).toFixed(2);

  const value = {
    // Economy
    cashBalance,
    gemBalance,
    totalNetWorth,
    holdingsMarketValue,
    unrealizedProfit,
    totalRealizedProfit,
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
    holdings,
    // Agents
    unlockedAgentIds,
    activeAgent,
    activeAgentId,
    setActiveAgentId,
    unlockAgent,
    agentAdvice,
    // Missions & Trades
    missions,
    claimMissionReward,
    executeTrade,
    followAgentAdvice,
    tradeLog,
    claimFreeDemoGrant,
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
