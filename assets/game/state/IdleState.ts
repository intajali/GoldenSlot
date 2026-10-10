import { UI } from "cc";
import { StateId } from "../../core/base/StateIds";
import { UIController } from "../../ui/manager/UIController";
import { IGameContext } from "../interface/IGameContext";
import { UIControllerToken } from "../../core/base/UIControllerToken";
import { IState } from "../../core/interfaces/IState";
import { eventBus } from "../../core/events/EventBus";
import { GameEvent } from "../../core/events/GameEvent";
import { GameManager } from "../manager/GameManager";

export class IdleState implements IState {

    constructor(
        private ctx: IGameContext) { }
    readonly stateId = StateId.IDLE;
    async enter() {
        console.log("Entering Idle State");
        const session = this.ctx.getSession();

        session.resetRound();
        GameManager.instance.isJackpotTestMode = false; // Reset test mode on each new round
        GameManager.instance.isScatterTestMode = false; // Reset scatter test mode on each new round
        GameManager.instance.isBonusTestMode = false; // Reset bonus test mode on each new round
        UIController.instance.enable(UIControllerToken.FRONT_PANEL);
        UIController.instance.hide(UIControllerToken.FREE_SPIN_COUNTER_PANEL);
    }
    exit() {
        console.log("Exiting Idle State");
    }
}