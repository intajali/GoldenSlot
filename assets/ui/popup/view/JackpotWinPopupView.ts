import { _decorator, Component, Enum, Label, Node, Sprite, SpriteFrame } from 'cc';
import { BasePopupView } from 'db://assets/core/ui/popup/BasePopupView';
import { IJackpotPopupData } from '../interface/IJackpotPopupData';
import { JackpotSymbol } from 'db://assets/game/jackpot/JackpotSymbol';
import { TweenKey, TweenUtil } from 'db://assets/core/utils/TweenUtil';
const { ccclass, property } = _decorator;


@ccclass('JackpotSpriteEntry')
export class JackpotSpriteEntry {
    @property({ type: Enum(JackpotSymbol) })
    symbol: JackpotSymbol = JackpotSymbol.MINI;

    @property(SpriteFrame)
    sprite: SpriteFrame | null = null;
}

@ccclass('JackpotWinPopupView')
export class JackpotWinPopupView extends BasePopupView<IJackpotPopupData> {
    popupId: string = 'JackpotWinPopup';

    @property(Label)
    private lblJackpotAmount: Label | null = null;

    @property(Sprite)
    private spriteJPSymbol: Sprite | null = null;

    @property(Node)
    private containerNode: Node;

    @property([JackpotSpriteEntry])
    private jpSpriteList: JackpotSpriteEntry[] = [];

    protected applyData(data: IJackpotPopupData): void {
        if (this.lblJackpotAmount) {
            this.lblJackpotAmount.string = data.winAmount.toString();
        }

        if (this.spriteJPSymbol) {
            const entry = this.jpSpriteList.find(e => e.symbol === data.jpSymbol);
            if (entry && entry.sprite) {
                this.spriteJPSymbol.spriteFrame = entry.sprite;
            }
        }
        TweenUtil.playScalePop(TweenKey.UI_SCALE_POP, this.containerNode, 1.2, 0.2);
    }
}




