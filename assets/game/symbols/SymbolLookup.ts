import { SymbolModel } from "../../game/symbols/models/SymbolModel";


export class SymbolLookup {

    private static map = new Map<string, SymbolModel>();

    static register(symbol: SymbolModel) {
        this.map.set(symbol.symbolId, symbol);
    }

    static get(id: string): SymbolModel {
        const symbol = this.map.get(id);
        if (!symbol) {
            throw new Error(`Symbol not found for id: ${id}`);
        }
        return symbol;
    }
}
