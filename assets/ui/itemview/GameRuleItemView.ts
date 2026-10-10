import { _decorator, Component, Label, Node } from 'cc';
import { BaseListItemView } from '../../core/base/BaseListItemView';
const { ccclass, property } = _decorator;

@ccclass('GameRuleItemView')
export class GameRuleItemView extends BaseListItemView<string> {
    @property({ type: Label })
    public lbGameRuleLabel: Label = null;

    public render(data: string) {
        this.lbGameRuleLabel.string = data;
        this.node.active = true;
    }
}

