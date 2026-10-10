
import { Coroutine } from "../../core/utils/Coroutine";
import { IGameContext } from "../interface/IGameContext";
import { StateId } from "../../core/base/StateIds";
import { IState } from "../../core/interfaces/IState";
import { WinResultModel } from "../../core/models/WinResultModel";
import { eventBus } from "../../core/events/EventBus";
import { GameEvent } from "../../core/events/GameEvent";
import { FreeSpinState } from "./FreeSpinState";
import { AutoSpinState } from "./AutoSpinState";
import { IdleState } from "./IdleState";
import { FreeSpinIntroState } from "./FreeSpinIntroState";
import { JackpotSymbol } from "../jackpot/JackpotSymbol";
import { PopupHandler } from "../../ui/popup/controller/PopupHandler";
import { PopupType } from "../../core/enum/PopupType";
import { ParticleGroupName, ParticleManager } from "../manager/ParticleManager";
import { IReelsController } from "../../core/interfaces/reel/IReelsController";
import { AudioService } from "../audio/AudioService";
import { AudioKey } from "../audio/AudioKey";
import { UIController } from "../../ui/manager/UIController";
import { UIControllerToken } from "../../core/base/UIControllerToken";

export class WinPresentationState implements IState {
    constructor(
        private ctx: IGameContext,
        private results: WinResultModel
    ) { }
    readonly stateId = StateId.WIN_PRESENTATION;

    private reelController: IReelsController;

    async enter() {
        console.log("Entering WinPresentationState");
        this.reelController = this.ctx.getReelsController();
        const session = this.ctx.getSession();
        const account = this.ctx.getAccountManager();
        session.winAmount = this.results.totalWin;
        if (this.results.lineWins.length > 0) {
            AudioService.instance.playSFX(AudioKey.LINE_WIN);
            this.reelController.playLineWinHighlight(this.results.lineWins);
        }

        if (this.results.bounsWins) {
            AudioService.instance.playSFX(AudioKey.BONUS);
            this.reelController.playBonusWinHighlight(this.results.bounsWins);
        }
        if (this.results.jackpotWins && this.results.jackpotWins.triggered) {
            AudioService.instance.playSFX(AudioKey.BONUS);
            this.reelController.playSpecialSymbolHighlight('JACKPOT', this.results.jackpotWins.positions);
        }

        if (this.results.scatterWin.triggered) {
            AudioService.instance.playSFX(AudioKey.BONUS);
            this.reelController.playSpecialSymbolHighlight('SCATTER', this.results.scatterWin.positions);
        }

        if (session.inFreeSpins && session.hasShownFreeSpinPopup) {
            console.log("Adding free spin win:", this.results.scatterWin.scatterCount);
            AudioService.instance.playSFX(AudioKey.BONUS);
            session.freeSpinWin += this.results.totalWin;
            eventBus.emit(GameEvent.FREE_SPIN_WIN, this.results.totalWin);
        }
        await Coroutine.instance.delay(200);

        eventBus.emit(GameEvent.WIN_UPDATED, this.results.totalWin);

        if (this.results.scatterWin.triggered && this.results.scatterWin.scatterCount > 3) {
            AudioService.instance.playLoop(AudioKey.JACKPOT);
            ParticleManager._instance.play(ParticleGroupName.BIG_WIN);
            await Coroutine.instance.delay(3000); // Wait for jackpot popup to be noticed
            ParticleManager._instance.stop(ParticleGroupName.BIG_WIN);
            AudioService.instance.stopLoop();
        }

        await this.waitForWinSnap();

        // Check for Jackpot Wins
        if (this.results.jackpotWins && this.results.jackpotWins.triggered) {
            await Coroutine.instance.delay(200);
            UIController.instance.show(UIControllerToken.JACKPOT_FEATURE_PANEL);

        }
        await Coroutine.instance.delay(500);

        this.ctx.changeState(this.getNextState());
    }

    private async waitForWinSnap(): Promise<void> {
        const session = this.ctx.getSession();

        await Coroutine.instance.waitUntil(
            () => session.isWinSnappingDone === true,
            100
        ).promise.then(() => {
            //this.ctx.changeState(this.getNextState());
        });
    }

    private getNextState(): IState {
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

