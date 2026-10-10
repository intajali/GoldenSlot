import { _decorator, instantiate, Node, Prefab, ScrollView } from 'cc';
import { BaseHelpPage } from '../../core/base/BaseHelpPage';
import { JACKPOT_CONFIG } from '../../game/jackpot/JackpotConfig';
import { SymbolItemView } from '../itemview/SymbolItemView';
import SymbolItemDataModel from '../model/SymbolItemDataModel';
import { GameManager } from '../../game/manager/GameManager';
import { PaytableTierEnum } from '../../core/models/PaytableTierEnum';
const { ccclass, property } = _decorator;

@ccclass('JackpotSymbolsHelpPageView')
export class JackpotSymbolsHelpPageView extends BaseHelpPage {

    symbolContexts: Record<string, string> = {
        "MINI": "MINI Symbol : \n - Provides special jackpot bonus value when matched. \n - Typically the smallest jackpot tier.",
        "MINOR": "MINOR Symbol : \n - Provides special jackpot bonus value when matched. \n - Usually a mid-level jackpot tier.",
        "MAJOR": "MAJOR Symbol : \n - Provides special jackpot bonus value when matched. \n - Generally a high-value jackpot tier.",
        "GRAND": "GRAND Symbol : \n - Provides special jackpot bonus value when matched. \n - Often the highest jackpot tier available.",
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
        const specialTier = paytable.getTier(PaytableTierEnum.JACKPOT);
        const jackpotTierSymbols = specialTier.getSymbols();

        //console.log(`jackpotTierSymbols: ${JSON.stringify(jackpotTierSymbols)}`);

        for (let i = 0; i < jackpotTierSymbols.length; i++) {
            const symbol = jackpotTierSymbols[i];
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
        }

    }
    protected onHide(): void {

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

}



