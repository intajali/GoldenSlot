import { _decorator, Prefab, Node, ScrollView, instantiate } from 'cc';
import { BaseHelpPage } from '../../core/base/BaseHelpPage';
import { PaytableTierEnum } from '../../core/models/PaytableTierEnum';
import { SymbolItemView } from '../itemview/SymbolItemView';
import SymbolItemDataModel from '../model/SymbolItemDataModel';
import { GameManager } from '../../game/manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('SpecialSymbolsHelpPageView')
export class SpecialSymbolsHelpPageView extends BaseHelpPage {

    symbolContexts: Record<string, string> = {
        "SCAT": "SCATTER Symbol : \n - Appears anywhere on the reels. \n - Triggers Free Spins when 3 or more appear.",
        "WILD": "Wild Symbol : \n - Appears anywhere on the reels. \n - Replaces any symbol to form a winning combination.",
        "BONUS": "Bonus Symbol : \n - Provides bonus features with fixed payouts.",
        "JACKPOT": "Jackpot Symbol : \n - Triggers the jackpot feature when 6 or more appear. \n - Offers the chance to win the grand prize."
    }


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
        const specialTier = paytable.getTier(PaytableTierEnum.SPECIAL);
        const specialTierSymbols = specialTier.getSymbols();
        //console.log("Special Tier Symbols: ", specialTierSymbols);
        let i = 0;
        for (const symbol of specialTierSymbols) {
            const payouts = specialTier.getMatchPayout(symbol);
            //console.log(`Symbol: ${symbol}, Payouts: `, payouts);
            const itemNode = this.generateItems(i);
            const itemComponent = itemNode.getComponent(SymbolItemView);

            const symbolData: SymbolItemDataModel = {
                symbolSprite: dataContainer.getSymbolFromWeightedList(symbol),
                payouts: payouts,
                symbolContext: this.symbolContexts[symbol]
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



