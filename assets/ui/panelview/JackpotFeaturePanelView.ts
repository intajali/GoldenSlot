import { __private, _decorator, Button, Component, Label, Node } from 'cc';
import { IUIView } from '../../core/ui/interface/IUIView';
import { BaseReel } from '../../core/base/BaseReel';
import { JackpotReel } from '../../game/reels/JackpotReel';
import { Coroutine } from '../../core/utils/Coroutine';
const { ccclass, property } = _decorator;

@ccclass('JackpotFeaturePanelView')
export class JackpotFeaturePanelView extends Component implements IUIView {

    @property(JackpotReel)
    private jackpotReel: JackpotReel | null = null;


    @property(Label)
    private lblJackpotAmount: Label | null = null;

    async render(data?: any): Promise<void> {
        this.renderJackpotAmount(0);
        this.node.active = true;
    }

    startSpin() {
        this.jackpotReel?.startSpin();
    }

    async stopSpin(stopIndex: number) {
        await this.jackpotReel?.stopAt(stopIndex);
    }

    renderJackpotAmount(amount: number) {
        if (this.lblJackpotAmount) {
            this.lblJackpotAmount.string = amount === 0 ? "" : `${amount}`;
        }
    }

    hide(): void {
        this.node.active = false;
    }
    setInteractable?(value: boolean): void {

    }

}

