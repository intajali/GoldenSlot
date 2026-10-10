import { GameConfigDataModel } from "../models/GameConfigDataModel";
import { GameException } from "./GameException";

export class GameConfigValidator {

    static validate(config: GameConfigDataModel): boolean {

        if (config.reelData.reels.length !== config.gameConfig.reelCount) {
            throw new GameException('Reel count mismatch');
        }

        for (const reel of config.reelData.reels) {
            if (reel.strip.length !== config.gameConfig.stripLength) {
                throw new GameException(`Invalid strip length on reel ${reel.index}`);
            }
        }
        console.log('GameConfig validated successfully');
        return true;
    }
}
