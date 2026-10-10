import { _decorator, Button, Component, Label, Node } from 'cc';
import { BasePopupView } from 'db://assets/core/ui/popup/BasePopupView';
import { TweenKey, TweenUtil } from 'db://assets/core/utils/TweenUtil';
import { IPopupData } from 'db://assets/core/ui/popup/IPopupData';
const { ccclass, property } = _decorator;

@ccclass('ErrorPopupView')
export class ErrorPopupView extends BasePopupView<IPopupData> {
    popupId: string = 'ErrorPopup';

    @property({ type: Label })
    private lbTitle: Label | null = null;

    @property({ type: Label })
    private lbErrorMessage: Label | null = null;

    @property({ type: Button })
    private btnOK: Button | null = null;
    @property({ type: Button })
    private btnADD: Button | null = null;

    @property(Node)
    private containerNode: Node;

    // PopupService.showErrorPopup to show an error popup when needed.

    protected applyData(data: IPopupData): void {
        console.log(`[ErrorPopup] Called from: ${data.source}`);
        this.lbTitle.string = data.title;
        this.lbErrorMessage.string = data.message;
        this.btnOK.node.off(Button.EventType.CLICK);
        this.btnADD.node.off(Button.EventType.CLICK);

        this.btnOK.node.on(Button.EventType.CLICK, this.onClickedOK, this);

        this.btnADD.node.on(Button.EventType.CLICK, this.onClickedADD, this);
        TweenUtil.playPopupDrop(TweenKey.UI_PANEL_POPUP, this.containerNode, 0.2, 0.2);
    }


    private onClickedOK() {
        this.data.resolve(true);
        this.hide();
    }

    private onClickedADD() {
        this.data.resolve(false);
        this.hide();
    }
}

