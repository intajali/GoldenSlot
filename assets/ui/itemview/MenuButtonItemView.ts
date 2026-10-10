import { __private, _decorator, Button, Color, Component, Label, Node, Sprite } from 'cc';
import { BaseListItemView } from '../../core/base/BaseListItemView';
import { GameUtils } from '../../core/utils/GameUtils';
const { ccclass, property } = _decorator;

@ccclass('MenuButtonItemView')
export class MenuButtonItemView extends BaseListItemView<any> {

    @property({ type: Button })
    private btnMenuItem: Button;

    @property({ type: Label })
    private lbItemLabel: Label;

    public onItemClicked?: (data: any) => void;
    private itemData: any;

    private defaultLabelColor: Color = Color.BLACK;
    private selectedLabelColor: Color = Color.WHITE;

    private defaultBaseColor: string = '#F5B300';
    private selectedBaseColor: string = '#0A5E08';

    private btnBaseSprite;
    private itemIndex: number;

    render(data: any): void {
        this.btnBaseSprite = this.btnMenuItem.node.getComponent(Sprite);
        this.itemData = data;
        this.lbItemLabel.string = data.label;
        this.itemIndex = data.index;
        this.lbItemLabel.color = this.defaultLabelColor;
        this.btnMenuItem.node.on(Button.EventType.CLICK, this.onMenuItemButtonClicked, this);
        this.node.active = true;
    }

    onMenuItemButtonClicked() {
        this.onItemClicked?.(this.itemData);
    }

    updateSelection(value: boolean): void {
        if (value) {
            this.lbItemLabel.color = this.selectedLabelColor;
            this.btnBaseSprite.color = GameUtils.hexToColor(this.selectedBaseColor);
        } else {
            this.lbItemLabel.color = this.defaultLabelColor;
            this.btnBaseSprite.color = GameUtils.hexToColor(this.defaultBaseColor);
        }
    }

    protected onDestroy(): void {
        this.btnMenuItem.node.off(Button.EventType.CLICK);
    }

}

