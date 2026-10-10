import { _decorator, Button, Component, Node } from 'cc';
import { IUIView } from '../../core/ui/interface/IUIView';
const { ccclass, property } = _decorator;

@ccclass('TestModePanelView')
export class TestModePanelView extends Component implements IUIView {

    @property(Button)
    private btnClose: Button = null;

    @property(Button)
    private btnJackpotMINI: Button = null;
    @property(Button)
    private btnJackpotMINOR: Button = null;
    @property(Button)
    private btnJackpotMAJOR: Button = null
    @property(Button)
    private btnJackpotGRAND: Button = null;
    @property(Button)
    private btnFreeSpin: Button = null;
    @property(Button)
    private btnBonus: Button = null;

    @property(Button)
    private btnAddCredit: Button = null;

    public onJPMINIClicked?: () => void;
    public onJPMinorClicked?: () => void;
    public onJPMajorClicked?: () => void;
    public onJPGrandClicked?: () => void;
    public onFreeSpinClicked?: () => void;
    public onBonusClicked?: () => void;
    public onAddCreditClicked?: () => void;


    onLoad() {
        this.btnJackpotMINI.node.on(Button.EventType.CLICK, () => this.onJPMINIClicked?.());

        this.btnJackpotMINOR.node.on(Button.EventType.CLICK, () => this.onJPMinorClicked?.());

        this.btnJackpotMAJOR.node.on(Button.EventType.CLICK, () => this.onJPMajorClicked?.());

        this.btnJackpotGRAND.node.on(Button.EventType.CLICK, () => this.onJPGrandClicked?.());

        this.btnFreeSpin.node.on(Button.EventType.CLICK, () => this.onFreeSpinClicked?.());

        this.btnBonus.node.on(Button.EventType.CLICK, () => this.onBonusClicked?.());
        this.btnAddCredit.node.on(Button.EventType.CLICK, () => this.onAddCreditClicked?.());

        this.btnClose.node.on(Button.EventType.CLICK, () => this.hide());
    }

    render(data?: any): void {
        this.node.active = true;
    }
    hide(): void {
        this.node.active = false;
    }
    setInteractable?(value: boolean): void {

    }

    protected onDestroy(): void {
        this.btnJackpotMINI.node.off(Button.EventType.CLICK);
        this.btnJackpotMINOR.node.off(Button.EventType.CLICK);
        this.btnJackpotMAJOR.node.off(Button.EventType.CLICK);
        this.btnJackpotGRAND.node.off(Button.EventType.CLICK);
        this.btnFreeSpin.node.off(Button.EventType.CLICK);
        this.btnBonus.node.off(Button.EventType.CLICK);
        this.btnAddCredit.node.off(Button.EventType.CLICK);
        this.btnClose.node.off(Button.EventType.CLICK);
    }

}

