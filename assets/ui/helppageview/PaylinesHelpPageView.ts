import { _decorator, ScrollView, Prefab, instantiate, Node } from 'cc';
import { BaseHelpPage } from '../../core/base/BaseHelpPage';
import { PaylineItemView } from '../itemview/PaylineItemView';
import { GameManager } from '../../game/manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('PaylinesHelpPageView')
export class PaylinesHelpPageView extends BaseHelpPage {

    @property({ type: Prefab })
    public itemPrefab: Prefab = null;

    @property({ type: Node })
    public contentParent: Node = null;

    private generatedItems: Node[] = [];

    private scrollView: ScrollView;

    protected resetScroll(): void {

        this.scrollView = this.node.getComponentInChildren(ScrollView);
        if (this.scrollView) {
            this.scrollView.scrollToTop(0);
        }
    }


    protected onShow(): void {
        this.resetScroll();
        const dataContainer = GameManager.instance.getDataContainer();
        const paylinesData = dataContainer.getPaylines().getPaylines();
        for (let i = 0; i < paylinesData.length; i++) {
            const payline = paylinesData[i];
            const itemNode = this.generateItems(i);
            const itemComponent = itemNode.getComponent(PaylineItemView);
            payline.push(i + 1); // Append payline index for display purposes
            console.log('Payline Pattern: ', payline);
            itemComponent.render(payline);
        }
    }

    generateItems(index: number): Node {

        if (index < this.generatedItems.length) {
            return this.generatedItems[index];
        } else {

            const itemNode = instantiate(this.itemPrefab);
            itemNode.setParent(this.contentParent); // Detach from any parent
            itemNode.setPosition(0, 0, 0);
            itemNode.setScale(1, 1, 1);

            this.generatedItems.push(itemNode);
            return itemNode;
        }
    }

    protected onHide(): void {

    }

}

