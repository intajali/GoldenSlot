import { _decorator, Button, Component, Label, Node } from 'cc';
import { BasePopupView } from 'db://assets/core/ui/popup/BasePopupView';
import { TweenKey, TweenUtil } from 'db://assets/core/utils/TweenUtil';
import { AudioService } from 'db://assets/game/audio/AudioService';
import { AudioKey } from 'db://assets/game/audio/AudioKey';
import { IPopupData } from 'db://assets/core/ui/popup/IPopupData';
const { ccclass, property } = _decorator;

@ccclass('SoundSelectionPopupView')
export class SoundSelectionPopupView extends BasePopupView<IPopupData> {
    popupId: string = 'SoundSelectionPopup';

    @property({ type: Label })
    private titleLabel: Label | null = null;

    @property({ type: Button })
    private btnYes: Button | null = null;
    @property({ type: Button })
    private btnNo: Button | null = null;

    @property(Node)
    private containerNode: Node;

    // PopupService.showSoundSelection to show a popup for sound selection (mute/unmute) when the game loads.

    protected applyData(data: IPopupData): void {
        console.log(`[SoundSelectionPopup] Called from: ${data.source}`);

        this.titleLabel.string = data.title;

        this.btnYes.node.off(Button.EventType.CLICK);
        this.btnNo.node.off(Button.EventType.CLICK);

        this.btnYes.node.on(Button.EventType.CLICK, this.onClickedYes, this);

        this.btnNo.node.on(Button.EventType.CLICK, this.onClickedNo, this);
        TweenUtil.playPopupDrop(TweenKey.UI_PANEL_POPUP, this.containerNode, 0.3, 0.3);
    }

    private onClickedYes() {
        this.data.resolve(true);
        AudioService.instance.mute(false);
        AudioService.instance.playBGM(AudioKey.BGM_MAIN);
        this.hide();
    }

    private onClickedNo() {
        this.data.resolve(false);
        AudioService.instance.mute(true);
        this.hide();
    }


}

