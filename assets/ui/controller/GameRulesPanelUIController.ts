
import { BaseUIController } from '../../core/base/BaseUIController';
import { UIControllerToken } from '../../core/base/UIControllerToken';
import { UIController } from '../manager/UIController';
import { GameRulesPanelView } from '../panelview/GameRulesPanelView';
export class GameRulesPanelUIController extends BaseUIController<GameRulesPanelView> {

    init(): void {
        this.bindViewIntents();
        this.enable();

    }

    show(): void {
        this.view.render();
        this.view.onItemSelected(0);
    }

    bindViewIntents(): void {

        this.view.onExitClick = this.exit.bind(this);
        this.view.onItemSelected = this.OnItemSelected.bind(this);
    }

    OnItemSelected(pageIndex: number) {
        console.log("Menu item selected: ", pageIndex);
        this.showPage(pageIndex);
    }

    private showPage(index: number) {
        console.log("Showing page index: ", index);
        this.view.showPage(index);
    }

    private exit() {
        this.view.hide();
        UIController.instance.hide(UIControllerToken.MENU_PANEL);
    }

}

