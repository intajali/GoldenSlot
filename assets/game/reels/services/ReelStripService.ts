import { ReelStripGenerator } from "db://assets/core/utils/ReelStripGenerator";
import { WeightedSymbol } from "../../symbols/models/WeightedSymbol";
import { SymbolId } from "db://assets/core/models/MatchPayout";
import { IGameConfig } from "db://assets/core/interfaces/config/IGameConfig";
import { ReelData, ReelStrip } from "db://assets/core/utils/GameConfigLoader";
import { IReelStripService } from "db://assets/core/interfaces/reel/IReelStripService";
import { IConfigRepository } from "db://assets/core/interfaces/config/IConfigRepository";
import { ResultService } from "../../services/ResultService";
import { IResultService } from "db://assets/core/interfaces/reel/IResultService";

export class ReelStripService implements IReelStripService {

    private defaultReels: ReelStrip[] = [];
    private reels: ReelStrip[] = [];
    private configData!: IGameConfig;

    strips: number[][] = [];
    private resultService!: IResultService;

    constructor(
        private config: IConfigRepository,
        weightedSymbols: WeightedSymbol[],
        islocalData: boolean = false
    ) {
        this.configData = this.config.getGameConfig();
        if (!islocalData) {
            const generator = new ReelStripGenerator(weightedSymbols);

            const raw = generator.generateReels(
                this.configData.reelCount,
                this.configData.stripLength
            );
            this.strips = [];
            for (let index = 0; index < this.configData.reelCount; index++) {
                this.strips.push([this.configData.stripLength]);
            }

            this.reels = raw.map((r, i) => ({
                index: i,
                strip: r.map(s => s.symbolId as SymbolId)
            }));

        } else {
            this.setReelsFromJsonData(config.getReelData());
            this.setDefaultReelsFromJsonData(config.getReelData());
        }
        this.resultService = new ResultService(this.strips);
    }

    setReelsFromJsonData(reelData: ReelData) {

        this.reels = [];
        this.strips = [];

        for (const reel of reelData.reels) {
            this.reels[reel.index] = {
                index: reel.index,
                strip: [...reel.strip]
            };
            this.strips.push([reel.strip.length]);
        }
    }

    setDefaultReelsFromJsonData(reelData: ReelData) {

        this.defaultReels = [];

        for (const reel of reelData.reels) {
            this.defaultReels[reel.index] = {
                index: reel.index,
                strip: [...reel.strip]
            };
        }
        Object.freeze(this.defaultReels);
    }

    resetReelsToDefault(): void {
        this.reels = this.defaultReels.map(r => ({
            index: r.index,
            strip: [...r.strip]
        }));
    }

    getNextResult(): number[] {
        return this.resultService.calculateRTPResult();
    }

    getReelStrip(index: number): string[] {
        return this.reels[index]?.strip ?? [];
    }

    getVisibleSymbols(reel: number, stopIndex: number): string[] {
        const strip = this.getReelStrip(reel);
        const result: string[] = [];
        const half = Math.floor(this.configData.visibleRows / 2);

        for (let i = -half; i <= half; i++) {
            const idx = (stopIndex + i + strip.length) % strip.length;
            result.push(strip[idx]);
        }
        return result;
    }

    public getVisibleRowSymbols(reelIndex: number, stopIndex: number): string[] {
        const strip = this.getReelStrip(reelIndex);
        const result: string[] = [];
        const half = Math.floor(this.configData.symbolRowsCount / 2);

        for (let i = -half; i <= half; i++) {
            const idx = (stopIndex + i + strip.length) % strip.length;
            result.push(strip[idx]);
        }
        return result;
    }

    public getVisibleSymbolsId(results: number[]): string[][] {
        const grid: string[][] = [];
        for (let i = 0; i < this.reels.length; i++) {
            grid.push(
                this.getVisibleSymbols(i, results[i])
            );
        }
        return grid;
    }

    public replaceReels(reels: ReelStrip[]) {
        this.reels = reels.map(r => ({
            index: r.index,
            strip: [...r.strip]
        }));
    }

    public getDefaultReels(): ReelStrip[] {
        return this.defaultReels.map(r => ({
            index: r.index,
            strip: [...r.strip]
        }));
    }

    public getFreeSpinTestData(): number[] {
        return this.resultService.getFreeSpinTestData();
    }

    public getBonusTestData(): number[] {
        return this.resultService.getBonusTestData();
    }

    public getJackpotTestData(): number[] {
        return this.resultService.getJackpotTestData();
    }

}
