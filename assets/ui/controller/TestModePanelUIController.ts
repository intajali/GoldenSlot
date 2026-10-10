import { _decorator, Component, Node } from 'cc';
import { BaseUIController } from '../../core/base/BaseUIController';
import { TestModePanelView } from '../panelview/TestModePanelView';
import { GameManager } from '../../game/manager/GameManager';
import { JackpotSymbol } from '../../game/jackpot/JackpotSymbol';
import { GameCommand } from '../../core/events/GameCommand';
import { commandBus } from '../../core/events/CommandBus';
import { UIController } from '../manager/UIController';
import { UIControllerToken } from '../../core/base/UIControllerToken';
import { AudioService } from '../../game/audio/AudioService';
import { AudioKey } from '../../game/audio/AudioKey';
import { eventBus } from '../../core/events/EventBus';
import { GameEvent } from '../../core/events/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('TestModePanelUIController')
export class TestModePanelUIController extends BaseUIController<TestModePanelView> {

    init(): void {
        this.bindViewIntents();
        this.enable();
    }

    show(): void {
        this.view.render();
    }

    bindViewIntents(): void {
        this.view.onJPMINIClicked = () => {
            console.log("Jackpot MINI button clicked");
            // Implement logic to trigger MINI jackpot in test mode
            GameManager.instance.setJackpotTestMode(true, JackpotSymbol.MINI);
            commandBus.execute(GameCommand.SPIN);
            UIController.instance.disable(UIControllerToken.FRONT_PANEL);
            AudioService.instance.playSFX(AudioKey.BTN_CLICK);
            this.hide();
        };

        this.view.onJPMinorClicked = () => {
            console.log("Jackpot MINOR button clicked");
            // Implement logic to trigger MINOR jackpot in test mode
            GameManager.instance.setJackpotTestMode(true, JackpotSymbol.MINOR);
            commandBus.execute(GameCommand.SPIN);
            UIController.instance.disable(UIControllerToken.FRONT_PANEL);
            AudioService.instance.playSFX(AudioKey.BTN_CLICK);

            this.hide();

        };

        this.view.onJPMajorClicked = () => {
            console.log("Jackpot MAJOR button clicked");
            // Implement logic to trigger MAJOR jackpot in test mode
            GameManager.instance.setJackpotTestMode(true, JackpotSymbol.MAJOR);
            commandBus.execute(GameCommand.SPIN);
            UIController.instance.disable(UIControllerToken.FRONT_PANEL);
            AudioService.instance.playSFX(AudioKey.BTN_CLICK);


            this.hide();
        };

        this.view.onJPGrandClicked = () => {
            console.log("Jackpot GRAND button clicked");
            // Implement logic to trigger GRAND jackpot in test mode
            GameManager.instance.setJackpotTestMode(true, JackpotSymbol.GRAND);
            UIController.instance.disable(UIControllerToken.FRONT_PANEL);
            AudioService.instance.playSFX(AudioKey.BTN_CLICK);

            commandBus.execute(GameCommand.SPIN);
            this.hide();
        };

        this.view.onFreeSpinClicked = () => {
            console.log("Free Spin button clicked");
            // Implement logic to trigger free spins in test mode
            GameManager.instance.isScatterTestMode = true; // Enable scatter test mode to guarantee free spins
            commandBus.execute(GameCommand.SPIN);
            UIController.instance.disable(UIControllerToken.FRONT_PANEL);
            AudioService.instance.playSFX(AudioKey.BTN_CLICK);
            this.hide();
        };

        this.view.onBonusClicked = () => {
            console.log("Bonus button clicked");
            // Implement logic to trigger bonus game in test mode
            GameManager.instance.isBonusTestMode = true; // Enable scatter test mode to guarantee free spins
            commandBus.execute(GameCommand.SPIN);
            UIController.instance.disable(UIControllerToken.FRONT_PANEL);
            AudioService.instance.playSFX(AudioKey.BTN_CLICK);
            this.hide();
        };

        this.view.onAddCreditClicked = () => {
            console.log("Add Credit button clicked");
            AudioService.instance.playSFX(AudioKey.BTN_CLICK);
            // Implement logic to add credits in test mode
            eventBus.emit(GameEvent.DAILY_REWARD_CLAIMED, 1000);// Add 1000 credits for testing
            this.hide();
        };
    }

}

