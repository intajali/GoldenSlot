// 
// ReelStripGenerator.ts
// Utility to generate reel strips based on weighted symbols
// Used for creating dynamic reel configurations
// ------------------------------------------------------------------   

import { SymbolModel } from "db://assets/game/symbols/models/SymbolModel";
import { WeightedSymbol } from "db://assets/game/symbols/models/WeightedSymbol";

export class ReelStripGenerator {
    private symbols: WeightedSymbol[];
    private totalWeight: number;

    constructor(weightedSymbols: WeightedSymbol[]) {
        this.symbols = weightedSymbols;
        this.totalWeight = this.symbols.reduce((sum, w) => sum + w.weight, 0);
    }

    private getRandomSymbol(): SymbolModel {
        const rand = Math.random() * this.totalWeight;
        let sum = 0;
        for (const ws of this.symbols) {
            sum += ws.weight;
            if (rand <= sum) return ws.symbol;
        }
        return this.symbols[this.symbols.length - 1].symbol; // fallback
    }

    public generateReel(length: number = 35): SymbolModel[] {
        const reel: SymbolModel[] = [];
        while (reel.length < length) {
            reel.push(this.getRandomSymbol());
        }
        return reel;
    }

    public generateReels(reelCount: number = 5, reelLength: number = 35): SymbolModel[][] {
        const reels: SymbolModel[][] = [];
        for (let i = 0; i < reelCount; i++) {
            reels.push(this.generateReel(reelLength));
        }
        return reels;
    }
}



