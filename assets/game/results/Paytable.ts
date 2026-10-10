import { _decorator, Component, Node } from 'cc';
import { IPaytable } from '../interface/IPaytable';
import { IPaytableTier } from '../interface/IPaytableTier';
import { MatchCount, SymbolId } from '../../core/models/MatchPayout';
import { PaytableTierEnum } from '../../core/models/PaytableTierEnum';

const { ccclass, property } = _decorator;

@ccclass('Paytable')
export class Paytable implements IPaytable {
    constructor(
        private readonly tiers: Map<PaytableTierEnum, IPaytableTier>
    ) { }

    getPayout(symbolId: SymbolId, count: MatchCount): number {
        for (const tier of this.tiers.values()) {
            if (tier.hasSymbol(symbolId)) {
                return tier.getPayout(symbolId, count);
            }
        }
        return 0;
    }

    getTier(tier: PaytableTierEnum): IPaytableTier | undefined {
        return this.tiers.get(tier);
    }

    getDataByTierType(tierType: PaytableTierEnum): IPaytableTier | undefined {
        return this.tiers.get(tierType);
    }
}

