
import { IBetManager } from "../../core/interfaces/IBetManager";
import { IState } from "../../core/interfaces/IState";
import { IUserAccount } from "../../core/interfaces/IUserAccount";
import { IReelsController } from "../../core/interfaces/reel/IReelsController";
import { GameDataContainer } from "../data/GameDataContainer";
import { GameSession } from "../data/GameSession";

export interface IGameContext {
    // session
    getSession(): GameSession;
    // data
    getDataContainer(): GameDataContainer;
    getReelsController(): IReelsController;
    getAccountManager(): IUserAccount;
    getBetManager(): IBetManager;
    requestSpin(): void;
    onConfigLoaded(): void;

    changeState(state: IState): void;

}
