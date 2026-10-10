import { SymbolId } from "../../models/MatchPayout";

export interface IGameConfig {
    gameplayDuration: number; //gameplay duration in milliseconds
    reelSpinSpeed: number; //reel spin speed in milliseconds
    maxSpinSpeed: number; //maximum reel spin speed in milliseconds
    stopDelayMs: number; //delay between stopping each reel in milliseconds
    reelCount: number;  //number of reels
    symbolRowsCount: number;
    visibleRows: number;
    stripLength: number;
    scatterSymbol: SymbolId;
    wildSymbol: SymbolId;
    boundBonusSymbol: SymbolId;
    minScatterForFreeSpins: number;
}
