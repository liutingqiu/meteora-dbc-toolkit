import { CurveConfig, SimulationResult } from '../types.js';
export declare class BondingCurveEngine {
    /**
     * Computes spot price at supply `s` (sold supply from 0 to curveSupply).
     */
    static getSpotPrice(config: CurveConfig, supplySold: number): number;
    /**
     * Simulates the full bonding curve trajectory into `stepCount` discrete slices.
     */
    static simulate(config: CurveConfig, stepCount?: number): SimulationResult;
}
