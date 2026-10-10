import { StateId } from "../base/StateIds";

export interface IState {
    stateId: StateId;
    enter(): void;
    update?(dt: number): void;
    exit(): void;
}

