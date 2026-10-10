import { IState } from "../../base/BaseState";


export interface IUIStateHandler {
    canHandle(state: IState): boolean;
    apply(): void;
}
