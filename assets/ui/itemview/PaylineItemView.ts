import { _decorator, Color, Component, Node, instantiate, Label } from 'cc';
import { BaseListItemView } from '../../core/base/BaseListItemView';
import { GridItemView } from './GridItemView';
const { ccclass, property } = _decorator;

@ccclass('PaylineItemView')
export class PaylineItemView extends BaseListItemView<number[]> {

    @property({ type: Node })
    public gridParent: Node = null;

    @property({ type: Node })
    public grid: Node;

    @property({ type: Label })
    public lbIndex: Label;

    public defaultColor: string = "#dfdddd";

    public highlightColor: string = "#f5b300";

    private generatedItems: Node[] = [];

    render(data: number[]): void {
        this.lbIndex.string = `${data[data.length - 1]}.`; // Set the label text to the last element of data (the payline index)
        for (let i = 0; i < data.length - 1; i++) { // Exclude the last element (payline index) from grid creation
            const newGrid = this.generateItems(i);

            newGrid.active = true;
            const payIndex = data[i];
            newGrid.getComponent(GridItemView).setHighlight(payIndex, this.highlightColor, this.defaultColor);

        }
    }

    generateItems(index: number): Node {

        if (index < this.generatedItems.length) {
            return this.generatedItems[index];
        } else {

            const itemNode = instantiate(this.grid);
            itemNode.setParent(this.gridParent); // Detach from any parent
            itemNode.setPosition(0, 0, 0);
            itemNode.setScale(1, 1, 1);

            this.generatedItems.push(itemNode);
            return itemNode;
        }
    }

}





