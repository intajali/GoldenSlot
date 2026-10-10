import { _decorator, Label, Node, Sprite, instantiate } from 'cc';
import { BaseListItemView } from '../../core/base/BaseListItemView';
import SymbolItemDataModel from '../model/SymbolItemDataModel';
const { ccclass, property } = _decorator;

@ccclass('SymbolItemView')
export class SymbolItemView extends BaseListItemView<SymbolItemDataModel> {

    @property({ type: Sprite })
    public symbolSprite: Sprite = null;

    @property({ type: Node })
    public payTableParent: Node = null;

    @property({ type: Node })
    public paytableValueNode: Node;
    @property({ type: Label })
    public lbSymbolContext: Label = null;

    render(data: SymbolItemDataModel): void {

        this.symbolSprite.spriteFrame = data.symbolSprite;

        // Clear existing paytable values
        this.payTableParent.removeAllChildren();
        if (data.symbolContext && this.lbSymbolContext) {
            this.lbSymbolContext.string = data.symbolContext;
        }

        for (const key of Object.keys(data.payouts)) {
            console.log(`Match ${key} → ${data.payouts[key]}`);
            if (data.payouts[key] <= 0) {
                continue; // Skip zero or negative payouts
            }
            const paytableNode = instantiate(this.paytableValueNode);
            paytableNode.setParent(this.payTableParent);
            const label = paytableNode.getComponent(Label);
            if (label) {
                const txt = `${key} = ${data.payouts[key]}`;
                console.log('Setting paytable label string to: ', txt);
                label.string = txt;
            }
            paytableNode.active = true;
        }
    }
}

