// EvaluateState.ts
// State to evaluate spin results and determine wins
// Transitions to SymbolHighlightState after evaluation


import { LineWinEvaluator } from "db://assets/game/results/LineWinEvaluator";
import { ScatterEvaluator } from "db://assets/game/results/ScatterEvaluator";
import { SpinEvaluationService } from "db://assets/game/services/SpinEvaluationService";
import { IGameContext } from "db://assets/game/interface/IGameContext";
import { IReelStripService } from "../../core/interfaces/reel/IReelStripService";
import { StateId } from "../../core/base/StateIds";
import { IState } from "../../core/interfaces/IState";
import { WinResultModel } from "../../core/models/WinResultModel";
import { JackpotEvaluator } from "../results/JackpotEvaluator";
import { FreeSpinState } from "./FreeSpinState";
import { AutoSpinState } from "./AutoSpinState";
import { IdleState } from "./IdleState";
import { WinPresentationState } from "./WinPresentationState";
import { FreeSpinIntroState } from "./FreeSpinIntroState";


export class EvaluateState implements IState {

    constructor(
        private ctx: IGameContext,
        private results: number[]
    ) { }
    readonly stateId = StateId.EVALUATE;

    async enter() {
        console.log("Entering Evaluate State");
        const dataContainer = this.ctx.getDataContainer();
        const reelService: IReelStripService = dataContainer.getReelStripService();
        const paytable = dataContainer.getPaytable();
        const paylines = dataContainer.getPaylines();
        const betManager = this.ctx.getBetManager();
        const lineEvaluator = new LineWinEvaluator(
            paylines,
            paytable,
            betManager
        );

        const scatterEvaluator = new ScatterEvaluator(
            paytable
        );

        const jackpotEvaluator = new JackpotEvaluator(paytable);

        const spinService = new SpinEvaluationService(
            lineEvaluator,
            scatterEvaluator,
            jackpotEvaluator,
        );

        const visibleIds = reelService.getVisibleSymbolsId(this.results);
        console.log("Visible Symbols IDs:", visibleIds);
        const result = spinService.evaluateSpin(visibleIds);
        console.log(`result.totalWin :: ${result.totalWin}`);

        const winresult = new WinResultModel(
            result.totalWin,
            result.lineWins.lineWins,
            result.lineWins.bonusWin,
            result.scatterResult,
            result.jackpots
        );

        this.ctx.getSession().applyWinResult(winresult);

        console.log(`Line Wins: `, result.lineWins);

        if (result.totalWin > 0 || (result.jackpots && result.jackpots.triggered)) {
            this.ctx.changeState(new WinPresentationState(this.ctx, winresult));
        } else {
            this.ctx.changeState(this.getNextFlowState());
        }
    }

    private getNextFlowState(): IState {
        const session = this.ctx.getSession();

        if (session.inFreeSpins && session.hasShownFreeSpinPopup) {
            return new FreeSpinState(this.ctx);
        }

        if (session.inFreeSpins && !session.hasShownFreeSpinPopup) {
            return new FreeSpinIntroState(this.ctx);
        }

        if (session.autoSpinLeft > 0) {
            return new AutoSpinState(this.ctx);
        }

        return new IdleState(this.ctx);
    }


    exit(): void {

    }

}

