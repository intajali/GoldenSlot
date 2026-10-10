import { _decorator, Component, Node, Prefab, ScrollView, instantiate, Button, Label, tween, Vec3, UITransform, view, ParticleSystem2D } from 'cc';
import { IUIView } from '../../core/ui/interface/IUIView';
import { RewardItemView } from '../itemview/RewardItemView';
import { DailyRewardsDataModel } from '../model/DailyRewardsDataModel';
import { LocalStorageUtil } from '../../core/utils/LocalStorageUtil';
import { GameConstants } from '../../core/utils/GameConstants';
import { DailyRewardState } from '../controller/DailyRewardsPanelUIController';
import { AudioService } from '../../game/audio/AudioService';
import { AudioKey } from '../../game/audio/AudioKey';
import { TweenKey, TweenUtil } from '../../core/utils/TweenUtil';
import { eventBus } from '../../core/events/EventBus';
import { GameEvent } from '../../core/events/GameEvent';
import { Coroutine } from '../../core/utils/Coroutine';
const { ccclass, property } = _decorator;

@ccclass('DailyRewardsPanelView')
export class DailyRewardsPanelView extends Component implements IUIView {

    @property({ type: Prefab })
    public itemPrefab: Prefab = null;

    @property({ type: Node })
    public contentParent: Node = null;

    @property({ type: Button })
    private btnClose: Button;

    @property({ type: Label })
    private lbCreditMeter: Label;

    @property({ type: Node })
    private targetNode: Node;

    @property({ type: Node })
    private coinNode: Node;

    @property({ type: Node })
    private containerNode: Node;

    @property({ type: Node })
    private creditMeterNode: Node;

    public onItemClaimed?: (data: DailyRewardsDataModel) => void;

    public onCloseButtonClicked?: () => void;

    private generatedItems: Node[] = [];

    private scrollView: ScrollView;

    private amount: number = 100;

    private isNodeActive: boolean = false;

    protected onLoad(): void {
        this.btnClose.node.on(Button.EventType.CLICK, () => this.onCloseButtonClicked?.(), this);
    }

    render(state: DailyRewardState): void {

        const today = this.getToday();
        this.coinNode.active = false;

        this.resetScroll();

        for (let i = 0; i < 7; i++) {

            const day = i + 1;
            const itemNode = this.generateRulesItems(i);
            const itemComponent = itemNode.getComponent(RewardItemView);

            let isClaimed = false;
            let isLocked = true;

            // 🔹 Already claimed previous days
            if (day < state.currentDay) {
                isClaimed = true;
                isLocked = false;
            }

            // 🔹 Today’s reward
            else if (day === state.currentDay) {

                if (state.lastClaimDate === today) {
                    // Already claimed today
                    isClaimed = true;
                    isLocked = false;
                    eventBus.emit(GameEvent.START_REWARDS_TIMER);
                } else {
                    // Can claim today
                    isClaimed = false;
                    isLocked = false;
                }
            }

            // 🔹 Future days
            else {
                isClaimed = false;
                isLocked = true;
            }

            itemComponent.render(
                new DailyRewardsDataModel(
                    this.amount * day,
                    isClaimed,
                    isLocked,
                    day,
                    state.lastClaimDate
                )
            );

            itemComponent.onItemClicked = (data, coinPos) => {

                if (isLocked || isClaimed) return;

                this.scheduleOnce(() => {
                    this.transformCoinToTargetNode(coinPos);
                }, 0);

                this.onItemClaimed?.(data);
            };
        }

        this.node.active = true;

        if (this.isNodeActive) {
            return;
        }
        const screenWidth = view.getVisibleSize().width;
        const screenHeight = view.getVisibleSize().height;

        // Start position (off-screen left)
        this.containerNode.setPosition(new Vec3(-screenWidth, 0, 0));
        this.creditMeterNode.setPosition(new Vec3(0, screenHeight / 2, 0));

        TweenUtil.playSlideFromLeft(TweenKey.UI_PANEL_POPUP, this.containerNode, this.containerNode.position, new Vec3(-40, 0, 0));
        TweenUtil.playSlideToBottom(TweenKey.UI_DOWN, this.creditMeterNode, this.creditMeterNode.position);
        this.isNodeActive = true;
    }

    protected resetScroll(): void {
        this.scrollView = this.node.getComponentInChildren(ScrollView);
        if (this.scrollView) {
            this.scrollView.scrollToLeft(0);
        }
    }

    claimReward(data: DailyRewardsDataModel): void {
        if (data.canClaimToday()) {
            data.updateClaimDate();
            LocalStorageUtil.setString(GameConstants.DAILY_REWARD_KEY, { currentDay: data.day, claimDate: data.lastClaimDate }.toString());
            // Disable further claiming for today
            this.onItemClaimed?.(data);
        } else {
            console.log("You have already claimed today's reward.");
        }
    }

    renderCreditMeter(amount: number): void {
        if (this.lbCreditMeter)
            this.lbCreditMeter.string = `$${amount.toFixed(2)}`;
    }

    hide(): void {
        this.isNodeActive = false;
        this.node.active = false;
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

    transformCoinToTargetNode(coinWorldPos: Vec3): void {
        this.coinNode.active = true;

        // wait 1 frame so layout/world matrices update
        this.scheduleOnce(() => {
            const parentUI = this.coinNode.parent!.getComponent(UITransform)!;

            const startLocal = parentUI.convertToNodeSpaceAR(coinWorldPos);
            const targetLocal = parentUI.convertToNodeSpaceAR(this.targetNode.worldPosition);

            this.coinNode.setPosition(startLocal);
            this.coinNode.active = true;
            // stop any previous tween
            tween(this.coinNode).stop();
            AudioService.instance.playSFX(AudioKey.COIN_COLLECT);

            tween(this.coinNode)
                .to(0.8, { position: new Vec3(targetLocal.x, targetLocal.y, 0) }, { easing: 'quadIn' })
                .call(async () => {
                    this.coinNode.active = false;
                    const ps = this.creditMeterNode.getComponentInChildren(ParticleSystem2D);
                    if (ps) {
                        ps.resetSystem();
                    }
                    await Coroutine.instance.delay(500);
                    ps.stopSystem();

                })
                .start();

        }, 0);
    }

    getToday(): string {
        return new Date().toISOString().split('T')[0];
    }

    protected onDestroy(): void {

        this.btnClose.node.off(Button.EventType.CLICK, () => this.onCloseButtonClicked?.(), this);
    }



}




