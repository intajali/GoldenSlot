import { _decorator } from 'cc';
import { BaseUIController } from '../../core/base/BaseUIController';
import { AutoSpinPanelView } from '../panelview/AutoSpinPanelView';
import { eventBus } from '../../core/events/EventBus';
import { GameEvent } from '../../core/events/GameEvent';
const { ccclass } = _decorator;

@ccclass('AutoSpinPanelUIController')
export class AutoSpinPanelUIController extends BaseUIController<AutoSpinPanelView> {
    init(): void {
        this.bindViewIntents();
        this.enable();
    }

    show(): void {
        this.view.render();
    }

    private selectedSpinCount: number = 0;

    bindViewIntents(): void {
        this.view.onStartButtonClicked = () => {
            if (this.selectedSpinCount > 0) {
                eventBus.emit(GameEvent.AUTO_SPIN_STARTED, this.selectedSpinCount);
            }
            this.view.hide();
        };

        this.view.onCloseButtonClicked = () => {
            console.log("Auto Spin Close button clicked");
            this.view.hide();
        };

        this.view.onItemSelected = (spinCount: number) => {
            console.log(`Auto spin selected: ${spinCount}`);
            this.selectedSpinCount = spinCount;
            this.view.setInteractable(true);
            // Handle auto spin selection logic here
        };
    }

    hide(): void {

    }

}

