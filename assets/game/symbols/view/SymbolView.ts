import { _decorator, Component, Enum, Node, Sprite, SpriteFrame, Animation } from 'cc';
import { SymbolModel } from '../models/SymbolModel';
import { SymbolHighlighter } from 'db://assets/core/utils/SymbolHighlighter';
import { SquareOrbitParticles } from 'db://assets/resources/particles/SquareOrbitParticles';
const { ccclass, property } = _decorator;


export enum SymbolType {
    NORMAL = 0,
    WILD = 1,
    SCATTER = 2,
    BONUS = 3,
    JACKPOT = 4
}
Enum(SymbolType);


@ccclass('SymbolTitleSpritePair')
export class SymbolTitleSpritePair {

    @property({ type: SymbolType })
    symbolType: SymbolType = SymbolType.NORMAL;

    @property(SpriteFrame)
    titleSprite: SpriteFrame | null = null;
}
@ccclass('SymbolView')
export class SymbolView extends Component {
    @property(Sprite)
    private sprite!: Sprite;

    @property(Sprite)
    private titleSprite: Sprite | null = null;

    @property(Node)
    private frameNode: Node | null = null;
    @property(Node)
    private starEffectNode: Node | null = null;

    @property([SymbolTitleSpritePair])
    symbolTitleList: SymbolTitleSpritePair[] = [];

    private highlighter: SymbolHighlighter | null = null;
    private lineParicle: SquareOrbitParticles | null = null;
    private model!: SymbolModel;

    private titleAnim: Animation | null = null;

    onLoad() {
        if (this.frameNode) {
            this.frameNode.active = false;
        }
        if (this.starEffectNode) {
            this.starEffectNode.active = false;
        }
        if (this.titleSprite) {
            this.titleSprite.node.active = false;
            this.titleAnim = this.titleSprite.getComponent(Animation);
        }

        this.highlighter = this.getComponent(SymbolHighlighter);
        this.lineParicle = this.getComponent(SquareOrbitParticles);
        if (this.lineParicle) {
            this.lineParicle.hide();
        }

    }

    public bind(model: SymbolModel) {
        this.model = model;
        this.sprite.spriteFrame = model.symbolSprite;
        this.highlighter?.set(this.sprite);
    }

    public highlightLineWin() {
        this.highlighter?.highlightLineWin();
        if (this.frameNode) {
            this.frameNode.active = true;
        }
        this.lineParicle.show();
    }

    public highlightBonusWin() {
        this.highlighter?.highlightBonusWin();
        if (this.frameNode) {
            this.frameNode.active = true;
        }
    }

    public showSpecialSymbolEffect() {
        // if (this.starEffectNode) {
        //     this.starEffectNode.active = true;
        // }
        if (this.frameNode) {
            this.frameNode.active = true;
        }
        this.lineParicle.show();
        this.playTitleAnim();

    }

    public setFrame(isActive: boolean = false) {
        if (this.frameNode) {
            this.frameNode.active = isActive;
        }
    }

    public setTitleVisible(isVisible: boolean, symbolType: SymbolType) {
        if (isVisible) {
            const pair = this.symbolTitleList.find(p => p.symbolType === symbolType);
            if (pair) {
                this.titleSprite.spriteFrame = pair.titleSprite;
            }
        }
        this.titleSprite.node.active = isVisible;
    }

    private playTitleAnim() {

        if (this.titleAnim) {
            this.titleAnim.stop();
            this.titleAnim.play();
        }
    }

    public stopTitleAnimation() {
        if (this.titleAnim) {
            this.titleAnim.stop();
        }
    }

    public clearHighlight() {
        this.frameNode.active = false;
        this.starEffectNode.active = false;
        this.lineParicle.hide();
        this.highlighter?.clear();
        this.stopTitleAnimation();

    }

    public getSymbolId(): string {
        return this.model.symbolId;
    }
}

