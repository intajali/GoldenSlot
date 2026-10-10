// GameDataContainer.ts
// Container for game data such as reel strips, symbols, paytable, etc.
// Loads data from JSON configuration files and provides access methods.
// ------------------------------------------------------------------


import { _decorator, SpriteFrame } from 'cc';
const { property } = _decorator;

import { SymbolModel } from 'db://assets/game/symbols/models/SymbolModel';
import { WeightedSymbol } from 'db://assets/game/symbols/models/WeightedSymbol';

import { DefaultSymbolWeightStrategy } from 'db://assets/game/symbols/DefaultSymbolWeightStrategy';
import { SymbolRepository } from 'db://assets/game/data/repo/SymbolRepository';
import { ConfigRepository } from 'db://assets/game/data/repo/ConfigRepository';
import { ReelStripService } from 'db://assets/game/reels/services/ReelStripService';
import { PaytableAdapter } from 'db://assets/core/utils/PaytableAdapter';
import { Payline } from 'db://assets/game/results/Payline';
import { IGameDataProvider } from '../../core/interfaces/IGameDataProvider';
import { IPaytable } from '../interface/IPaytable';
import { IPaylineProvider } from '../../core/interfaces/IPaylineProvider';
import { IReelStripService } from '../../core/interfaces/reel/IReelStripService';
import { IGameConfig } from '../../core/interfaces/config/IGameConfig';
import { PaytableTierEnum } from '../../core/models/PaytableTierEnum';
import { JACKPOT_CONFIG, JackpotConfig } from '../jackpot/JackpotConfig';
import { JackpotSymbol } from '../jackpot/JackpotSymbol';


export class GameDataContainer implements IGameDataProvider {

    public symbolList: SymbolModel[] = [];

    weightedSymbolList: WeightedSymbol[] = [];

    private configRepo!: ConfigRepository;
    private symbolRepo!: SymbolRepository;
    private reelService!: IReelStripService;

    private paytable!: IPaytable;
    private paylines!: IPaylineProvider;

    async initialize(onReady?: (ok: boolean) => void) {
        try {
            this.configRepo = new ConfigRepository();
            await this.configRepo.load();

            this.symbolRepo = new SymbolRepository(
                new DefaultSymbolWeightStrategy()
            );

            this.symbolList = await this.symbolRepo.loadAll();
            //console.log("Symbol List");
            // console.table(
            //     this.symbolList.map(s => ({
            //         symbolId: s.symbolId,
            //         sprite: s.symbolSprite?.name ?? 'null'
            //     }))
            // );

            this.reelService = new ReelStripService(
                this.configRepo,
                this.symbolRepo.getWeightedSymbols(),
                true
            );

            this.weightedSymbolList = this.symbolRepo.getWeightedSymbols();
            //console.log("Weighted List");
            // console.table(
            //     this.weightedSymbolList.map(ws => ({
            //         symbolId: ws.symbol.symbolId,
            //         weight: ws.weight,
            //         isHighPay: ws.isHighPay,
            //         sprite: ws.symbol.symbolSprite?.name ?? 'null'
            //     }))
            // );
            //this.resultService = new ResultService();

            this.paytable = PaytableAdapter.fromJson(
                this.configRepo.getPaytable()
            );

            this.paylines = new Payline(
                this.configRepo.getPaylines(),
                5,
                3
            );

            const symbols = this.paytable.getTier(PaytableTierEnum.JACKPOT)?.getSymbols() ?? [];
            JACKPOT_CONFIG.length = 0; // Clear existing configs
            for (const symbol of symbols) {
                const payout = this.paytable.getPayout(symbol, 1);
                const jpSymbol = JackpotSymbol[symbol as keyof typeof JackpotSymbol];
                JACKPOT_CONFIG.push({
                    symbol: jpSymbol,
                    payout: payout,
                    weight: this.getJackpotSymbolWeight(jpSymbol)
                });
            }

            //console.log("Jackpot Configs:", JACKPOT_CONFIG);

            onReady?.(true);
        } catch (e) {
            console.error('Game init failed', e);
            onReady?.(false);
        }
    }

    getJackpotSymbolWeight(symbol: JackpotSymbol): number {
        switch (symbol) {
            case JackpotSymbol.MINI:
                return 50;
            case JackpotSymbol.MINOR:
                return 25;
            case JackpotSymbol.MAJOR:
                return 20;
            case JackpotSymbol.GRAND:
                return 5;
            default:
                return 0;
        }
    }

    // ------------------
    // Config
    // ------------------


    getGameConfig(): IGameConfig {
        return this.configRepo.getGameConfig();
    }

    getbetConfig() {
        return this.configRepo.getBetConfig();
    }

    // ------------------
    // Core Data
    // ------------------


    getReelStripService(): IReelStripService {
        return this.reelService;
    }

    getReelData() {
        return this.configRepo.getReelData();
    }

    getPaytable(): IPaytable {

        return this.paytable;
    }

    getPaylines(): IPaylineProvider {
        return this.paylines;
    }

    getSymbolSprite(id: string): SpriteFrame | null {
        return this.symbolRepo.getSprite(id);
    }

    getJackpotSymbols(): SymbolModel[] {
        return this.symbolRepo.getJackpotSymbols();
    }

    public getSymbolFromWeightedList(symbolId: string): SpriteFrame {
        const weightedSymbol = this.weightedSymbolList.find(s => s.symbol.symbolId.indexOf(symbolId) !== -1);
        if (weightedSymbol) {

            return weightedSymbol.symbol.symbolSprite as SpriteFrame;
        }

        return null;
    }
}


