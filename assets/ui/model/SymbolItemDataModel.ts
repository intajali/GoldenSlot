import { SpriteFrame } from "cc";
import { MatchPayout } from "../../core/models/MatchPayout";

export default class SymbolItemDataModel {
    symbolSprite: SpriteFrame;
    payouts: MatchPayout;
    symbolContext?: string;
}

