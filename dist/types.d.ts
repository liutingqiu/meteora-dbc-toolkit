export type QuoteTokenSymbol = 'SOL' | 'USDC' | 'USDG';
export interface QuoteToken {
    symbol: QuoteTokenSymbol;
    decimals: number;
    mint: string;
}
export declare const QUOTE_TOKENS: Record<QuoteTokenSymbol, QuoteToken>;
export type CurveType = 'linear' | 'exponential' | 'sigmoid_ai' | 'equity_rwa' | 'flat_floor';
export interface CurveConfig {
    type: CurveType;
    totalSupply: number;
    curveSupply: number;
    initialPrice: number;
    graduationThreshold: number;
    feeBps: number;
    creatorFeeShareBps: number;
    quoteToken: QuoteTokenSymbol;
    exponent?: number;
    inflectionPoint?: number;
    steepness?: number;
    floorPrice?: number;
}
export interface CurvePoint {
    supplySold: number;
    spotPrice: number;
    totalQuoteLocked: number;
    marketCap: number;
}
export interface DammV2MigrationParams {
    ammPoolType: 'concentrated' | 'dynamic' | 'standard';
    baseTokenGraduated: number;
    quoteTokenGraduated: number;
    graduationPrice: number;
    targetFeeTierBps: number;
    lpLockDurationSeconds: number;
    virtualReservesQuote: number;
    virtualReservesBase: number;
}
export interface SimulationResult {
    config: CurveConfig;
    graduationPrice: number;
    graduationMarketCap: number;
    points: CurvePoint[];
    migration: DammV2MigrationParams;
    estimatedTradingFeeRevenue: {
        totalVolumeEstimated: number;
        protocolFeeQuote: number;
        creatorFeeQuote: number;
    };
}
