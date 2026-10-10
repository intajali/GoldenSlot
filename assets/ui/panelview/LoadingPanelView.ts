import { __private, _decorator, Button, Color, Component, Label, Node, Sprite, tween, Vec3, view, Animation } from 'cc';
import { IUIView } from '../../core/ui/interface/IUIView';
import { TweenKey, TweenUtil } from '../../core/utils/TweenUtil';
import { AudioService } from '../../game/audio/AudioService';
import { AudioKey } from '../../game/audio/AudioKey';
import { UIController } from '../manager/UIController';
import { UIControllerToken } from '../../core/base/UIControllerToken';
import { GameEvent } from '../../core/events/GameEvent';
import { eventBus } from '../../core/events/EventBus';
import { GameConstants } from '../../core/utils/GameConstants';
import { LocalStorageUtil } from '../../core/utils/LocalStorageUtil';
import { DailyRewardState } from '../controller/DailyRewardsPanelUIController';
import { Coroutine } from '../../core/utils/Coroutine';
const { ccclass, property } = _decorator;

@ccclass('LoadingPanelView')
export class LoadingPanelView extends Component implements IUIView {

    @property({ type: Sprite })
    private loadingImage: Sprite;

    @property({ type: Label })
    private lbLoadingProgress: Label;

    //After Loading
    @property({ type: Button })
    private btnStart: Button;

    @property({ type: Button })
    private btnDailyRewards: Button;

    @property({ type: Label })
    private lbUserCredit: Label;

    @property({ type: Node })
    private loadingPanelnode: Node;

    @property({ type: Node })
    private afterLoadingNode: Node;

    @property({ type: Node })
    private creditMeterNode: Node;

    @property({ type: Node })
    private dailyRewardNode: Node;

    @property(Label)
    private lbTimer: Label = null;

    @property(Animation)
    private rewardAnim: Animation;

    public onStartButtonAction?: () => void;
    public onCompleteLoadingAction?: () => void;
    public onTimerEndAction?: () => void;

    private rewardState: DailyRewardState;

    protected onLoad(): void {
        LocalStorageUtil.clear();
        this.btnStart.node.on(Button.EventType.CLICK, this.onStartClick, this);
        this.btnDailyRewards.node.on(Button.EventType.CLICK, this.onDailyRewardsClick, this);
        eventBus.on(GameEvent.CREDIT_CHANGED, this.onCredit, this);
        eventBus.on(GameEvent.START_REWARDS_TIMER, this.onStartRewardsTimer, this);
    }

    onStartRewardsTimer() {
        if (this.rewardAnim) {
            this.rewardAnim.stop();
        }
        const nextResetTime = this.getNextResetTime();
        this.startCountdown(nextResetTime);
    }

    onDailyRewardsClick() {
        AudioService.instance.playSFX(AudioKey.BTN_CLICK);
        UIController.instance.show(UIControllerToken.DAILY_REWARDS_PANEL);
    }

    onStartClick() {
        AudioService.instance.playSFX(AudioKey.BTN_CLICK);
        this.loadingPanelnode.active = false;
        this.afterLoadingNode.active = false;
        this.onStartButtonAction?.();
    }

    render(): void {

        this.rewardState = this.loadRewardState();

        this.loadingPanelnode.active = true;
        this.afterLoadingNode.active = false;
        this.node.active = true;

        TweenUtil.animateFillAsync(TweenKey.SYSTEM, this.loadingImage, 5, (progress: number) => {
            this.loadingFilling(progress * 100);
        }, () => {
            this.onCompleteLoading();
        });
    }

    onCompleteLoading(): void {
        console.log("Loading Complete");
        TweenUtil.stopByKey(TweenKey.SYSTEM);
        this.loadingPanelnode.active = false;
        this.afterLoadingNode.active = true;
        this.onCompleteLoadingAction?.();
        this.validateStreak();

        const screenHeight = view.getVisibleSize().height;

        // Start position (off-screen left)
        this.creditMeterNode.setPosition(new Vec3(0, screenHeight / 2, 0));
        this.dailyRewardNode.setPosition(new Vec3(0, screenHeight / 2, 0));

        TweenUtil.playSlideToBottom(TweenKey.UI_PANEL_POPUP, this.dailyRewardNode, this.dailyRewardNode.position);
        TweenUtil.playSlideToBottom(TweenKey.UI_DOWN, this.creditMeterNode, this.creditMeterNode.position);

    }

    playReadyAnimation() {

        tween(this.dailyRewardNode)
            .repeatForever(
                tween()
                    .to(0.5, { scale: new Vec3(1.1, 1.1, 1) })
                    .to(0.5, { scale: new Vec3(1, 1, 1) })
            )
            .start();
    }

    onCredit(balance: number): void {
        this.renderUserCredit(balance);
    }

    renderUserCredit(credit: number): void {
        this.lbUserCredit.string = `$${credit.toFixed(2)}`;
    }

    loadingFilling(percent: number): void {
        // Assuming the loading image is a filled sprite, we can set its fill range based on the percentage
        this.loadingImage.fillRange = percent / 100; // Convert percentage to a value between 0 and 1
        this.lbLoadingProgress.string = `${Math.floor(percent)}%`;
    }

    startCountdown(endTime: number) {

        this.unscheduleAllCallbacks();

        this.schedule(() => {

            const now = Date.now();
            const remaining = endTime - now;

            if (remaining <= 0) {
                this.lbTimer.node.active = false;
                this.unscheduleAllCallbacks();
                this.onTimerEndAction?.();
                this.validateStreak();
                return;
            }
            this.lbTimer.color = Color.WHITE;
            this.lbTimer.node.active = true;
            this.lbTimer.string = this.formatTime(remaining);


        }, 1);
    }

    private formatTime(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    }

    private pad(num: number): string {
        return num < 10 ? `0${num}` : `${num}`;
    }

    private getNextResetTime(): number {

        const next = new Date();

        // UTC Midnight Reset
        next.setUTCHours(24, 0, 0, 0);

        return next.getTime();
    }

    private async validateStreak() {

        const today = this.getToday();

        const lastDate = new Date(this.rewardState.lastClaimDate);
        const currentDate = new Date(today);

        const diffTime = currentDate.getTime() - lastDate.getTime();
        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
            // Same day → do nothing
            this.rewardAnim.stop();
            this.startCountdown(this.getNextResetTime());
            return;
        }

        console.log("Claim now");
        this.lbTimer.node.active = true;
        this.lbTimer.color = Color.GREEN;
        this.lbTimer.string = "CLAIM NOW!";

        if (this.rewardAnim) {
            this.rewardAnim.stop();
            await Coroutine.instance.delay(1000);
            console.log("Play reward animation");
            this.rewardAnim.play();
        }
    }

    loadRewardState(): DailyRewardState {
        const storedData = LocalStorageUtil.getObject(GameConstants.DAILY_REWARD_KEY, '');
        if (!storedData) {
            return {
                currentDay: 1,
                lastClaimDate: ""
            };
        }
        return JSON.parse(storedData);
    }

    getToday(): string {
        return new Date().toISOString().split('T')[0];
    }

    hide(): void {
        this.node.active = false;
    }

    protected onDestroy(): void {
        this.btnStart.node.off(Button.EventType.CLICK, this.onStartClick, this);
        this.btnDailyRewards.node.off(Button.EventType.CLICK, this.onDailyRewardsClick, this);
        eventBus.off(GameEvent.CREDIT_CHANGED, this.onCredit, this);
        eventBus.off(GameEvent.START_REWARDS_TIMER, this.onStartRewardsTimer, this);
    }

}

