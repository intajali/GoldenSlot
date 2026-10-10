import { ReelStrip } from "../../utils/GameConfigLoader";

export interface IReelStripService {
    getReelStrip(index: number): string[];
    getVisibleSymbols(reel: number, stop: number): string[]
    getVisibleRowSymbols(reelIndex: number, stopIndex: number): string[]
    getVisibleSymbolsId(results: number[]): string[][];
    getNextResult(): number[];
    replaceReels(reels: ReelStrip[]): void;
    getDefaultReels(): ReelStrip[];
    getFreeSpinTestData(): number[];
    getBonusTestData(): number[];
    getJackpotTestData(): number[];
}

