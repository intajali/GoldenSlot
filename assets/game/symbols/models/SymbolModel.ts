import { SpriteFrame } from "cc";

export class SymbolModel {
    constructor(
        public symbolId: string,
        public symbolSprite: SpriteFrame | null = null
    ) { }

    toString(): string {
        return `SymbolModel(id=${this.symbolId}, sprite=${this.symbolSprite?.name ?? 'null'})`;
    }

}
