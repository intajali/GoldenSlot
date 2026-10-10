import { SpriteFrame } from "cc";
import { SymbolModel } from "../models/SymbolModel";
import { WeightedSymbol } from "../models/WeightedSymbol";

export interface ISymbolRepository {

    loadAll(): Promise<SymbolModel[]>;
    getSprite(id: string): SpriteFrame | null;
    getWeightedSymbols(): WeightedSymbol[];
    getJackpotSymbols(): SymbolModel[];
}

