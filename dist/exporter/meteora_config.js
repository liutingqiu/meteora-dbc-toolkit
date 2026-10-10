// SPDX-License-Identifier: MIT
import { QUOTE_TOKENS } from '../types.js';
export class MeteoraConfigExporter {
    static toMeteoraDBCJson(sim) {
        const { config, migration } = sim;
        const quote = QUOTE_TOKENS[config.quoteToken];
        const baseDecimals = 9; // standard SPL token decimals
        return {
            version: '1.0.0',
            tokenMint: {
                decimals: baseDecimals,
                totalSupply: BigInt(Math.floor(config.totalSupply * 10 ** baseDecimals)).toString()
            },
            bondingCurve: {
                curveType: config.type,
                quoteMint: quote.mint,
                quoteDecimals: quote.decimals,
                initialPriceNumerator: BigInt(Math.floor(config.initialPrice * 10 ** 12)).toString(),
                initialPriceDenominator: (10n ** 12n).toString(),
                graduationThresholdQuote: BigInt(Math.floor(config.graduationThreshold * 10 ** quote.decimals)).toString(),
                curveSupply: BigInt(Math.floor(config.curveSupply * 10 ** baseDecimals)).toString(),
                tradeFeeBps: config.feeBps,
                creatorFeeShareBps: config.creatorFeeShareBps
            },
            dammV2Migration: {
                ammType: migration.ammPoolType === 'concentrated' ? 'MeteoraDLMM' : 'MeteoraDAMMv2',
                feeTierBps: migration.targetFeeTierBps,
                baseAmountGraduated: BigInt(Math.floor(migration.baseTokenGraduated * 10 ** baseDecimals)).toString(),
                quoteAmountGraduated: BigInt(Math.floor(migration.quoteTokenGraduated * 10 ** quote.decimals)).toString(),
                lpLockType: 'PermanentBurn',
                virtualReserveQuote: BigInt(Math.floor(migration.virtualReservesQuote * 10 ** quote.decimals)).toString(),
                virtualReserveBase: BigInt(Math.floor(migration.virtualReservesBase * 10 ** baseDecimals)).toString()
            }
        };
    }
}
