import { IWinEvaluator } from "../../core/interfaces/IWinEvaluator";
import { JACKPOT_CONFIG, JackpotConfig } from "../jackpot/JackpotConfig";
import { JackpotSymbol } from "../jackpot/JackpotSymbol";
import { GameSession } from "../data/GameSession";
import { IPaytable } from "../interface/IPaytable";
import { JackpotResultModel } from "../jackpot/JackpotConfig";

export class JackpotEvaluator implements IWinEvaluator<JackpotResultModel> {

    constructor(
        private readonly paytable: IPaytable,
        private readonly jackpotID = "JACKPOT",
        private readonly triggerCount = 6
    ) { }

    evaluate(visible: string[][]): JackpotResultModel {

        let count = 0;
        const scatterPositions: { reel: number; row: number }[] = [];
        visible.forEach((reel, reelIndex) =>
            reel.forEach((symbol, rowIndex) => {
                if (symbol?.startsWith(this.jackpotID)) {
                    count++;
                    scatterPositions.push({ reel: reelIndex, row: rowIndex });
                }
            })
        );

        return {
            jackpotCount: count,
            triggered: count >= this.triggerCount,
            winAmount: this.paytable.getPayout(this.jackpotID, count),
            positions: scatterPositions
        };
    }

    // triggerJackpot(jackpots: JackpotSymbol[]): JackpotConfig[] {

    //     const jackpotConfigs: JackpotConfig[] = [];

    //     for (const jp of jackpots) {
    //         const config = JACKPOT_CONFIG.find(j => j.symbol === jp);
    //         if (!config) continue;
    //         jackpotConfigs.push(config);
    //         console.log(`JACKPOT WON TYPE : ${JackpotSymbol[jp]}`);
    //     }

    //     return jackpotConfigs;
    // }


}

