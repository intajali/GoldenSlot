import { IPaytable } from "../interface/IPaytable";
import { IWinEvaluator } from "../../core/interfaces/IWinEvaluator";
import { ScatterResult } from "../../core/models/ScatterResult";


export class ScatterEvaluator implements IWinEvaluator<ScatterResult> {

    constructor(
        private readonly paytable: IPaytable,
        private readonly scatterId = "SCAT",
        private readonly triggerCount = 3
    ) { }

    evaluate(visible: string[][]): ScatterResult {
        let count = 0;
        const scatterPositions: { reel: number; row: number }[] = [];
        visible.forEach((reel, reelIndex) =>
            reel.forEach((symbol, rowIndex) => {
                if (symbol?.startsWith(this.scatterId)) {
                    count++;
                    scatterPositions.push({ reel: reelIndex, row: rowIndex });
                }
            })
        );

        return {
            scatterCount: count,
            triggered: count >= this.triggerCount,
            winAmount: this.paytable.getPayout(this.scatterId, count),
            positions: scatterPositions
        };
    }
}
