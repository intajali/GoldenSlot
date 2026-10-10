import { IGameConfig } from "./IGameConfig";

export interface IConfigRepository {

    load();
    getGameConfig(): IGameConfig;
    getPaytable();
    getReelData();
    getPaylines();
    getBetConfig();
}

