import { _decorator, Button, Component, view, Vec3, Node } from 'cc';
import { IUIView } from '../../core/ui/interface/IUIView';
import { TweenKey, TweenUtil } from '../../core/utils/TweenUtil';
const { ccclass, property } = _decorator;

@ccclass('MenuPanelView')
export class MenuPanelView extends Component implements IUIView {

    @property({ type: Button })
    private btnGameRules: Button;

    @property({ type: Button })
    private btnSettings: Button;

    @property({ type: Button })
    private btnTestMode: Button;

    @property({ type: Button })
    private btnExit: Button;


    @property({ type: Node })
    private contanierNode: Node;

    public onGameRulesClicked?: () => void;
    public onSettingsClicked?: () => void;
    public onTestModeClicked?: () => void;
    public onExitClicked?: () => void;

    protected onLoad(): void {
        this.btnGameRules.node.on(Button.EventType.CLICK, () => this.onGameRulesClicked?.(), this);
        this.btnSettings.node.on(Button.EventType.CLICK, () => this.onSettingsClicked?.(), this);
        this.btnTestMode.node.on(Button.EventType.CLICK, () => this.onTestModeClicked?.(), this);
        this.btnExit.node.on(Button.EventType.CLICK, () => this.onExitClicked?.(), this);
    }

    render(data?: any): void {

        // Get screen width
        this.node.active = true;
        const screenWidth = view.getVisibleSize().width;

        // Start position (off-screen left)
        this.contanierNode.setPosition(new Vec3(-screenWidth, 0, 0));

        TweenUtil.playSlideFromLeft(TweenKey.UI_PANEL_POPUP, this.contanierNode, this.contanierNode.position);
    }
    hide(): void {
        this.node.active = false;
    }
    setInteractable?(value: boolean): void {

    }

    protected onDestroy(): void {
        this.btnGameRules.node.off(Button.EventType.CLICK, () => this.onGameRulesClicked?.(), this);
        this.btnSettings.node.off(Button.EventType.CLICK, () => this.onSettingsClicked?.(), this);
        this.btnTestMode.node.off(Button.EventType.CLICK, () => this.onTestModeClicked?.(), this);
        this.btnExit.node.off(Button.EventType.CLICK, () => this.onExitClicked?.(), this);
    }



}

