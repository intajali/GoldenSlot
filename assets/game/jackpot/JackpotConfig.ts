import { JackpotSymbol } from "./JackpotSymbol";

export class JackpotConfig {
    symbol: JackpotSymbol;
    weight: number;     // chance to appear
    payout: number;     // or multiplier
}

export const JACKPOT_CONFIG: JackpotConfig[] = [
    { symbol: JackpotSymbol.MINI, weight: 60, payout: 100 },
    { symbol: JackpotSymbol.MINOR, weight: 25, payout: 200 },
    { symbol: JackpotSymbol.MAJOR, weight: 10, payout: 500 },
    { symbol: JackpotSymbol.GRAND, weight: 5, payout: 1000 }
];

export class JackpotResultModel {
    jackpotCount: number;
    triggered: boolean;
    winAmount: number;
    positions: { reel: number; row: number }[];
}   
