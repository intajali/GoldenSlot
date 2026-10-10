import { SpriteFrame } from "cc";
import { SymbolModel } from "../../game/symbols/models/SymbolModel";
import { IGameConfig } from "./config/IGameConfig";

export interface IGameDataProvider {
    getGameConfig(): IGameConfig;
    getPaytable();
    getPaylines();
    getbetConfig();
    getSymbolSprite(id: string): SpriteFrame | null;
    getJackpotSymbols(): SymbolModel[];
}
