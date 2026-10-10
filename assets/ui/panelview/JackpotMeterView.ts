import { _decorator, Component, Label, Node } from 'cc';
import { IUIView } from '../../core/ui/interface/IUIView';
const { ccclass, property } = _decorator;

@ccclass('JackpotMeterView')
export class JackpotMeterView extends Component implements IUIView {

    @property({ type: Label })
    public lbGrandJP: Label;
    @property({ type: Label })
    public lbMajorJP: Label;
    @property({ type: Label })
    public lbMinorJP: Label;
    @property({ type: Label })
    public lbMiniJP: Label;

    private grandJPAmount: number = 0;

    render(): void {
        this.node.active = true;
    }
    hide(): void {
        this.node.active = false;
    }

    renderJackpotAmounts(grandAmount: number, majorAmount: number, minorAmount: number, miniAmount: number) {
        if (this.lbGrandJP) {
            this.grandJPAmount = grandAmount;
            this.lbGrandJP.string = `${grandAmount.toFixed(2)}`;
        }
        if (this.lbMajorJP) {
            this.lbMajorJP.string = `${majorAmount.toFixed(2)}`;
        }
        if (this.lbMinorJP) {
            this.lbMinorJP.string = `${minorAmount.toFixed(2)}`;
        }
        if (this.lbMiniJP) {
            this.lbMiniJP.string = `${miniAmount.toFixed(2)}`;
        }
    }

    renderGrandJackpotAmount(amount: number) {
        if (this.lbGrandJP) {
            this.grandJPAmount += amount;
            console.log("JackpotMeterView updated grand jackpot amount: ", this.grandJPAmount);
            this.lbGrandJP.string = `${this.grandJPAmount.toFixed(2)}`;
        }
    }
}

