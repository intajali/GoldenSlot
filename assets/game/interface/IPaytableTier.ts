import { MatchCount, MatchPayout, SymbolId } from "../../core/models/MatchPayout";


export interface IPaytableTier {
    hasSymbol(symbolId: SymbolId): boolean;
    getPayout(symbolId: SymbolId, count: MatchCount): number;
    getSymbols(): SymbolId[];
    getMaxPayout(symbolId: SymbolId): number;
    getMatchPayout(symbolId: SymbolId): MatchPayout;
}
