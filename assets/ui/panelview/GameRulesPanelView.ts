import { __private, _decorator, Button, Component, Node, Vec3, view } from 'cc';
import { BaseHelpPage } from '../../core/base/BaseHelpPage';
import { IUIView } from '../../core/ui/interface/IUIView';
import { GameRulesButtonView } from './GameRulesButtonView';
import { TweenKey, TweenUtil } from '../../core/utils/TweenUtil';
const { ccclass, property } = _decorator;

@ccclass('GameRulesPanelView')
export class GameRulesPanelView extends Component implements IUIView {

    @property({ type: BaseHelpPage })
    public helpPages: BaseHelpPage[] = [];

    @property(GameRulesButtonView)
    public gameRulesButtonView: GameRulesButtonView = null;

    @property({ type: Button })
    public btnExit: Button = null;


    @property({ type: Node })
    private containerNode: Node;

    public onExitClick: (() => void) | null = null;

    public onItemSelected?: (itemIndex: number) => void;


    public onLoad() {
        this.btnExit.node.on(Button.EventType.CLICK, () => this.onExitClick?.(), this);
    }

    protected onDestroy(): void {
        this.btnExit.node.off(Button.EventType.CLICK, () => this.onExitClick?.(), this);
    }

    render() {
        this.gameRulesButtonView.onItemSelected = (itemIndex: number) => {
            console.log("MenuPanelView :: onItemSelected : ", itemIndex);
            this.onItemSelected?.(itemIndex);
        };
        this.gameRulesButtonView.render();
        this.node.active = true;

        const screenWidth = view.getVisibleSize().width;

        // Start position (off-screen left)
        this.containerNode.setPosition(new Vec3(-screenWidth, 0, 0));

        TweenUtil.playSlideFromLeft(TweenKey.UI_PANEL_POPUP, this.containerNode, this.containerNode.position);
    }

    public showPage(index: number) {
        this.helpPages.forEach((page, i) => {
            if (i === index) {
                page.show();
            } else {
                page.hide();
            }
        });
    }

    hide() {
        this.helpPages.forEach(page => {
            page.hide();
        });
        this.node.active = false;
    }

}

