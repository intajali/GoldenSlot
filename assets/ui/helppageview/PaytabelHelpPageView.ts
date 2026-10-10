import { _decorator, Node, Prefab, instantiate, ScrollView } from 'cc';
import { BaseHelpPage } from '../../core/base/BaseHelpPage';
import { GameManager } from '../../game/manager/GameManager';
import { PaytableTierEnum } from '../../core/models/PaytableTierEnum';
import { SymbolItemView } from '../itemview/SymbolItemView';
import SymbolItemDataModel from '../model/SymbolItemDataModel';
const { ccclass, property } = _decorator;

@ccclass('PaytabelHelpPageView')
export class PaytabelHelpPageView extends BaseHelpPage {

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
        const paytable = dataContainer.getPaytable();

        const lowTierData = paytable.getTier(PaytableTierEnum.LOW);
        const highTierData = paytable.getTier(PaytableTierEnum.HIGH);

        console.log('PAYTABLE: ', lowTierData);

        const lowTierSymbols = lowTierData.getSymbols();
        const highTierSymbols = highTierData.getSymbols();

        let i = 0;
        for (const t in highTierSymbols) {
            const symbol = highTierSymbols[t];
            const payouts = highTierData.getMatchPayout(symbol);
            console.log(`Symbol: ${symbol} Payouts: `, payouts);
            const itemNode = this.generateItems(i);
            const itemComponent = itemNode.getComponent(SymbolItemView);
            const symbolData: SymbolItemDataModel = {
                symbolSprite: dataContainer.getSymbolFromWeightedList(symbol),
                payouts: payouts,
                symbolContext: ""
            };
            itemComponent.render(symbolData);
            i++;
        }
        for (const t in lowTierSymbols) {
            const symbol = lowTierSymbols[t];
            const payouts = lowTierData.getMatchPayout(symbol);
            console.log(`Symbol: ${symbol} Payouts: `, payouts);
            const itemNode = this.generateItems(i);
            const itemComponent = itemNode.getComponent(SymbolItemView);
            const symbolData: SymbolItemDataModel = {
                symbolSprite: dataContainer.getSymbolFromWeightedList(symbol),
                payouts: payouts,
                symbolContext: ""
            };
            itemComponent.render(symbolData);
            i++;
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


