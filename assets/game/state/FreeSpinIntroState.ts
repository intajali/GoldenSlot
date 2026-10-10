import { _decorator } from 'cc';
import { IState } from '../../core/interfaces/IState';
import { StateId } from '../../core/base/StateIds';
import { IGameContext } from '../interface/IGameContext';
import { FreeSpinState } from './FreeSpinState';
import { PopupHandler } from '../../ui/popup/controller/PopupHandler';
import { PopupType } from '../../core/enum/PopupType';
import { GameEvent } from '../../core/events/GameEvent';
import { eventBus } from '../../core/events/EventBus';
import { commandBus } from '../../core/events/CommandBus';
import { GameCommand } from '../../core/events/GameCommand';
import { PopupService } from '../../ui/popup/controller/PopupService';
const { ccclass } = _decorator;

@ccclass('FreeSpinIntroState')
export class FreeSpinIntroState implements IState {
    readonly stateId = StateId.FREE_SPIN_INTRO;

    constructor(private ctx: IGameContext) { }
    async enter(): Promise<void> {
        console.log("Entered FreeSpinIntroState")
        const session = this.ctx.getSession();

        if (session.hasShownFreeSpinPopup) {
            this.ctx.changeState(new FreeSpinState(this.ctx));
            return;
        }
        session.hasShownFreeSpinPopup = true;

        const result = await PopupService.showFreeGameWinPopup(
            `BONUS!`,
            `Congratulations! You've won ${session.freeSpinsLeft} Free Spins!`,
            "FreeSpinIntroState.ts"
        );

        if (result) {
            console.log("User chose to collect the Free Spins.");
            PopupHandler.instance.hideCurrent();
            eventBus.emit(GameEvent.FREE_SPIN_STARTED);
            this.ctx.changeState(new FreeSpinState(this.ctx));
        }
    }

    exit(): void {

    }

}

