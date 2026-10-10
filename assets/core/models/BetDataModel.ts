export class BetDataModel {
    betAmount: number;
    multiplier: number;
    total: number;
    isMinBet: boolean;
    isMaxBet: boolean;
    isMinMultiplier: boolean;
    isMaxMultiplier: boolean;
    paylines?: number;
    payPerLine?: number;

    constructor(bet: number, multiplier: number, isMinBet?: boolean, isMaxBet?: boolean, isMinMultiplier?: boolean, isMaxMultiplier?: boolean
        , paylines?: number, payPerLine?: number) {
        this.betAmount = bet;
        this.multiplier = multiplier;
        this.total = bet * multiplier;
        this.isMinBet = isMinBet;
        this.isMaxBet = isMaxBet;
        this.isMinMultiplier = isMinMultiplier;
        this.isMaxMultiplier = isMaxMultiplier;
        this.paylines = paylines;
        this.payPerLine = payPerLine;

    }
}