import { __private, _decorator, Button, Component, Node, Sprite, Toggle, Vec3, view } from 'cc';
import { IUIView } from '../../core/ui/interface/IUIView';
import { TweenKey, TweenUtil } from '../../core/utils/TweenUtil';
import { AudioService } from '../../game/audio/AudioService';
import { AudioMapper } from '../../game/audio/AudioMapper';
import { AudioKey } from '../../game/audio/AudioKey';
const { ccclass, property } = _decorator;

@ccclass('SettingsPanelView')
export class SettingsPanelView extends Component implements IUIView {

    //SFX Volume Controls
    @property({ type: Button })
    private btnSFXVolumeUp: Button = null;
    @property({ type: Button })
    private btnSFXVolumeDown: Button = null;
    @property({ type: Sprite })
    private sfxVolumeDisplay: Sprite = null;

    //Music Volume Controls

    @property({ type: Button })
    private btnMusicVolumeUp: Button = null;
    @property({ type: Button })
    private btnMusicVolumeDown: Button = null;

    @property({ type: Sprite })
    private musicVolumeDisplay: Sprite = null;

    //Speed Controls

    @property({ type: Button })
    private btnSpeedUp: Button = null;
    @property({ type: Button })
    private btnSpeedDown: Button = null;
    @property({ type: Sprite })
    private speedDisplay: Sprite = null;

    @property({ type: Toggle })
    private muteToggle: Toggle = null;

    @property({ type: Button })
    private btnClose: Button = null;

    @property({ type: Node })
    private contanierNode: Node;


    public onSFXVolumeIncreaseAction?: () => void;
    public onSFXVolumeDecreaseAction?: () => void;
    public onSpeedIncreaseAction?: () => void;
    public onSpeedDecreaseAction?: () => void;
    public onMusicVolumeIncreaseAction?: () => void;
    public onMusicVolumeDecreaseAction?: () => void;
    public onMuteToggleAction?: (isMuted: boolean) => void;
    public onExitClick: (() => void) | null = null;

    protected onLoad(): void {
        this.btnSFXVolumeUp.node.on(Button.EventType.CLICK, () => this.onSFXVolumeIncreaseAction?.(), this);
        this.btnSFXVolumeDown.node.on(Button.EventType.CLICK, () => this.onSFXVolumeDecreaseAction?.(), this);
        this.btnMusicVolumeUp.node.on(Button.EventType.CLICK, () => this.onMusicVolumeIncreaseAction?.(), this);
        this.btnMusicVolumeDown.node.on(Button.EventType.CLICK, () => this.onMusicVolumeDecreaseAction?.(), this);
        this.btnSpeedUp.node.on(Button.EventType.CLICK, () => this.onSpeedIncreaseAction?.(), this);
        this.btnSpeedDown.node.on(Button.EventType.CLICK, () => this.onSpeedDecreaseAction?.(), this);
        this.btnClose.node.on(Button.EventType.CLICK, () => this.onExitClick?.(), this);
        this.muteToggle.node.on(Toggle.EventType.TOGGLE, this.onMuteToggle, this);
    }

    render(data: { sfxLevel: number; musicLevel: number; speedLevel: number; isMuted: boolean; }): void {
        this.node.active = true;
        this.renderDefaults(data.sfxLevel, data.musicLevel, data.speedLevel, data.isMuted);

        const screenWidth = view.getVisibleSize().width;

        // Start position (off-screen left)
        this.contanierNode.setPosition(new Vec3(-screenWidth, 0, 0));

        TweenUtil.playSlideFromLeft(TweenKey.UI_PANEL_POPUP, this.contanierNode, this.contanierNode.position);
    }

    renderDefaults(sfx: number, music: number, speed: number, isMuted: boolean): void {
        this.renderSFXDisplay(sfx);
        this.renderMusicDisplay(music);
        this.renderSpeedDisplay(speed);
        this.onMuteToggleAction?.(isMuted);
    }


    onMuteToggle(toggle: Toggle) {
        this.onMuteToggleAction?.(toggle.isChecked);
    }

    setMuted(isMuted: boolean) {
        if (!isMuted) {
            AudioService.instance.playBGM(AudioKey.BGM_MAIN);
        }
        this.muteToggle.isChecked = isMuted;

    }

    hide(): void {
        this.node.active = false;
    }

    setInteractable?(value: boolean): void {
        this.btnSFXVolumeUp.interactable = value;
        this.btnSFXVolumeDown.interactable = value;
        this.btnMusicVolumeUp.interactable = value;
        this.btnMusicVolumeDown.interactable = value;
    }

    renderMusicDisplay(music: number) {
        // Update music display based on music level (0 to 1)
        const fillAmount = music; // Assuming music level is between 0 and 1
        this.musicVolumeDisplay.fillRange = fillAmount;
    }

    renderSFXDisplay(volumeLevel: number) {
        // Update volume display based on volumeLevel (0 to 1)
        // This is a placeholder implementation. You can replace it with actual sprite frame changes or fill amount adjustments.
        const fillAmount = volumeLevel; // Assuming volumeLevel is between 0 and 1
        this.sfxVolumeDisplay.fillRange = fillAmount;
    }

    renderSpeedDisplay(speedLevel: number) {
        const fillAmount = speedLevel;
        this.speedDisplay.fillRange = fillAmount;
    }

    protected onDestroy(): void {
        this.btnSFXVolumeUp.node.off(Button.EventType.CLICK, () => this.onSFXVolumeIncreaseAction?.(), this);
        this.btnSFXVolumeDown.node.off(Button.EventType.CLICK, () => this.onSFXVolumeDecreaseAction?.(), this);
        this.btnMusicVolumeUp.node.off(Button.EventType.CLICK, () => this.onMusicVolumeIncreaseAction?.(), this);
        this.btnMusicVolumeDown.node.off(Button.EventType.CLICK, () => this.onMusicVolumeDecreaseAction?.(), this);
        this.btnSpeedUp.node.off(Button.EventType.CLICK, () => this.onSpeedIncreaseAction?.(), this);
        this.btnSpeedDown.node.off(Button.EventType.CLICK, () => this.onSpeedDecreaseAction?.(), this);
        this.btnClose.node.off(Button.EventType.CLICK, () => this.onExitClick?.(), this);
        this.muteToggle.node.off(Toggle.EventType.TOGGLE, (isChecked: boolean) => this.onMuteToggleAction?.(isChecked), this);
    }
}

