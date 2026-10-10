import { _decorator, Node, Prefab, instantiate, ScrollView } from 'cc';
import { BaseHelpPage } from '../../core/base/BaseHelpPage';
import { GameRuleItemView } from '../itemview/GameRuleItemView';
const { ccclass, property } = _decorator;

@ccclass('GameRulesHelpPageView')
export class GameRulesHelpPageView extends BaseHelpPage {

    private gameRuleContext: string[] = [
        "1. All bets are placed per spin.",
        "2. The Total Bet is shown on the game interface.",
        "3. Bets cannot be changed during an active spin.",
        "4. Wins are evaluated from left to right, starting from the leftmost reel.",
        "5. Only consecutive symbols count toward a win.",
        "6. All wins from the same spin are added together.",
        "7. Winning combinations are formed by matching symbols on consecutive reels.",
        "8. Winning combinations must follow an active payline.",
        "9. Only the highest win per payline is paid.",
        "10. Multipliers increase the value of winning combinations."
    ];

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
        for (let i = 0; i < this.gameRuleContext.length; i++) {
            const ruleText = this.gameRuleContext[i];

            const itemNode = this.generateRulesItems(i);

            const itemComponent = itemNode.getComponent(GameRuleItemView);
            if (itemComponent) {
                itemComponent.render(ruleText);
            }
        }

    }

    protected onHide(): void {
        this.generatedItems.forEach(t => {
            t.active = false;
        });
    }

    generateRulesItems(index: number): Node {

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

