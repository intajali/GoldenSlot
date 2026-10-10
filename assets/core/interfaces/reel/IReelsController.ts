
import { IGameContext } from "db://assets/game/interface/IGameContext";
import { LineWinResult } from "../../models/LineWinResult";
import { BonusWinResult } from "../../models/BonusWinResult";

export interface IReelsController {
    initReels(context: IGameContext): void;
    startSpin(): Promise<void>;
    stopSpin(results: number[]): Promise<void>;
    playLineWinHighlight(wins: LineWinResult[]): void;
    playBonusWinHighlight(bonusWins: BonusWinResult): void;
    playSpecialSymbolHighlight(symbolId: string, positions: { reel: number; row: number }[]): void;
    setSymbolFrame(symbolId: string, positions: { reel: number; row: number }[]): void;
    clearHighlights(): void;
    isSpinning(): boolean;
    setReelSpinSpeed(speed: number): void;
}
