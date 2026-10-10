import { SymbolModel } from "../models/SymbolModel";
import { WeightedSymbol } from "../models/WeightedSymbol";

export interface ISymbolWeightStrategy {
    resolve(symbol: SymbolModel): WeightedSymbol;
}
