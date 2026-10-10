// FrontPanelView.ts
// Manages the front panel UI
// Displays credit, total bet, and win meters
// Updates UI elements based on game events

import { _decorator, Button, Component, Label, Node, Animation, AnimationClip, toDegree } from 'cc';
import { IUIView } from '../../core/ui/interface/IUIView';
import { AudioService } from '../../game/audio/AudioService';
import { AudioKey } from '../../game/audio/AudioKey';
import { MysteryBoxPanelView } from './MysteryBoxPanelView';
const { ccclass, property } = _decorator;

@ccclass('FrontPanelView')
export class FrontPanelView extends Component implements IUIView {

    // Buttons  
    @property({ type: Button })
    private btnSpin: Button = null;

    @property({ type: Button })
    private btnGameMenu: Button = null;

    @property({ type: Button })
    private btnAutoSpin: Button = null;

    @property({ type: Button })
    private btnMaxBet: Button = null;

    @property({ type: Button })
    public btnBetIncrease: Button = null;
    @property({ type: Button })
    public btnBetDecrease: Button = null;

    @property({ type: Button })
    private btnBetMultiplierIncrease: Button = null;

    @property({ type: Button })
    private btnBetMultiplierDecrease: Button = null;

    // Meters

    @property({ type: Label })
    private lbCreditMeter: Label = null;

    @property({ type: Label })
    private lbBetMeter: Label = null;

    @property({ type: Label })
    private lbTotalBet: Label = null;

    @property({ type: Label })
    private lbWinMeter: Label = null;

    @property({ type: Label })
    private lbBetMultiplier: Label = null;

    //
    @property({ type: Node })
    private autoSpinNode: Node = null;

    @property({ type: Button })
    private btnStopAutoSpin: Button = null;

    @property({ type: Label })
    private lbSpinLeft: Label = null;

    @property({ type: AnimationClip })
    private spinButtonAnimClip: AnimationClip = null;

    @property({ type: AnimationClip })
    private btnClickAnimClip: AnimationClip = null;

    //Views

    @property(MysteryBoxPanelView)
    private mysteryBoxPanelView: MysteryBoxPanelView = null;

    public onMaxButtonClicked?: () => void;
    public onSpinButtonClicked?: () => void;
    public onGameMenuButtonClicked?: () => void;
    public onAutoSpinButtonClicked?: () => void;
    public onStopAutoSpinButtonClicked?: () => void;



    public onIncreaseClicked?: () => void;
    public onDecreaseClicked?: () => void;
    public onIncreaseMultiplierClicked?: () => void;
    public onDecreaseMultiplierClicked?: () => void;

    public onDenomChangeClicked?: () => void;


    private allButtons: Button[] = [];

    private spinButtonAnim: Animation = null;


    render(): void {
        this.mysteryBoxPanelView.render();
        this.node.active = true;
    }


    protected onLoad(): void {
        this.spinButtonAnim = this.btnSpin.node.getComponent(Animation);
        this.renderWinMeter(0);
        this.cacheButtons();
        this.addListeners();
    }

    hide(): void {
        this.mysteryBoxPanelView.hide();
        this.node.active = false;
    }

    private addListeners() {
        this.btnSpin.node.on(Button.EventType.CLICK, this.onSpinClicked, this);
        this.btnGameMenu.node.on(Button.EventType.CLICK, this.onMenuClicked, this);
        this.btnMaxBet.node.on(Button.EventType.CLICK, this.onMaxClicked, this);
        this.btnAutoSpin.node.on(Button.EventType.CLICK, this.onAutoSpinClicked, this);
        this.btnStopAutoSpin.node.on(Button.EventType.CLICK, this.onStopAutoSpinClicked, this);

        this.btnBetIncrease.node.on(Button.EventType.CLICK, this.onBetIncreaseClicked, this);
        this.btnBetDecrease.node.on(Button.EventType.CLICK, this.onBetDecreaseClicked, this);
        this.btnBetMultiplierIncrease.node.on(Button.EventType.CLICK, this.onMultiplierincreaseClicked, this);
        this.btnBetMultiplierDecrease.node.on(Button.EventType.CLICK, this.onMultiplierDescreaseClicked, this);
    }

    private onSpinClicked() {
        this.playButtonClickAnimation(this.btnSpin);
        this.onSpinButtonClicked?.();
    }

    private onMaxClicked() {
        this.playButtonClickAnimation(this.btnMaxBet);
        this.onMaxButtonClicked?.();
    }

    private onMenuClicked() {
        this.onGameMenuButtonClicked?.();
        this.playButtonClickAnimation(this.btnGameMenu);
    }

    private onAutoSpinClicked() {
        this.playButtonClickAnimation(this.btnAutoSpin);
        this.onAutoSpinButtonClicked?.();
    }

    private onBetIncreaseClicked() {
        this.playButtonClickSound();
        this.onIncreaseClicked?.();
    }

