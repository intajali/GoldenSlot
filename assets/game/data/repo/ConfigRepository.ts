import { IConfigRepository } from "db://assets/core/interfaces/config/IConfigRepository";
import { IGameConfig } from "db://assets/core/interfaces/config/IGameConfig";
import { GameConfigDataModel } from "db://assets/core/models/GameConfigDataModel";
import { GameConfigLoader } from "db://assets/core/utils/GameConfigLoader";
import { GameConfigValidator } from "db://assets/core/utils/GameConfigValidator";

export class ConfigRepository implements IConfigRepository {

    private data!: GameConfigDataModel;

    async load() {
        this.data = await GameConfigLoader.loadAll();
        GameConfigValidator.validate(this.data);
    }

    getGameConfig(): IGameConfig {
        return this.data.gameConfig;
    }

    getPaytable() {
        return this.data.paytableData;

    }

    getReelData() {
        return this.data.reelData;
    }

    getPaylines() {
        return this.data.paylineConfig;
    }

    getBetConfig() {
        return this.data.betConfig;
    }
}
