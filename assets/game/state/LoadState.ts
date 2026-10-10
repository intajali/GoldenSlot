
import { IGameContext } from "../interface/IGameContext";
import { StateId } from "../../core/base/StateIds";
import { IState } from "../../core/interfaces/IState";
export class LoadState implements IState {

    constructor(
        private ctx: IGameContext) { }
    readonly stateId = StateId.LOAD;

    async enter() {

        const dataContainer = this.ctx.getDataContainer();
        await dataContainer.initialize((result) => {
            console.log("All Data loaded successfully.")
            this.ctx.onConfigLoaded();
        });
    }

    exit(): void {

    }

}