    private onBetDecreaseClicked() {
        this.playButtonClickSound();
        this.onDecreaseClicked?.()
    }

    private onMultiplierincreaseClicked() {
        this.playButtonClickSound();
        this.onIncreaseMultiplierClicked?.()
    }

    private onMultiplierDescreaseClicked() {
        this.playButtonClickSound();
        this.onDecreaseMultiplierClicked?.()
    }

    renderAutoSpinButtonView(status: boolean) {
        this.autoSpinNode.active = status;
        this.btnAutoSpin.interactable = !status;
    }

    public onStopAutoSpinClicked() {
        this.onStopAutoSpinButtonClicked?.();
        this.onDisableAutoSpin();

    }

    public onDisableAutoSpin() {
        this.renderAutoSpinCounter(0);
        this.renderAutoSpinButtonView(false);
    }

    private cacheButtons(): void {
        this.allButtons = [this.btnSpin, this.btnGameMenu, this.btnMaxBet, this.btnAutoSpin,
        this.btnBetIncrease, this.btnBetDecrease,
        this.btnBetMultiplierIncrease, this.btnBetMultiplierDecrease];
    }

    onCreditChanged(balance: number): void {
        if (this.lbCreditMeter) {
            this.lbCreditMeter.string = `$${balance.toFixed(2)}`;
        }
    }

    renderBetMeter(bet: number, multiplier: number, totalBet: number): void {
        if (this.lbBetMeter) {
            this.lbBetMeter.string = `${bet}`;
        }
        if (this.lbTotalBet) {
            this.lbTotalBet.string = `${totalBet.toFixed(2)}`;
        }
        if (this.lbBetMultiplier) {
            this.lbBetMultiplier.string = `x${multiplier}`;
        }
    }

    renderWinMeter(amount: number) {
        if (this.lbWinMeter) {
            this.lbWinMeter.string = `${amount} `;
        }
    }

    renderAutoSpinCounter(spinsLeft: number) {
        if (this.lbSpinLeft) {
            this.lbSpinLeft.string = `SPIN ${spinsLeft} `;
        }
    }

    updateGameXP(xp: number) {
        // Implement XP update logic here (e.g., update an XP bar or label)
        this.mysteryBoxPanelView.renderXpFill(xp / 100); // Assuming 100 XP needed for a level up, adjust as necessary
    }

    public setInteractable(flag: boolean) {
        console.log(`Setting FrontPanelView buttons interactable: ${flag}`);
        this.allButtons.forEach((button) => {
            button.interactable = flag;
        });
        if (flag) {
            this.playSpinButtonAnimation();
        } else {
            if (this.spinButtonAnim) {
                this.spinButtonAnim.stop();
            }
        }
    }

    protected onDestroy(): void {
        this.removeListeners();
    }

    private removeListeners() {
        this.btnSpin.node.off(Button.EventType.CLICK, this.onSpinClicked, this);
        this.btnGameMenu.node.off(Button.EventType.CLICK, this.onMenuClicked, this);
        this.btnMaxBet.node.off(Button.EventType.CLICK, this.onMaxClicked, this);
        this.btnAutoSpin.node.off(Button.EventType.CLICK, this.onAutoSpinClicked, this);
        this.btnStopAutoSpin.node.off(Button.EventType.CLICK, this.onStopAutoSpinClicked, this);

        this.btnBetIncrease.node.off(Button.EventType.CLICK, () => this.onIncreaseClicked?.(), this);
        this.btnBetDecrease.node.off(Button.EventType.CLICK, () => this.onDecreaseClicked?.(), this);
        this.btnBetMultiplierIncrease.node.off(Button.EventType.CLICK, () => this.onIncreaseMultiplierClicked?.(), this);
        this.btnBetMultiplierDecrease.node.off(Button.EventType.CLICK, () => this.onDecreaseMultiplierClicked?.(), this);
    }

    private playButtonClickSound() {
        // Implement sound playing logic here
        AudioService.instance.playSFX(AudioKey.BTN_CLICK);
    }

    private playButtonClickAnimation(button: Button) {
        // Implement button click animation logic here
        const anim = button.node.getComponent(Animation)
        if (anim) {
            if (!anim.getState(this.btnClickAnimClip.name)) {
                this.spinButtonAnim.addClip(this.btnClickAnimClip);
            }
            anim.stop();
            anim.play(this.btnClickAnimClip.name);
        }

        this.playButtonClickSound();
    }

    private playSpinButtonAnimation() {
        if (this.spinButtonAnim && this.spinButtonAnimClip) {
            if (!this.spinButtonAnim.getState(this.spinButtonAnimClip.name)) {
                this.spinButtonAnim.addClip(this.spinButtonAnimClip);
            }
            this.spinButtonAnim.stop();
            this.spinButtonAnim.play(this.spinButtonAnimClip.name);
        }
    }

}

