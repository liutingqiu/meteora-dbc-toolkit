// SPDX-License-Identifier: MIT

export type QuoteTokenSymbol = 'SOL' | 'USDC' | 'USDG';

export interface QuoteToken {
  symbol: QuoteTokenSymbol;
  decimals: number;
  mint: string;
}

export const QUOTE_TOKENS: Record<QuoteTokenSymbol, QuoteToken> = {
  SOL: {
    symbol: 'SOL',
    decimals: 9,
    mint: 'So11111111111111111111111111111111111111112'
  },
  USDC: {
    symbol: 'USDC',
    decimals: 6,
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
  },
  USDG: {
    symbol: 'USDG',
    decimals: 6,
    mint: 'USDGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
  }
};

export type CurveType = 'linear' | 'exponential' | 'sigmoid_ai' | 'equity_rwa' | 'flat_floor';

export interface CurveConfig {
  type: CurveType;
  totalSupply: number;          // e.g. 1,000,000,000 tokens
  curveSupply: number;          // supply available on curve (e.g. 800,000,000)
  initialPrice: number;         // quote units per base token
  graduationThreshold: number;  // total quote collected at graduation (e.g. 85 SOL or 12,000 USDC)
  feeBps: number;               // trading fee in bps (e.g. 100 bps = 1.0%)
  creatorFeeShareBps: number;   // creator fee split in bps (e.g. 5000 bps = 50%)
  quoteToken: QuoteTokenSymbol;
  // Specific curve parameters
  exponent?: number;            // for exponential curve
  inflectionPoint?: number;     // for sigmoid curve (fraction of curve supply, e.g. 0.5)
  steepness?: number;           // for sigmoid curve
  floorPrice?: number;          // for flat floor
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
  lpLockDurationSeconds: number; // e.g. 0 = permanent lock / burn
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
