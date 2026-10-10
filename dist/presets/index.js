export const PRESETS = {
    // 1. Meme / High-Velocity Viral Launch (SOL-paired)
    'meme-viral-sol': {
        type: 'exponential',
        totalSupply: 1_000_000_000,
        curveSupply: 800_000_000,
        initialPrice: 0.00000002, // in SOL
        graduationThreshold: 85, // 85 SOL raised
        feeBps: 100, // 1.0% fee
        creatorFeeShareBps: 5000, // 50% creator split
        quoteToken: 'SOL',
        exponent: 2.8
    },
    // 2. AI Agent Autonomous Economy Token (USDC-paired)
    'ai-agent-usdc': {
        type: 'sigmoid_ai',
        totalSupply: 100_000_000,
        curveSupply: 75_000_000,
        initialPrice: 0.0005, // $0.0005
        graduationThreshold: 25_000, // $25k USDC raised
        feeBps: 75, // 0.75% fee
        creatorFeeShareBps: 6000, // 60% agent treasury split
        quoteToken: 'USDC',
        steepness: 7.5,
        inflectionPoint: 0.45
    },
    // 3. Tokenized Equities & RWAs (USDC-paired)
    'tokenized-equity-rwa': {
        type: 'equity_rwa',
        totalSupply: 10_000_000,
        curveSupply: 6_000_000,
        initialPrice: 10.0, // $10.00 NAV baseline
        graduationThreshold: 65_000_000, // institutional graduation
        feeBps: 20, // 0.20% institutional fee
        creatorFeeShareBps: 2500, // 25% protocol fee
        quoteToken: 'USDC'
    },
    // 4. Classic Community Fair Launch (SOL-paired)
    'fair-launch-linear': {
        type: 'linear',
        totalSupply: 1_000_000_000,
        curveSupply: 700_000_000,
        initialPrice: 0.00000001,
        graduationThreshold: 60,
        feeBps: 50, // 0.5% fee
        creatorFeeShareBps: 4000,
        quoteToken: 'SOL'
    }
};
