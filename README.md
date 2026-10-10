# Meteora Dynamic Bonding Curve (DBC) Toolkit 🚀

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/Tests-7%2F7%20Passed-brightgreen)](tests/curves.test.js)
[![Meteora DBC](https://img.shields.io/badge/Meteora-DBC%20%26%20DAMM%20v2-red)](https://docs.meteora.ag/developer-guides/dbc)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success)](https://liutingqiu.github.io/meteora-dbc-toolkit/)

**Developer Tooling, Mathematical Presets, and DAMM v2 Migration Simulator for Meteora Dynamic Bonding Curves on Solana.**

Built for the **Crypto World's Fair — Best Use of Meteora's Dynamic Bonding Curve (DBC) Hackathon Track ($20,000 USDC Prize Pool)**.

---

## 🌟 Overview

Meteora's **Dynamic Bonding Curve (DBC)** gives builders complete freedom to design token launch mechanics. Unlike legacy bonding curves, you control:
- The **curve shape** (linear, exponential, sigmoid, dampened RWA corridor, flat floor).
- The **quote asset** (SOL, USDC, USDG).
- The **fee schedule & creator royalty splits**.
- The **graduation migration** into Meteora DAMM v2 or DLMM liquidity.

This toolkit provides a production-ready mathematical engine, pre-configured asset class presets, automated DAMM v2 migration calculations, an interactive web visualizer, and an export pipeline for the Meteora Invent CLI.

---

## 🌐 Live Interactive Playground

Experience the simulator directly in your browser with real-time Chart.js visualizer:  
👉 **[https://liutingqiu.github.io/meteora-dbc-toolkit/](https://liutingqiu.github.io/meteora-dbc-toolkit/)**

---

## 📐 Mathematical Curve Presets

| Preset | Curve Type | Target Asset Class | Key Advantage |
| :--- | :--- | :--- | :--- |
| **`meme-viral-sol`** | Exponential ($n=2.8$) | Viral & High-Velocity Memes | Rewards conviction; curbs sniper dominance with steep acceleration. |
| **`ai-agent-usdc`** | Sigmoid S-Curve | Autonomous AI Agents & DAOs | Flat initial evaluation phase; smooth saturation into DAMM v2. |
| **`tokenized-equity-rwa`** | Dampened Logarithmic | Tokenized Stocks (xStocks), RWAs | Bounded $+/- 20-35\%$ corridor; anchors to underlying NAV stability. |
| **`fair-launch-linear`** | Linear ($k = \text{const}$) | Community Fair Launches | Predictable linear slope with zero surprises for retail buyers. |
| **`flat_floor`** | Protected Floor + Step | Anti-Sandwich Protection | First 25% sold at flat initial floor to prevent frontrun dumping. |

---

## 📦 Installation & Quick Start

```bash
git clone https://github.com/liutingqiu/meteora-dbc-toolkit.git
cd meteora-dbc-toolkit
npm install
npm test
```

### Programmatic Usage (TypeScript / ESM)

```typescript
import { BondingCurveEngine, PRESETS, MeteoraConfigExporter } from 'meteora-dbc-toolkit';

// 1. Load an asset class preset (e.g. AI Agent Token)
const config = PRESETS['ai-agent-usdc'];

// 2. Run numerical simulation across 100 discrete supply intervals
const simulation = BondingCurveEngine.simulate(config, 100);

console.log(`Graduation Price: ${simulation.graduationPrice} ${config.quoteToken}`);
console.log(`Graduation Market Cap: $${simulation.graduationMarketCap.toLocaleString()}`);
console.log(`Quote Currency Raised for LP: ${simulation.migration.quoteTokenGraduated}`);

// 3. Export exact configuration JSON for Meteora Invent CLI / On-chain program
const meteoraJson = MeteoraConfigExporter.toMeteoraDBCJson(simulation);
console.log(JSON.stringify(meteoraJson, null, 2));
```

---

## 🚀 Meteora DAMM v2 Migration Calculation

When the bonding curve reaches its graduation threshold:
1. **Unsold / Reserved Supply:** Automatically paired with 100% of the accumulated quote tokens.
2. **Virtual Reserves:** Computed with precision (`virtualReservesQuote` and `virtualReservesBase`) to ensure zero price discontinuity at the instant of migration.
3. **LP Liquidity Lock:** Configured by default to **PermanentBurn** (provably 100% rug-proof liquidity).
4. **Target AMM Selection:**
   - Volatile / Meme / AI tokens migrate to **Meteora DAMM v2** with dynamic fee tiers.
   - Tokenized Stocks / RWAs migrate to **Meteora DLMM** (Concentrated Liquidity) to maximize capital efficiency around the NAV price corridor.

---

## 🧪 Testing

The test suite covers monotonicity, integral accuracy, exponential steepness, RWA volatility boundaries, and JSON schema compliance:

```bash
node --test tests/curves.test.js
```

Output:
```text
✔ 1. Linear curve monotonicity and threshold completion (1.8ms)
✔ 2. Exponential curve steepness and acceleration (0.3ms)
✔ 3. Sigmoid S-Curve for AI Agent launches (0.3ms)
✔ 4. Equity & RWA Dampened Curve bounds volatility corridor (0.2ms)
✔ 5. Flat floor curve protects initial 25% entry price (0.1ms)
✔ 6. Meteora DAMM v2 Migration parameters (0.1ms)
✔ 7. Meteora DBC JSON Exporter complies with program schema (1.0ms)

ℹ pass 7
ℹ fail 0
```

---

## 📖 Hackathon Documentation

Read the full project pitch deck, architectural rationale, and market impact analysis:  
👉 **[PITCH_DECK.md](PITCH_DECK.md)**

---

## 📄 License

Released under the [MIT License](LICENSE).
