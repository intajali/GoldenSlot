
import { StateId } from '../../core/base/StateIds';
import { UIControllerToken } from '../../core/base/UIControllerToken';
import { eventBus } from '../../core/events/EventBus';
import { GameEvent } from '../../core/events/GameEvent';
import { IState } from '../../core/interfaces/IState';
import { UIController } from '../../ui/manager/UIController';
import { IGameContext } from '../interface/IGameContext';
import { IdleState } from './IdleState';
import { SpinningState } from './SpinningState';

export class FreeSpinState implements IState {
    constructor(
        private ctx: IGameContext,

    ) { }
    readonly stateId = StateId.FREE_SPIN;
    enter(): void {
        const session = this.ctx.getSession();
        UIController.instance.show(UIControllerToken.FREE_SPIN_COUNTER_PANEL);

        if (session.consumeFreeSpin()) {
            eventBus.emit(GameEvent.FREE_SPIN_COUNTER_UPDATED, session.freeSpinsLeft);
            this.ctx.changeState(new SpinningState(this.ctx));
        } else {
            this.ctx.getAccountManager().addBalance(session.freeSpinWin / 100);
            this.ctx.changeState(new IdleState(this.ctx));
        }
    }
    exit(): void {

    }
}

