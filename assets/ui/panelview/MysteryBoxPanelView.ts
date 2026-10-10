import { _decorator, Component, Node, Sprite, Animation, AnimationClip, ParticleSystem2D } from 'cc';
import { IUIView } from '../../core/ui/interface/IUIView';
import { Coroutine } from '../../core/utils/Coroutine';
import { LocalStorageUtil } from '../../core/utils/LocalStorageUtil';
import { GameConstants } from '../../core/utils/GameConstants';
import { AudioKey } from '../../game/audio/AudioKey';
import { AudioService } from '../../game/audio/AudioService';
const { ccclass, property } = _decorator;

@ccclass('MysteryBoxPanelView')
export class MysteryBoxPanelView extends Component implements IUIView {

    @property(Node)
    private mysteryBox: Node;

    @property(Sprite)
    private xpFill: Sprite | null = null;

    private mysteryBoxAnim: Animation | null = null;

    @property(AnimationClip)
    private clipMysteryBoxOpen: AnimationClip | null = null;
    @property(AnimationClip)
    private clipMysteryBoxShake: AnimationClip | null = null;

    @property(ParticleSystem2D)
    private coinCollectionEffect: ParticleSystem2D | null = null;

    @property(ParticleSystem2D)
    private mysteryBoxOpenEffect: ParticleSystem2D | null = null;

    protected onLoad() {
        this.mysteryBoxAnim = this.mysteryBox.getComponent(Animation);
    }

    render(data?: any): void {
        this.node.active = true;
        this.plyayShakeAnimation();

        const savedXP = LocalStorageUtil.getNumber(GameConstants.XP_KEY, 0);
        this.renderXpFill(savedXP);
    }

    async renderXpFill(fillAmount: number): Promise<void> {

        console.log("Rendering XP fill with amount: ", fillAmount);
        if (fillAmount <= 0)
            return;

        let savedXP = LocalStorageUtil.getNumber(GameConstants.XP_KEY, 0);
        console.log("Saved XP: ", savedXP);
        savedXP += fillAmount;

        if (this.xpFill) {
            this.xpFill.fillRange = savedXP; // Assuming 100 XP is the max for full fill, adjust as needed
        }

        LocalStorageUtil.setNumber(GameConstants.XP_KEY, savedXP);
        AudioService.instance.playSFX(AudioKey.COIN_COLLECT);

        // const ps = this.node.getComponentInChildren(ParticleSystem2D);
        if (this.coinCollectionEffect) {
            this.coinCollectionEffect.resetSystem();

            await Coroutine.instance.delay(500);
            this.coinCollectionEffect.stopSystem();
        }

        console.log("Updated XP: ", savedXP);
        if (savedXP >= 1) {
            console.log("Player leveled up! Resetting XP and playing open animation.");
            LocalStorageUtil.setNumber(GameConstants.XP_KEY, 0); // Reset XP for next level
            this.stopAnimations();
            this.playOpenAnimation();
            await Coroutine.instance.delay(200);
            if (this.mysteryBoxOpenEffect) {
                this.mysteryBoxOpenEffect.resetSystem();

                await Coroutine.instance.delay(500);
                this.mysteryBoxOpenEffect.stopSystem();
            }
        }

        await Coroutine.instance.delay(1000);
        this.stopAnimations();
        await Coroutine.instance.delay(100);
        this.plyayShakeAnimation();

        this.xpFill.fillRange = 0; // Reset fill for next level
    }

    playOpenAnimation() {
        if (this.mysteryBoxAnim && this.clipMysteryBoxOpen) {
            console.log("Playing mystery box open animation.");
            const state = this.mysteryBoxAnim?.getState(this.clipMysteryBoxOpen!.name);
            console.log("State:", state);

            state?.play();
        }
    }

    plyayShakeAnimation() {
        if (this.mysteryBoxAnim && this.clipMysteryBoxShake) {
            console.log("Playing mystery box shake animation.");
            const state = this.mysteryBoxAnim?.getState(this.clipMysteryBoxShake!.name);
            console.log("State:", state);

            state?.play();
        }
    }

    stopAnimations() {
        if (this.mysteryBoxAnim) {
            this.mysteryBoxAnim.stop();
        }
    }

    hide(): void {
        this.node.active = false;
        if (this.mysteryBoxAnim) {
            this.mysteryBoxAnim.stop();
        }
    }

    setInteractable?(value: boolean): void {

    }

}

