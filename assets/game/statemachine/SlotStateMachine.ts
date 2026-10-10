import { IState } from "../../core/interfaces/IState";

export class SlotStateMachine {

    private currentState: IState | null = null;

    public changeState(nextState: IState) {
        if (this.currentState) {
            console.log(`previous State: ${this.currentState.stateId}`);
            this.currentState.exit();
        }
        console.log(`State changed to: ${nextState.stateId}`);
        this.currentState = nextState;
        this.currentState.enter();
    }

    public update(dt: number) {
        this.currentState?.update?.(dt);
    }

    public getCurrentState(): IState | null {
        return this.currentState;
    }
}
