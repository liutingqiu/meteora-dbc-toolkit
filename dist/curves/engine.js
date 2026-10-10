export class BondingCurveEngine {
    /**
     * Computes spot price at supply `s` (sold supply from 0 to curveSupply).
     */
    static getSpotPrice(config, supplySold) {
        const S = config.curveSupply;
        const p0 = config.initialPrice;
        const progress = Math.min(1, Math.max(0, supplySold / S));
        switch (config.type) {
            case 'linear': {
                // Linear slope: p(s) = p0 + k * s
                // Integral from 0 to S must equal graduationThreshold (G)
                // G = p0 * S + 0.5 * k * S^2 => k = 2 * (G - p0 * S) / S^2
                const G = config.graduationThreshold;
                const k = (2 * (G - p0 * S)) / (S * S);
                return Math.max(p0, p0 + k * supplySold);
            }
            case 'exponential': {
                // p(s) = p0 * (1 + alpha * (s/S)^n)
                // With n typically 2.0 or 3.0
                const n = config.exponent ?? 2.5;
                // Integral approx: p0 * S + p0 * alpha * S / (n + 1) = G
                // alpha = (G / (p0 * S) - 1) * (n + 1)
                const alpha = Math.max(0, (config.graduationThreshold / (p0 * S) - 1) * (n + 1));
                return p0 * (1 + alpha * Math.pow(progress, n));
            }
            case 'sigmoid_ai': {
                // Sigmoid S-curve: fair initial accumulation, rapid discovery, saturation before DAMM v2
                // f(x) = 1 / (1 + exp(-k * (x - x0)))
                const k = config.steepness ?? 8.0;
                const x0 = config.inflectionPoint ?? 0.5;
                const sig = 1 / (1 + Math.exp(-k * (progress - x0)));
                const sig0 = 1 / (1 + Math.exp(-k * (0 - x0)));
                const sig1 = 1 / (1 + Math.exp(-k * (1 - x0)));
                const normSig = (sig - sig0) / (sig1 - sig0); // 0 at progress=0, 1 at progress=1
                // Target graduation price derived from threshold
                const avgPrice = config.graduationThreshold / S;
                const maxPrice = avgPrice * 2.2;
                return p0 + (maxPrice - p0) * normSig;
            }
            case 'equity_rwa': {
                // Dampened RWA / Tokenized Stock Curve:
                // Designed for assets with underlying valuation anchors (e.g. AAPL, Treasuries).
                // Volatility is bounded within tight corridors (+/- 15-30% range).
                const targetGrowth = 1.35; // 35% corridor
                // Smooth logarithmic dampening
                const dampFactor = Math.log(1 + progress * (Math.E - 1)); // 0 to 1
                return p0 * (1 + (targetGrowth - 1) * dampFactor);
            }
            case 'flat_floor': {
                // Protected floor: flat for first 25%, then linear step up to graduation
                const floorFrac = 0.25;
                if (progress <= floorFrac) {
                    return p0;
                }
                const postProgress = (progress - floorFrac) / (1 - floorFrac);
                const k = (2 * (config.graduationThreshold - p0 * S)) / (S * S * (1 - floorFrac));
                return p0 + k * (supplySold - S * floorFrac);
            }
            default:
                return p0;
        }
    }
    /**
     * Simulates the full bonding curve trajectory into `stepCount` discrete slices.
     */
    static simulate(config, stepCount = 50) {
        const points = [];
        const step = config.curveSupply / stepCount;
        let quoteAccumulator = 0;
        let prevPrice = config.initialPrice;
        for (let i = 0; i <= stepCount; i++) {
            const supply = Math.min(config.curveSupply, i * step);
            const spotPrice = this.getSpotPrice(config, supply);
            if (i > 0) {
                // Trapezoidal integration for accurate quote token accumulation
                const dSupply = supply - points[i - 1].supplySold;
                const dQuote = 0.5 * (prevPrice + spotPrice) * dSupply;
                quoteAccumulator += dQuote;
            }
            const marketCap = spotPrice * config.totalSupply;
            points.push({
                supplySold: supply,
                spotPrice,
                totalQuoteLocked: quoteAccumulator,
                marketCap
            });
            prevPrice = spotPrice;
        }
        const finalPoint = points[points.length - 1];
        const graduationPrice = finalPoint.spotPrice;
        const graduationMarketCap = finalPoint.marketCap;
        // DAMM v2 Migration calculation
        // Remaining supply (totalSupply - curveSupply) is minted to LP along with accumulated quote
        const lpBaseTokens = config.totalSupply - config.curveSupply;
        const lpQuoteTokens = quoteAccumulator;
        const migration = {
            ammPoolType: config.type === 'equity_rwa' ? 'concentrated' : 'dynamic',
            baseTokenGraduated: lpBaseTokens,
            quoteTokenGraduated: lpQuoteTokens,
            graduationPrice,
            targetFeeTierBps: config.type === 'equity_rwa' ? 25 : config.feeBps, // 0.25% for RWA, else custom
            lpLockDurationSeconds: 0, // Permanent lock / burn
            virtualReservesQuote: lpQuoteTokens * 1.5,
            virtualReservesBase: lpBaseTokens * 1.5
        };
        // Estimated Trading Volume (typically 2.8x - 4.5x of quote raised)
        const estimatedVolume = quoteAccumulator * 3.2;
        const totalFees = (estimatedVolume * config.feeBps) / 10_000;
        const creatorFees = (totalFees * config.creatorFeeShareBps) / 10_000;
        const protocolFees = totalFees - creatorFees;
        return {
            config,
            graduationPrice,
            graduationMarketCap,
            points,
            migration,
            estimatedTradingFeeRevenue: {
                totalVolumeEstimated: estimatedVolume,
                protocolFeeQuote: protocolFees,
                creatorFeeQuote: creatorFees
            }
        };
    }
}
