import { _decorator, Component, Node, Sprite } from 'cc';
import { GameUtils } from '../../core/utils/GameUtils';
import { BaseListItemView } from '../../core/base/BaseListItemView';
const { ccclass, property } = _decorator;

@ccclass('GridItemView')
export class GridItemView extends Component implements BaseListItemView<void> {
    render(data: void): void {

    }
    @property({ type: Node })
    public gridBoxes: Node[] = [];

    setHighlight(payIndex: number, highlightColor: string, defaultColor: string): void {
        for (const box of this.gridBoxes) {
            const sprite = box.getComponent(Sprite);
            if (sprite) {
                sprite.color = GameUtils.hexToColor(defaultColor);
            }
        }
        this.gridBoxes[payIndex].getComponent(Sprite).color = GameUtils.hexToColor(highlightColor);
    }
}

