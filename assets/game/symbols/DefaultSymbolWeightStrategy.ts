import { ISymbolWeightStrategy } from "./interface/ISymbolWeightStrategy";
import { SymbolModel } from "./models/SymbolModel";
import { WeightedSymbol } from "./models/WeightedSymbol";

export class DefaultSymbolWeightStrategy implements ISymbolWeightStrategy {

    resolve(symbol: SymbolModel): WeightedSymbol {

        const id = symbol.symbolId;

        if (id.startsWith('N')) return { symbol, weight: 20, isHighPay: false };
        if (id.startsWith('L')) return { symbol, weight: 10, isHighPay: false };
        if (id.startsWith('H')) return { symbol, weight: 5, isHighPay: true };

        return { symbol, weight: 1, isHighPay: true };
    }
}
