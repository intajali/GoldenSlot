import { _decorator, JsonAsset } from 'cc';


import { ReelConfigParser } from 'db://assets/core/utils/ReelConfigParser';
import { SymbolId } from 'db://assets/core/models/MatchPayout';
import { GameConfigDataModel } from 'db://assets/core/models/GameConfigDataModel';
import { GameUtils } from './GameUtils';
import { IReelStripConfig } from '../interfaces/reel/IReelStripConfig';
import { IGameConfig } from '../interfaces/config/IGameConfig';

export interface ReelStrip {
    index: number;
    strip: SymbolId[];
}

export interface ReelData {
    reels: ReelStrip[];
}


export class GameConfigLoader {
    /**
     * Load all game configuration data
     * @returns Promise resolving to all game configuration data
     */
    static async loadAll(): Promise<GameConfigDataModel> {
        const [gameConfig, betConfig, reels, paylineConfig, paytableData] = await Promise.all([
            GameUtils.loadResource<JsonAsset>('data/config/gameConfig', JsonAsset),
            GameUtils.loadResource<JsonAsset>('data/config/betConfig', JsonAsset),
            GameUtils.loadResource<JsonAsset>('data/reels/reelStrips', JsonAsset),
            GameUtils.loadResource<JsonAsset>('data/payline/paylines', JsonAsset),
            GameUtils.loadResource<JsonAsset>('data/paytable/paytable', JsonAsset),
        ]);

        return new GameConfigDataModel(
            gameConfig.json.gameConfig as IGameConfig,
            betConfig.json.betConfig,
            reels.json as ReelData,
            paylineConfig.json,
            paytableData.json,
        );
    }

    static async loadReelData(): Promise<IReelStripConfig[]> {
        const jsonAsset = await GameUtils.loadResource<JsonAsset>('data/reels/reelstripdata', JsonAsset)
        const rawData = jsonAsset.json as any;
        return ReelConfigParser.parse(rawData);
    }
}







