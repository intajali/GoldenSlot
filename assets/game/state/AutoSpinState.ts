import { IGameContext } from 'db://assets/game/interface/IGameContext';
import { StateId } from '../../core/base/StateIds';
import { IState } from '../../core/interfaces/IState';
import { GameEvent } from '../../core/events/GameEvent';
import { eventBus } from '../../core/events/EventBus';
import { IdleState } from './IdleState';
import { SpinningState } from './SpinningState';

export class AutoSpinState implements IState {

    constructor(
        private ctx: IGameContext,

    ) { }
    readonly stateId = StateId.AUTO_SPIN;
    enter(): void {
        const session = this.ctx.getSession();

        eventBus.emit(GameEvent.AUTO_SPIN_COUNTER_UPDATED, session.autoSpinLeft);

        if (session.consumeAutoSpin()) {
            this.ctx.changeState(new SpinningState(this.ctx));
        } else {

            this.ctx.changeState(new IdleState(this.ctx));
        }

    }
    exit(): void {

    }
}




