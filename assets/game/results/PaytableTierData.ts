
import { MatchCount, MatchPayout, SymbolId } from "../../core/models/MatchPayout";
import { IPaytableTier } from "../interface/IPaytableTier";

export class PaytableTierData implements IPaytableTier {

    constructor(
        private readonly symbols: Record<SymbolId, MatchPayout>
    ) { }

    hasSymbol(symbolId: SymbolId): boolean {
        return symbolId in this.symbols;
    }

    getPayout(symbolId: SymbolId, count: MatchCount): number {
        return this.symbols[symbolId]?.[count] ?? 0;
    }

    getSymbols(): SymbolId[] {
        return Object.keys(this.symbols);
    }

    getMatchPayout(symbolId: SymbolId): MatchPayout | undefined {
        return this.symbols[symbolId];
    }

    getMaxPayout(symbolId: SymbolId): number {
        const payouts = this.symbols[symbolId];
        return Math.max(
            payouts[1],
            payouts[2],
            payouts[3],
            payouts[4],
            payouts[5]
        );
    }
}
