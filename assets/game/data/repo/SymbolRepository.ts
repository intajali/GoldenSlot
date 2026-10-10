import { SpriteFrame } from "cc";

import { ISymbolRepository } from "../../symbols/interface/ISymbolRepository";
import { SymbolModel } from "../../symbols/models/SymbolModel";
import { WeightedSymbol } from "../../symbols/models/WeightedSymbol";
import { ISymbolWeightStrategy } from "../../symbols/interface/ISymbolWeightStrategy";
import { GameUtils } from "db://assets/core/utils/GameUtils";
import { SymbolLookup } from "../../symbols/SymbolLookup";

export class SymbolRepository implements ISymbolRepository {

    private symbols: SymbolModel[] = [];
    private weighted: WeightedSymbol[] = [];
    private jackpotSymbols: SymbolModel[] = [];

    constructor(
        private weightStrategy: ISymbolWeightStrategy
    ) { }

    async loadAll(): Promise<SymbolModel[]> {
        const groups = await Promise.all([
            GameUtils.loadAllResource<SpriteFrame>('symbols/low', SpriteFrame),
            GameUtils.loadAllResource<SpriteFrame>('symbols/high', SpriteFrame),
            GameUtils.loadAllResource<SpriteFrame>('symbols/bonus', SpriteFrame),
            GameUtils.loadAllResource<SpriteFrame>('symbols/scat', SpriteFrame),
            GameUtils.loadAllResource<SpriteFrame>('symbols/wild', SpriteFrame),
            GameUtils.loadAllResource<SpriteFrame>('symbols/jackpot', SpriteFrame)
        ]);
        this.symbols = [];
        for (const group of groups) {
            for (const frame of group) {
                const s = new SymbolModel(frame.name, frame);
                SymbolLookup.register(s);
                this.symbols.push(s);
            }
        }
        this.jackpotSymbols = [];
        const jackpotFrames = await GameUtils.loadAllResource<SpriteFrame>('sprites/reels/jackpots', SpriteFrame);
        this.jackpotSymbols = jackpotFrames.map(f => new SymbolModel(f.name, f));
        this.jackpotSymbols.forEach(s => SymbolLookup.register(s));

        this.weighted = this.symbols.map(s =>
            this.weightStrategy.resolve(s)
        );
        console.log('Loaded symbols::', this.symbols.length);
        console.log('Weighted symbols::', this.weighted.length);
        console.log('Jackpot symbols::', this.jackpotSymbols.length);
        // console.table(this.jackpotSymbols.map(s => ({
        //     symbolId: s.symbolId,
        //     sprite: s.symbolSprite?.name ?? 'null'
        // })));
        return this.symbols;
    }

    getSprite(id: string) {
        return this.symbols.find(s => s.symbolId === id)?.symbolSprite ?? null;
    }

    getWeightedSymbols() {
        return this.weighted;
    }

    getJackpotSymbols() {
        return this.jackpotSymbols;
    }
}
