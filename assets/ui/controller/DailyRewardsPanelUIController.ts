import { _decorator } from 'cc';
import { DailyRewardsPanelView } from '../panelview/DailyRewardsPanelView';
import { BaseUIController } from '../../core/base/BaseUIController';
import { eventBus } from '../../core/events/EventBus';
import { GameEvent } from '../../core/events/GameEvent';
import { GameConstants } from '../../core/utils/GameConstants';
import { LocalStorageUtil } from '../../core/utils/LocalStorageUtil';
const { ccclass, property } = _decorator;

export class DailyRewardState {
    currentDay: number = 1;
    lastClaimDate: string = "";

}

@ccclass('DailyRewardsPanelUIController')
export class DailyRewardsPanelUIController extends BaseUIController<DailyRewardsPanelView> {

    private userCurrentCredit: number = 0;
    private rewardState: DailyRewardState;

    init(): void {
        this.rewardState = this.loadRewardState();
        this.validateStreak();
        this.bindViewIntents();
        this.bindSystemEvents();
        this.enable();
    }

    bindViewIntents(): void {
        this.view.onItemClaimed = (data) => {

            this.rewardState = this.loadRewardState();
            const today = this.getToday();
            // Give reward
            this.userCurrentCredit += data.amount;
            this.view.renderCreditMeter(this.userCurrentCredit);

            // Mark today claimed
            this.rewardState.lastClaimDate = today;

            this.saveRewardState(this.rewardState);

            eventBus.emit(GameEvent.DAILY_REWARD_CLAIMED, data.amount);

            this.view.render(this.rewardState);
            // Handle the claimed reward logic here, e.g., update player's rewards, show a confirmation, etc.
        };

        this.view.onCloseButtonClicked = () => {
            console.log("Daily Rewards Close button clicked");
            this.view.hide();
        };
    }



    bindSystemEvents(): void {
        eventBus.on(GameEvent.CONFIG_LOADED, this.onConfigLoaded, this);
    }

    onConfigLoaded(data: any): void {
        // console.log("LoadingPanelUIController received CONFIG_LOADED event with data: ", data);
        this.userCurrentCredit = data.balance || 0;
        this.view.renderCreditMeter(this.userCurrentCredit);
    }

    unbindSystemEvents(): void {
        eventBus.off(GameEvent.CONFIG_LOADED, this.onConfigLoaded, this);
    }

    private validateStreak() {

        const today = this.getToday();

        if (!this.rewardState.lastClaimDate) {
            return; // First open → Day 1 active
        }

        const lastDate = new Date(this.rewardState.lastClaimDate);
        const currentDate = new Date(today);

        const diffTime = currentDate.getTime() - lastDate.getTime();
        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) {
            // Same day → do nothing
            return;
        }

        if (diffDays === 1) {
            // New day → move to next reward
            if (this.rewardState.currentDay < 7) {
                this.rewardState.currentDay++;
            } else {
                this.rewardState.currentDay = 1;
            }

            return;
        }

        // Missed more than 1 day → reset
        this.rewardState.currentDay = 1;
        this.rewardState.lastClaimDate = "";
        this.saveRewardState(this.rewardState);
    }


    private validateStreak1() {
        const today = this.getToday();

        if (!this.rewardState.lastClaimDate) {
            return;
        }

        const lastDate = new Date(this.rewardState.lastClaimDate);
        const currentDate = new Date(today);

        const diffTime = currentDate.getTime() - lastDate.getTime();
        let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        //diffDays = 1;
        if (diffDays === 0) {
            // Already claimed today → do nothing
            return;
        }

        if (diffDays === 1) {
            // Valid next day → continue streak
            this.rewardState.currentDay++;
            return;
        }

        // Missed a day OR more → RESET
        this.rewardState.currentDay = 1;
        this.rewardState.lastClaimDate = "";
        this.saveRewardState(this.rewardState);
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

    saveRewardState(state: DailyRewardState): void {
        LocalStorageUtil.setObject(GameConstants.DAILY_REWARD_KEY, JSON.stringify(state));
    }

    getToday(): string {
        return new Date().toISOString().split('T')[0];
    }


    show(): void {
        this.view.render(this.rewardState);
    }

    hide(): void {
        this.view.hide();
    }

}

