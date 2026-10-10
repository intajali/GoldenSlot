import { _decorator, Component, Node, Sprite } from 'cc';
import { SymbolModel } from '../models/SymbolModel';
const { ccclass, property } = _decorator;

@ccclass('JackpotSymbolView')
export class JackpotSymbolView extends Component {
    @property(Sprite)
    private sprite!: Sprite;

    private model!: SymbolModel;

    public bind(model: SymbolModel) {
        console.log("JackpotSymbolView :: Binding model with symbol: ", model.symbolId);
        this.model = model;
        this.sprite.spriteFrame = model.symbolSprite;
    }
}

