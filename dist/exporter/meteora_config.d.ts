import { SimulationResult } from '../types.js';
export interface MeteoraDBCProgramConfig {
    version: string;
    tokenMint: {
        decimals: number;
        totalSupply: string;
    };
    bondingCurve: {
        curveType: string;
        quoteMint: string;
        quoteDecimals: number;
        initialPriceNumerator: string;
        initialPriceDenominator: string;
        graduationThresholdQuote: string;
        curveSupply: string;
        tradeFeeBps: number;
        creatorFeeShareBps: number;
    };
    dammV2Migration: {
        ammType: string;
        feeTierBps: number;
        baseAmountGraduated: string;
        quoteAmountGraduated: string;
        lpLockType: 'PermanentBurn' | 'Timelock';
        virtualReserveQuote: string;
        virtualReserveBase: string;
    };
}
export declare class MeteoraConfigExporter {
    static toMeteoraDBCJson(sim: SimulationResult): MeteoraDBCProgramConfig;
}
