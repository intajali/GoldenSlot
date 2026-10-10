import { SymbolModel } from "./SymbolModel";


export class WeightedSymbol {
    constructor(
        public symbol: SymbolModel,
        public weight: number,
        public isHighPay: boolean
    ) { }

    toString(): string {
        return `WeightedSymbol(${this.symbol.toString()}, weight=${this.weight}, highPay=${this.isHighPay})`;
    }
}