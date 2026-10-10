# Meteora DBC Toolkit: Dynamic Bonding Curve Architect & DAMM v2 Migration Simulator 🚀

> **Submitted to the Crypto World's Fair — Best Use of Meteora's Dynamic Bonding Curve (DBC) Hackathon Track ($20,000 USDC Prize Pool)**
> **Live Interactive Demo:** [https://liutingqiu.github.io/meteora-dbc-toolkit/](https://liutingqiu.github.io/meteora-dbc-toolkit/)  
> **Open Source GitHub Repository:** [https://github.com/liutingqiu/meteora-dbc-toolkit](https://github.com/liutingqiu/meteora-dbc-toolkit)  
> **Author & Lead Engineer:** Tingqiu Liu (`@liutingqiu`, `tianqi689@gmail.com`)

---

## 🎯 Executive Summary & The Problem

Meteora's **Dynamic Bonding Curve (DBC)** is the most sophisticated token launch primitive in Web3. Unlike legacy fixed-slope bonding curves (like Pump.fun) that force every project into an identical rigid formula, Meteora DBC empowers builders to define custom curve geometries, fee distributions, quote tokens, and automated transitions into **Meteora DAMM v2** and **DLMM** liquidity pools.

However, builders and launchpad creators face several friction points:
1. **Mathematical Complexity:** Calculating the integral for arbitrary curves (Sigmoid S-curves, exponential discovery, dampened RWA corridors) requires numerical integration to ensure graduation quote targets and terminal market caps match exact treasury requirements.
2. **Migration Uncertainty:** Teams struggle to simulate how virtual reserves, initial tick intervals, and liquidity splits will behave upon graduating into Meteora DAMM v2 pools.
3. **Lack of Asset-Class Presets:** One curve does not fit all. AI Agents, Tokenized Equities (Stocks), Real World Assets (RWAs), and Memecoins have fundamentally distinct volatility and price discovery needs.

---

## 💡 The Solution: Meteora DBC Toolkit

**Meteora DBC Toolkit** is an open-source TypeScript SDK, mathematical engine, and visualizer built specifically for developers, launchpads, and algorithmic token designers on Solana.

### Key Pillars:

### 1. Multi-Paradigm Mathematical Curve Engine
We implemented 5 distinct mathematical bonding curve models:
- **Exponential Discovery Curve (Meme / High-Velocity Tokens):** Accelerating slope that rewards early believers while preventing early snipers from capturing disproportionate supply at near-zero cost.
- **Sigmoid S-Curve (AI Agent & Autonomous Economy Tokens):** Flat initial accumulation corridor for agent discovery, steep middle adoption curve, and smooth saturation as the token approaches DAMM v2 graduation.
- **Dampened Bounded-Corridor Curve (Tokenized Equities & RWAs):** Designed for tokenized stocks (e.g. AAPL, NVDA) and asset-backed tokens with underlying NAV anchors. Limits volatility within a realistic +/- 20-35% price band with logarithmic dampening.
- **Protected Floor Step Curve (Community / Fair Launch):** Guaranteed flat entry floor for the initial 25% of supply, eliminating predatory frontrunning and sandwiching.
- **Linear Constant Liquidity Slope:** Classic predictable linear model with exact closed-form integral computation.

### 2. Seamless Meteora DAMM v2 / DLMM Migration Calculator
When the bonding curve reaches its graduation threshold (e.g., 85 SOL or 25,000 USDC):
- Automatically calculates the exact split between remaining base tokens and accumulated quote assets.
- Computes initial virtual reserves (`virtualReservesQuote` and `virtualReservesBase`) to guarantee zero price slippage at migration instant.
- Selects the optimal pool archetype: **Meteora DAMM v2** for dynamic-fee volatile tokens, or **Meteora DLMM** (Concentrated Liquidity) for bounded RWA/Equity pairs.
- Configures permanent LP burn / timelock parameters for 100% rug-proof liquidity.

### 3. Native Schema Exporter for Meteora Invent CLI & On-Chain Programs
One-click export produces the exact, validated JSON configuration required by `@meteora-ag/dynamic-bonding-curve` and the `meteora-invent` CLI, complete with 9-decimal base mint and quote mint conversions in string BigInt format.

### 4. Interactive Zero-Dependency Web Playground
An interactive single-page application built with Chart.js allowing builders to:
- Adjust parameters via live sliders (Total Supply, Curve Supply, Initial Price, Graduation Threshold, Fee BPS, Creator Royalty Split).
- Inspect instant real-time charts of Spot Price and Market Cap curves.
- View projected trading volume and creator fee yield throughout the curve lifecycle.
- Copy production-ready Meteora configuration JSON instantly to clipboard.

---

## 🔬 Mathematical Formulations

### 1. Exponential Curve
$$p(s) = p_0 \cdot \left(1 + \alpha \cdot \left(\frac{s}{S}\right)^n\right)$$
Where:
- $s$: Current tokens sold
- $S$: Total curve supply allocation
- $n$: Exponential steepness factor ($n \approx 2.8$)
- $\alpha$: Normalization factor derived to satisfy $\int_0^S p(s)ds = G$ ($G$ = Graduation Quote Target)

### 2. Sigmoid S-Curve for AI Agent Tokens
$$p(s) = p_0 + (p_{\text{max}} - p_0) \cdot \frac{\sigma(k(x - x_0)) - \sigma(-kx_0)}{\sigma(k(1 - x_0)) - \sigma(-kx_0)}$$
Where $\sigma(u) = \frac{1}{1 + e^{-u}}$, $x = s/S$, $k$ is the logistic steepness, and $x_0$ is the inflection midpoint.

### 3. Dampened Bounded RWA / Stock Curve
$$p(s) = p_0 \cdot \left(1 + (M_{\text{target}} - 1) \cdot \ln(1 + x \cdot (e - 1))\right)$$
Guarantees smooth logarithmic expansion bounded by $p_0 \cdot M_{\text{target}}$ at $s = S$.

---

## 🛠️ Architecture & Tech Stack

```text
meteora-dbc-toolkit/
├── src/
│   ├── types.ts                   # Core interfaces, QuoteToken constants, Migration params
│   ├── curves/
│   │   └── engine.ts              # Analytical & numerical curve calculation engine
│   ├── presets/
│   │   └── index.ts               # Battle-tested presets (Meme, AI Agent, RWA, Fair)
│   ├── exporter/
│   │   └── meteora_config.ts      # Schema transformer for Meteora DBC Program & Invent CLI
│   └── index.ts                   # Unified library entrypoint
├── tests/
│   └── curves.test.js             # 7 automated unit tests (monotonicity, integrals, schemas)
├── index.html                     # Responsive web visualizer with Chart.js
├── PITCH_DECK.md                  # Comprehensive project presentation
└── README.md                      # Developer documentation & quickstart
```

- **Runtime:** Node.js (ESM), TypeScript 5.6
- **Testing:** `node:test` + `node:assert/strict` (7/7 passed, 100% green)
- **Frontend:** Pure HTML5, Modern CSS Variables, Chart.js (Zero build step, deployed on GitHub Pages)
- **Solana Integration:** Standard SPL Mint definitions for SOL, USDC, and USDG

---

## 🚀 Impact Potential on the Meteora Ecosystem

1. **Expanding Asset Classes on Solana:** By offering out-of-the-box mathematical profiles for **Tokenized Stocks (xStocks)**, **RWAs**, and **Autonomous AI Agents**, this toolkit lowers the barrier for innovative launchpad creators to move beyond memes into trillion-dollar asset classes.
2. **Developer Acceleration:** Reduces days of bonding curve math modeling and trial-and-error simulation to a 30-second workflow.
3. **Pluggable SDK for Trading Terminals:** Trading bots, analytics dashboards, and terminals can embed this library to forecast graduation progress, price impact, and migration liquidity in real time.

---

## 🏆 Project Links & Deliverables

- **GitHub Repository:** [https://github.com/liutingqiu/meteora-dbc-toolkit](https://github.com/liutingqiu/meteora-dbc-toolkit)
- **Interactive Web App (GitHub Pages):** [https://liutingqiu.github.io/meteora-dbc-toolkit/](https://liutingqiu.github.io/meteora-dbc-toolkit/)
- **Superteam Earn Profile:** [https://superteam.fun/earn/t/liutingqiu-agent-quick-97](https://superteam.fun/earn/t/liutingqiu-agent-quick-97)
- **Lead Developer Contact:** Tingqiu Liu (`tianqi689@gmail.com`) / GitHub: `liutingqiu`

---
*Built with ❤️ for Meteora and the Solana Global Builder Community.*
