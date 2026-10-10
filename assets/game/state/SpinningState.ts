
import { StateId } from '../../core/base/StateIds';
import { Coroutine } from '../../core/utils/Coroutine';
import { IGameContext } from 'db://assets/game/interface/IGameContext';
import { IState } from '../../core/interfaces/IState';
import { EvaluateState } from './EvaluateState';
import { eventBus } from '../../core/events/EventBus';
import { GameEvent } from '../../core/events/GameEvent';
import { JackpotData, JackpotHandler } from '../jackpot/JackpotHandler';
import { IdleState } from './IdleState';
import { GameManager } from '../manager/GameManager';
import { PopupService } from '../../ui/popup/controller/PopupService';

export class SpinningState implements IState {

    constructor(private ctx: IGameContext) { }
    readonly stateId = StateId.SPINNING;

    async enter(): Promise<void> {

        const session = this.ctx.getSession();
        const account = this.ctx.getAccountManager();
        const bet = this.ctx.getBetManager().getCurrentTotalBet();
        const reels = this.ctx.getReelsController();
        const data = this.ctx.getDataContainer();
        const reelStripService = data.getReelStripService();

        let result: number[];
        // // Deduct balance only if not in free spins
        if (session.isBaseGame()) {
            if (!account.isBalanceSufficient(bet)) {
                console.warn(`Cannot place bet of ${bet}. Current balance: ${account.balance}`);

                const result = await PopupService.showErrorPopup(
                    "Insufficient Balance",
                    `Your current balance of ${account.balance} is insufficient for the bet amount of ${bet}. Please add more funds or adjust your bet.`,
                    "SpinningState.ts"
                );

                if (result) {
                    console.log("User chose to add funds.");
                    //TODO: Open deposit page or show options to add balance
                    this.checkAndStopAutoSpin();
                } else {
                    console.log("User chose to adjust bet or stop auto-spin.");
                    this.checkAndStopAutoSpin();
                }

                // Handle insufficient balance (e.g., show a warning popup)
                this.ctx.changeState(
                    new IdleState(this.ctx)
                );
                return;
            }
            eventBus.emit(GameEvent.WIN_UPDATED, 0);
            account.deductBalance(bet);
        }
        const jackpotHandler = new JackpotHandler();
        let tempReels = reelStripService.getDefaultReels();
        // if (session.isBaseGame()) {
        //     if (GameManager.instance.isJackpotTestMode) {
        //         const jackpotData = GameManager.instance.getTestModeJackpotData();
        //         console.log("Test mode: Forcing jackpot symbol on reels");
        //         const reelIndex = jackpotData.reelIndex;
        //         const stopIndex = jackpotData.stopIndex;
        //         tempReels = jackpotHandler.injectJackpotSymbol(
        //             tempReels,
        //             bet,
        //             session,
        //             jackpotData
        //         );
        //         reelStripService.replaceReels(tempReels);

        //         result = reelStripService.getNextResult();
        //         result = [...result]; // clone
        //         result[reelIndex] = stopIndex;
        //     } else {
        //         tempReels = jackpotHandler.injectJackpotSymbol(
        //             tempReels,
        //             bet,
        //             session
        //         );
        //         reelStripService.replaceReels(tempReels);
        //         result = reelStripService.getNextResult();

        //     }
        // } else {
        //     // Reset to default reels in free spins
        //     tempReels = reelStripService.getDefaultReels();
        //     reelStripService.replaceReels(tempReels);
        //     result = reelStripService.getNextResult();
        // }

        tempReels = reelStripService.getDefaultReels();
        reelStripService.replaceReels(tempReels);
        result = reelStripService.getNextResult();

        if (GameManager.instance.isJackpotTestMode) {
            result = reelStripService.getJackpotTestData();
        }

        if (GameManager.instance.isScatterTestMode) {
            console.log("Scatter test mode enabled: Forcing scatter symbols on reels");
            result = reelStripService.getFreeSpinTestData();
            GameManager.instance.isScatterTestMode = false; // Reset after use
        }

        if (GameManager.instance.isBonusTestMode) {
            console.log("Bonus test mode enabled: Forcing bonus symbols on reels");
            result = reelStripService.getBonusTestData();
        }


        //Update the jackpot meter with the bet contribution from this spin of 2% of the total bet.
        eventBus.emit(GameEvent.PROGRESSIVE_JACKPOT_UPDATED, bet * 0.02);
        reels.startSpin();
        console.log("strat :: " + Date.now());
        await Coroutine.instance.delay(
            data.getGameConfig().gameplayDuration
        );

        console.log("Stop :: " + Date.now());
        await reels.stopSpin(result);

        console.log("Reel Stop Index :: " + result)
        this.ctx.changeState(
            new EvaluateState(this.ctx, result)
        );

    }

    private checkAndStopAutoSpin() {

        if (this.ctx.getSession().autoSpinEnabled) {
            this.ctx.getSession().stopAutoSpin();
            eventBus.emit(GameEvent.AUTO_SPIN_STOPPED);
        }
    }

    exit(): void {

    }
}
