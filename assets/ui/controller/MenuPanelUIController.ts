import { _decorator, Component, Node } from 'cc';
import { MenuPanelView } from '../panelview/MenuPanelView';
import { BaseUIController } from '../../core/base/BaseUIController';
import { UIControllerToken } from '../../core/base/UIControllerToken';
import { UIController } from '../manager/UIController';
const { ccclass, property } = _decorator;

@ccclass('MenuPanelUIController')
export class MenuPanelUIController extends BaseUIController<MenuPanelView> {


    init(): void {
        this.bindViewIntents();
        this.enable();
    }

    show(): void {
        this.view.render();
    }

    bindViewIntents(): void {
        this.view.onGameRulesClicked = () => {
            console.log("Game Rules button clicked");
            // Handle Game Rules button click, e.g., show game rules panel
            UIController.instance.show(UIControllerToken.GAME_RULES_PANEL);
            this.hide();
        };

        this.view.onSettingsClicked = () => {
            console.log("Settings button clicked");
            // Handle Settings button click, e.g., show settings panel
            UIController.instance.show(UIControllerToken.SETTINGS_PANEL);
            this.hide();
        };

        this.view.onTestModeClicked = () => {
            console.log("Test Mode button clicked");
            // Handle Test Mode button click, e.g., toggle test mode
            UIController.instance.show(UIControllerToken.TEST_MODE_PANEL);
            this.hide();
        };

        this.view.onExitClicked = () => {
            console.log("Exit button clicked");
            // Handle Exit button click, e.g., exit the game or return to main menu
            this.hide();
        };
    }

}

