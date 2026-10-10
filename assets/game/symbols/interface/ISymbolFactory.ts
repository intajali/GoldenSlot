import { SymbolModel } from "../models/SymbolModel";


export interface ISymbolFactory {
    create(symbolId: string): SymbolModel;
}
