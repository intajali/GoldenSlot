import { _decorator, Button, Color, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { BaseListItemView } from '../../core/base/BaseListItemView';
import { AutoSpinItemDataModel } from '../model/AutoSpinItemDataModel';
import { GameUtils } from '../../core/utils/GameUtils';
const { ccclass, property } = _decorator;

@ccclass('AutoSpinItemView')
export class AutoSpinItemView extends BaseListItemView<AutoSpinItemDataModel> {

    @property({ type: Label })
    lbSpinCount: Label;
    @property({ type: Button })
    btnSpinItem: Button;

    @property({ type: Sprite })
    btnBaseSprite: Sprite;

    @property({ type: SpriteFrame })
    private defaultSprite: SpriteFrame;
    @property({ type: SpriteFrame })
    private selectedSprite: SpriteFrame;

    private defaultLabelColor: Color = Color.WHITE;
    private selectedLabelColor: Color = Color.BLACK;

    private defaultBaseColor: string = '#6D0204';
    private selectedBaseColor: string = '#FFD76A';

    public onItemClicked?: (data: AutoSpinItemDataModel) => void;

    private itemData: AutoSpinItemDataModel;

    render(data: AutoSpinItemDataModel): void {
        this.itemData = data;
        this.lbSpinCount.string = data.spinCount.toString();
        this.btnSpinItem.node.on(Button.EventType.CLICK, this.onItemButtonClicked, this);
        this.updateSelection(false);
        this.node.active = true;
    }

    private onItemButtonClicked() {
        this.onItemClicked?.(this.itemData);
    }

    updateSelection(value: boolean): void {
        if (value) {
            this.lbSpinCount.color = this.selectedLabelColor;
            this.btnBaseSprite.color = GameUtils.hexToColor(this.selectedBaseColor);
        } else {
            this.lbSpinCount.color = this.defaultLabelColor;
            this.btnBaseSprite.color = GameUtils.hexToColor(this.defaultBaseColor);
        }
    }

    protected onDestroy(): void {
        this.btnSpinItem.node.off(Button.EventType.CLICK);
    }

}

