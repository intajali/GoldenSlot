import { BaseSpinEvaluationService } from "../../core/services/BaseSpinEvaluationService";
import { JackpotEvaluator } from "../results/JackpotEvaluator";
import { LineWinEvaluator } from "../results/LineWinEvaluator";
import { ScatterEvaluator } from "../results/ScatterEvaluator";

export class SpinEvaluationService extends BaseSpinEvaluationService {

    constructor(private lineEvaluator: LineWinEvaluator,
        private scatterEvaluator: ScatterEvaluator,
        private jackpotEvaluator: JackpotEvaluator) {
        super();
    }

    evaluateSpin(visibleSymbols: string[][]) {
        const winresult = this.lineEvaluator.evaluate(visibleSymbols);
        const scatterResult = this.scatterEvaluator.evaluate(visibleSymbols);
        const jackpots = this.jackpotEvaluator.evaluate(visibleSymbols);

        let totalWin =
            winresult.lineWins.reduce((s, w) => s + w.winAmount, 0) +
            scatterResult.winAmount;

        if (winresult.bonusWin) {
            totalWin += winresult.bonusWin?.winAmount;
        }

        return {
            lineWins: winresult,
            scatterResult,
            totalWin,
            jackpots
        };
    }

}

