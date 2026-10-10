import { JackpotConfig, JackpotResultModel } from "../../game/jackpot/JackpotConfig";
import { BonusWinResult } from "./BonusWinResult";
import { LineWinResult } from "./LineWinResult";
import { ScatterResult } from "./ScatterResult";

export class WinResultModel {
    totalWin: number;
    lineWins: LineWinResult[];
    scatterWin: ScatterResult;
    jackpotWins?: JackpotResultModel;
    bounsWins?: BonusWinResult;
    constructor(totalWin: number, lineWins: LineWinResult[], bonusWins: BonusWinResult, scatterWin: ScatterResult, jackpotWins?: JackpotResultModel) {
        this.totalWin = totalWin;
        this.lineWins = lineWins;
        this.bounsWins = bonusWins;
        this.scatterWin = scatterWin;
        this.jackpotWins = jackpotWins;

    }
}

