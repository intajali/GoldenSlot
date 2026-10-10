import { UI } from "cc";
import { BaseUIController } from "../../core/base/BaseUIController";
import { UIControllerToken } from "../../core/base/UIControllerToken";
import { commandBus } from "../../core/events/CommandBus";
import { eventBus } from "../../core/events/EventBus";
import { GameCommand } from "../../core/events/GameCommand";
import { GameEvent } from "../../core/events/GameEvent";
import { BetDataModel } from "../../core/models/BetDataModel";
import { WinCounter } from "../../core/utils/WinCounter";
import { UIController } from "../manager/UIController";
import { FrontPanelView } from "../panelview/FrontPanelView";

export class FrontPanelUIController extends BaseUIController<FrontPanelView> {

    private winCounter = new WinCounter();

    private fixedXPPerWin = 0.05; // 5% fixed XP per win, can be adjusted or made dynamic

    init(): void {

        this.bindSystemEvents();
        this.bindViewIntents();
        this.enable();
        this.show();
    }

    show(): void {
        this.view.render();
    }

    hide(): void {
        this.unbindSystemEvents();
    }

    enable(): void {
        console.log("Enabling FrontPanelUIController");
        super.enable();
    }

    bindSystemEvents(): void {
        eventBus.on(GameEvent.WIN_UPDATED, this.onWin, this);
        eventBus.on(GameEvent.BET_CHANGED, this.onBet, this);
        eventBus.on(GameEvent.CREDIT_CHANGED, this.onCredit, this);
        eventBus.on(GameEvent.AUTO_SPIN_COUNTER_UPDATED, this.onAutoSpinCounterUpdated, this);
        eventBus.on(GameEvent.AUTO_SPIN_STARTED, this.onAutoSpinStarted, this);
        eventBus.on(GameEvent.AUTO_SPIN_STOPPED, this.onAutoSpinStopped, this);
    }


    private bindViewIntents(): void {
        this.view.onSpinButtonClicked = () => {
            this.disable();
            commandBus.execute(GameCommand.SPIN);
        }

        this.view.onGameMenuButtonClicked = () => {
            //commandBus.execute(GameCommand.MENU_BUTTON);
            UIController.instance.show(UIControllerToken.MENU_PANEL);
        }
        this.view.onMaxButtonClicked = () => {
            commandBus.execute(GameCommand.BET_MAX);
        }

        this.view.onAutoSpinButtonClicked = () => {
            //commandBus.execute(GameCommand.AUTO_SPIN);
            UIController.instance.show(UIControllerToken.AUTO_SPIN_PANEL);
        }

        // this.view.onSettingsButtonClicked = () => {
        //     UIController.instance.show(UIControllerToken.SETTINGS_PANEL);
        // }

        this.view.onStopAutoSpinButtonClicked = () => {
            commandBus.execute(GameCommand.STOP_AUTO_SPIN);
        }

        this.view.onIncreaseClicked = () => {
            commandBus.execute(GameCommand.BET_INCREASE);
        };

        this.view.onDecreaseClicked = () => {
            commandBus.execute(GameCommand.BET_DECREASE);
        };

        this.view.onIncreaseMultiplierClicked = () => {
            commandBus.execute(GameCommand.MULTIPLIER_INCREASE);
        };

        this.view.onDecreaseMultiplierClicked = () => {
            commandBus.execute(GameCommand.MULTIPLIER_DECREASE);
        };
    }

    unbindSystemEvents(): void {
        eventBus.off(GameEvent.WIN_UPDATED, this.onWin, this);
        eventBus.off(GameEvent.BET_CHANGED, this.onBet, this);
        eventBus.off(GameEvent.CREDIT_CHANGED, this.onCredit, this);
        eventBus.off(GameEvent.AUTO_SPIN_COUNTER_UPDATED, this.onAutoSpinCounterUpdated, this);
        eventBus.off(GameEvent.AUTO_SPIN_STARTED, this.onAutoSpinStarted, this);
        eventBus.off(GameEvent.AUTO_SPIN_STOPPED, this.onAutoSpinStopped, this);
    }

    private onCredit(balance: number): void {
        this.view.onCreditChanged(balance);
    }

    private onBet(betData: BetDataModel): void {
        this.view.renderBetMeter(betData.betAmount, betData.multiplier, betData.total);
    }

    private onWin(winAmount: number): void {
        console.log(`FrontPanelUIController received WIN_UPDATED event with amount: $${winAmount}`);
        eventBus.emit(GameEvent.WIN_SNAPPED_DONE, false);
        if (winAmount <= 0) {
            this.view.renderWinMeter(0);
        }

        this.view.updateGameXP(winAmount * this.fixedXPPerWin); // Example: fixed XP per win

        this.winCounter.start(
            0,
            winAmount,
            2000,
            (v: number) => {
                this.view.renderWinMeter(v);
            },
            () => {
                eventBus.emit(GameEvent.WIN_SNAPPED_DONE, true);
                console.log("FreeSpinCounterViewUIController - Win counter completed");
            }
        );
    }

    onAutoSpinStarted(spinCount: number): void {
        this.view.renderAutoSpinCounter(spinCount);
        this.view.renderAutoSpinButtonView(true);
        this.disable();
    }

    onAutoSpinStopped(): void {
        this.view.onStopAutoSpinClicked();
    }

    private onAutoSpinCounterUpdated(spinsLeft: number): void {
        this.view.renderAutoSpinCounter(spinsLeft);
    }
}

