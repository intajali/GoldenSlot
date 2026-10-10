import { _decorator, Component, Node } from 'cc';
import { BaseUIController } from '../../core/base/BaseUIController';
import { LoadingPanelView } from '../panelview/LoadingPanelView';
import { AudioService } from '../../game/audio/AudioService';
import { AudioKey } from '../../game/audio/AudioKey';
import { PopupType } from '../../core/enum/PopupType';
import { PopupHandler } from '../popup/controller/PopupHandler';
import { eventBus } from '../../core/events/EventBus';
import { GameEvent } from '../../core/events/GameEvent';
import { SettingsDataModel } from '../model/SettingsDataModel';
import { GameConstants } from '../../core/utils/GameConstants';
import { LocalStorageUtil } from '../../core/utils/LocalStorageUtil';
import { PopupService } from '../popup/controller/PopupService';
const { ccclass, property } = _decorator;

@ccclass('LoadingPanelUIController')
export class LoadingPanelUIController extends BaseUIController<LoadingPanelView> {

    private sfxLevel: number = 0.5; // Default volume level (0 to 1)
    private musicLevel: number = 0.5; // Default volume level (0 to 1)
    private isMuted: boolean = false;

    init(): void {
        this.bindViewIntents();
        this.bindSystemEvents();
        this.enable();
    }

    show(): void {
        this.loadSettings();
        this.view.render();

    }

    bindSystemEvents(): void {
        eventBus.on(GameEvent.CONFIG_LOADED, this.onConfigLoaded, this);
    }

    onConfigLoaded(data: any): void {
        // console.log("LoadingPanelUIController received CONFIG_LOADED event with data: ", data);
        this.view.renderUserCredit(data.balance);
    }

    bindViewIntents(): void {
        this.view.onStartButtonAction = () => {
            console.log("Start Button Clicked");

            this.view.hide();
        };

        this.view.onCompleteLoadingAction = async () => {
            console.log("Loading Completed Action Triggered");

            const result = await PopupService.showSoundSelection(
                "Would you like to enable sound?",
                "LoadingPanelUIController.ts"
            );

            if (result) {
                console.log("User chose to enable sound.");
            } else {
                console.log("User chose to disable sound.");
            }

        };
    }

    private loadSettings() {
        const savedSettings = LocalStorageUtil.getObject(GameConstants.AUDIO_SETTINGS_STORAGE_KEY, '');
        console.log("Loaded settings from local storage: ", savedSettings);
        if (savedSettings) {
            const settingsDataModel = SettingsDataModel.fromJSON(savedSettings);
            this.sfxLevel = settingsDataModel.sfxLevel ?? 0.5;
            this.musicLevel = settingsDataModel.musicLevel ?? 0.5;
            this.isMuted = settingsDataModel.isMuted ?? false;
        }

        if (this.isMuted) {
            AudioService.instance.mute(true);
        } else {
            AudioService.instance.setSfxVolume(this.sfxLevel);
            AudioService.instance.setBgmVolume(this.musicLevel);
            AudioService.instance.playBGM(AudioKey.BGM_MAIN);
        }
    }

    unbindSystemEvents(): void {
        eventBus.off(GameEvent.CONFIG_LOADED, this.onConfigLoaded, this);
    }

    disable(): void {
        this.unbindSystemEvents();
    }

}

