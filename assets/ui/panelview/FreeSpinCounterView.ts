import { _decorator, Component, Label, Node } from 'cc';
import { IUIView } from '../../core/ui/interface/IUIView';
import { eventBus } from '../../core/events/EventBus';
const { ccclass, property } = _decorator;

@ccclass('FreeSpinCounterView')
export class FreeSpinCounterView extends Component implements IUIView {

    @property(Label)
    private lblFreeSpinCount: Label | null = null;
    @property(Label)
    private lblTotalWin: Label | null = null;


    render(): void {
        this.node.active = true;
    }

    hide(): void {
        this.node.active = false;
    }

    renderWin(winAmount: number): void {
        console.log("FreeSpinCounterView - WinAmount :", winAmount);
        if (this.lblTotalWin) {
            this.lblTotalWin.string = winAmount.toString();
        }
    }

    renderCount(count: number): void {
        if (this.lblFreeSpinCount) {
            this.lblFreeSpinCount.string = `FREE SPINS:  ${count}`;
        }
    }

    setInteractable?(value: boolean): void {

    }

}

