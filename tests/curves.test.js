// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { BondingCurveEngine, PRESETS, MeteoraConfigExporter } from '../dist/index.js';

test('1. Linear curve monotonicity and threshold completion', () => {
  const config = PRESETS['fair-launch-linear'];
  const sim = BondingCurveEngine.simulate(config, 50);

  assert.equal(sim.points.length, 51);
  assert.equal(sim.points[0].supplySold, 0);
  assert.equal(sim.points[0].spotPrice, config.initialPrice);

  // Monotonicity check
  for (let i = 1; i < sim.points.length; i++) {
    assert.ok(sim.points[i].spotPrice >= sim.points[i - 1].spotPrice, `Step ${i} price must be >= previous`);
    assert.ok(sim.points[i].totalQuoteLocked >= sim.points[i - 1].totalQuoteLocked, `Step ${i} quote must be >= previous`);
  }

  // Final point checks
  const last = sim.points[sim.points.length - 1];
  assert.ok(last.spotPrice > config.initialPrice, 'Terminal price must exceed initial price');
  assert.ok(last.totalQuoteLocked > 0, 'Quote locked must be positive');
  assert.ok(sim.graduationMarketCap > 0, 'Market cap must be positive');
});

test('2. Exponential curve steepness and acceleration', () => {
  const config = PRESETS['meme-viral-sol'];
  const sim = BondingCurveEngine.simulate(config, 100);

  const p0 = sim.points[0].spotPrice;
  const pMid = sim.points[50].spotPrice;
  const pFinal = sim.points[100].spotPrice;

  // Exponential growth: second half growth > first half growth
  const delta1 = pMid - p0;
  const delta2 = pFinal - pMid;
  assert.ok(delta2 > delta1, 'Second half growth must exceed first half in exponential curve');
  assert.equal(sim.config.quoteToken, 'SOL');
});

test('3. Sigmoid S-Curve for AI Agent launches', () => {
  const config = PRESETS['ai-agent-usdc'];
  const sim = BondingCurveEngine.simulate(config, 100);

  assert.equal(sim.config.type, 'sigmoid_ai');
  assert.equal(sim.config.quoteToken, 'USDC');
  assert.ok(sim.graduationPrice > sim.points[0].spotPrice);
  assert.ok(sim.migration.baseTokenGraduated > 0);
  assert.ok(sim.migration.quoteTokenGraduated > 0);
});

test('4. Equity & RWA Dampened Curve bounds volatility corridor', () => {
  const config = PRESETS['tokenized-equity-rwa'];
  const sim = BondingCurveEngine.simulate(config, 100);

  const initial = sim.points[0].spotPrice;
  const final = sim.points[100].spotPrice;
  const growthMultiple = final / initial;

  // Bounded corridor: between 1.1x and 1.6x for NAV stabilization
  assert.ok(growthMultiple >= 1.15 && growthMultiple <= 1.5, `RWA growth multiple ${growthMultiple} should be within 1.15x - 1.5x corridor`);
  assert.equal(sim.migration.ammPoolType, 'concentrated');
});

test('5. Flat floor curve protects initial 25% entry price', () => {
  const flatConfig = {
    type: 'flat_floor',
    totalSupply: 1_000_000_000,
    curveSupply: 800_000_000,
    initialPrice: 0.000001,
    graduationThreshold: 10_000,
    feeBps: 100,
    creatorFeeShareBps: 5000,
    quoteToken: 'USDC'
  };

  const sim = BondingCurveEngine.simulate(flatConfig, 100);
  // Point at 20% should equal initialPrice exactly
  assert.equal(sim.points[20].spotPrice, flatConfig.initialPrice);
  // Point at 80% should be higher than floor
  assert.ok(sim.points[80].spotPrice > flatConfig.initialPrice);
});

test('6. Meteora DAMM v2 Migration parameters', () => {
  const config = PRESETS['meme-viral-sol'];
  const sim = BondingCurveEngine.simulate(config, 50);

  const m = sim.migration;
  assert.equal(m.ammPoolType, 'dynamic');
  assert.equal(m.targetFeeTierBps, config.feeBps);
  assert.equal(m.lpLockDurationSeconds, 0); // burned LP
  assert.ok(m.virtualReservesQuote > 0);
  assert.ok(m.virtualReservesBase > 0);
  assert.equal(m.baseTokenGraduated, config.totalSupply - config.curveSupply);
});

test('7. Meteora DBC JSON Exporter complies with program schema', () => {
  const config = PRESETS['ai-agent-usdc'];
  const sim = BondingCurveEngine.simulate(config, 50);
  const jsonConfig = MeteoraConfigExporter.toMeteoraDBCJson(sim);

  assert.equal(jsonConfig.version, '1.0.0');
  assert.equal(jsonConfig.tokenMint.decimals, 9);
  assert.equal(jsonConfig.bondingCurve.curveType, 'sigmoid_ai');
  assert.equal(jsonConfig.bondingCurve.quoteDecimals, 6);
  assert.ok(typeof jsonConfig.tokenMint.totalSupply === 'string');
  assert.ok(typeof jsonConfig.bondingCurve.graduationThresholdQuote === 'string');
  assert.ok(typeof jsonConfig.dammV2Migration.virtualReserveQuote === 'string');
  assert.equal(jsonConfig.dammV2Migration.lpLockType, 'PermanentBurn');
});
