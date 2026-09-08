# Antigravity Project Context & Agent Memory

## Project Overview
* **Name**: Stock Builders / Nexora Live Stocks
* **Tech Stack**: React 18, Vite, Lucide Icons, Canvas Confetti
* **Git Remote**: `https://github.com/frederick-x/Stock_Builders.git`
* **Active Branch**: `Ancela-Joshiya`
* **Original Conversation ID**: `8964f5d7-5649-4a81-a3f9-64dc5d7c48f8`

---

## Current Architecture & State
1. **Real-Time Market Data Layer**:
   - `src/services/realStockService.js`: Fetches live market data (Finnhub & Yahoo Finance APIs), real price quotes, intraday & historical sparklines (1D/1W/1M), and real company news for US equities (NVDA, AAPL, TSLA, MSFT, AMZN, AMD, PLTR, COIN, etc.).
   - Includes 10-second smart client caching and resilient benchmark fallbacks.
2. **Gameplay Context Engine**:
   - `src/context/GameContext.jsx`: Runs an automated 10-second live polling loop, dynamic ticker addition (`addStockSymbol`), and real portfolio valuations.
3. **Trading Floor Interface**:
   - `src/pages/TradingFloorPage.jsx`: Real-time status bar, interactive 1D/1W/1M chart timeframe selectors, real Day High/Low/Open/PrevClose metrics, ticker search bar, and API key settings modal.
4. **Local Development**:
   - Running on `http://localhost:5173/` (`npm run dev`).
   - Production bundle verified with `npm run build`.

---

## Instructions for Resuming Agent
When continuing in any Antigravity account or session:
- Maintain the real-time market data integration in `src/services/realStockService.js`.
- All stock prices, charts, and news feeds should remain dynamic and connected to live market feeds.
- Any new commits should target the `Ancela-Joshiya` branch on `https://github.com/frederick-x/Stock_Builders.git`.
