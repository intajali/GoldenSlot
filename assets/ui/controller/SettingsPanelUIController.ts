import { _decorator } from 'cc';
import { BaseUIController } from '../../core/base/BaseUIController';
import { SettingsPanelView } from '../panelview/SettingsPanelView';
import { UIController } from '../manager/UIController';
import { UIControllerToken } from '../../core/base/UIControllerToken';
import { eventBus } from '../../core/events/EventBus';
import { GameEvent } from '../../core/events/GameEvent';
import { AudioService } from '../../game/audio/AudioService';
import { AudioKey } from '../../game/audio/AudioKey';
import { LocalStorageUtil } from '../../core/utils/LocalStorageUtil';
import { GameConstants } from '../../core/utils/GameConstants';
import { SettingsDataModel } from '../model/SettingsDataModel';
const { ccclass, property } = _decorator;

@ccclass('SettingsPanelUIController')
export class SettingsPanelUIController extends BaseUIController<SettingsPanelView> {

    private sfxLevel: number = 0.5; // Default volume level (0 to 1)
    private musicLevel: number = 0.5; // Default volume level (0 to 1)
    private speedLevel: number = 1.0; // Default speed level (1.0 is normal speed)

    private volumeStep: number = 0.1; // Step for volume increase/decrease
    private speedStep: number = 0.2; // Step for speed increase/decrease

    private maxSpeed: number; // Maximum speed level (2x)
    private minSpeed: number = 2000; // Minimum speed level (0.5x, represented as 2000ms spin time)
    private speedToReduce: number = 1000; // Amount to reduce/increase spin time for each speed step (1000ms = 1 second)

    private currentSpeed: number;

    private isMuted: boolean = false;

    init(): void {
        this.bindViewIntents();
        this.bindSystemEvents();
        this.enable();
    }
    show(): void {
        this.loadSettings();
        this.view.render({ sfxLevel: this.sfxLevel, musicLevel: this.musicLevel, speedLevel: this.speedLevel, isMuted: this.isMuted });
        //this.view.renderDefaults(this.sfxLevel, this.musicLevel, this.speedLevel, this.isMuted);
    }

    bindViewIntents(): void {
        this.view.onSFXVolumeIncreaseAction = () => {
            console.log("Volume Up Clicked");
            this.sfxLevel = Math.min(1, this.sfxLevel + this.volumeStep);
            this.view.renderSFXDisplay(this.sfxLevel); // Example volume level
            this.playButtonClickSound();
            this.setSFXVolume(this.sfxLevel);
        };

        this.view.onSFXVolumeDecreaseAction = () => {
            console.log("Volume Down Clicked");
            this.sfxLevel = Math.max(0, this.sfxLevel - this.volumeStep);
            this.view.renderSFXDisplay(this.sfxLevel); // Example volume level
            this.playButtonClickSound();
            this.setSFXVolume(this.sfxLevel);
        };

        this.view.onMusicVolumeIncreaseAction = () => {
            console.log("Music Volume Up Clicked");
            this.musicLevel = Math.min(1, this.musicLevel + this.volumeStep);
            this.view.renderMusicDisplay(this.musicLevel); // Example volume level
            this.playButtonClickSound();
            this.setMusicVolume(this.musicLevel);
        };

        this.view.onMusicVolumeDecreaseAction = () => {
            console.log("Music Volume Down Clicked");
            this.musicLevel = Math.max(0, this.musicLevel - this.volumeStep);
            this.view.renderMusicDisplay(this.musicLevel); // Example volume level
            this.playButtonClickSound();
            this.setMusicVolume(this.musicLevel);
        }

        this.view.onSpeedIncreaseAction = () => {
            console.log("Speed Up Clicked");
            if (this.currentSpeed >= this.maxSpeed) {
                console.log("Already at maximum speed");
                return;
            }
            this.speedLevel = Math.min(1, this.speedLevel + this.speedStep); // Max speed 2x    
            this.view.renderSpeedDisplay(this.speedLevel); // Example speed level
            const newSpeed = this.currentSpeed + this.speedToReduce;
            console.log("Current Speed  ", newSpeed);
            eventBus.emit(GameEvent.SPIN_SPEED_CHANGED, newSpeed);
            this.currentSpeed = newSpeed;
            this.playButtonClickSound();
        };

        this.view.onSpeedDecreaseAction = () => {
            console.log("Speed Down Clicked");
            if (this.currentSpeed <= this.minSpeed) {
                console.log("Already at minimum speed");
                return;
            }
            this.speedLevel = Math.max(0.25, this.speedLevel - this.speedStep); // Min speed 0.5x
            this.view.renderSpeedDisplay(this.speedLevel); // Example speed level
            const newSpeed = this.currentSpeed - this.speedToReduce;
            console.log("Current Speed ", newSpeed);
            eventBus.emit(GameEvent.SPIN_SPEED_CHANGED, newSpeed);
            this.currentSpeed = newSpeed;
            this.playButtonClickSound();
        };

        this.view.onMuteToggleAction = (isMuted: boolean) => {
            console.log("Mute Toggled: ", isMuted);
            this.isMuted = isMuted;
            const sfxVolume = isMuted ? 0 : this.sfxLevel;
            const musicVolume = isMuted ? 0 : this.musicLevel;
            console.log("Applying volumes - SFX: ", this.sfxLevel, " Music: ", this.musicLevel);
            this.setSFXVolume(sfxVolume);
            this.setMusicVolume(musicVolume);
            this.view.renderSFXDisplay(sfxVolume);
            this.view.renderMusicDisplay(musicVolume);
            AudioService.instance.mute(isMuted);
            this.view.setMuted(isMuted);
            this.playButtonClickSound();
            this.view.setInteractable(!isMuted);
        };

        this.view.onExitClick = () => {
            console.log("Settings Panel Closed");
            this.playButtonClickSound();
            this.saveSettings();
            this.view.hide();
            UIController.instance.hide(UIControllerToken.SETTINGS_PANEL);
        };
    }

    private setSFXVolume(v: number) {
        AudioService.instance.setSfxVolume(v);
    }

    private setMusicVolume(v: number) {
        AudioService.instance.setBgmVolume(v);
    }

    bindSystemEvents(): void {
        eventBus.on(GameEvent.CONFIG_LOADED, this.onConfigLoaded, this);
    }

    onConfigLoaded(data: any): void {

        this.maxSpeed = data.maxSpinSpeed;
        this.currentSpeed = data.spinSpeed;
        this.speedLevel = (this.currentSpeed / this.maxSpeed);
        this.speedLevel = this.round(this.speedLevel, 1);
        console.log("This speed level :: ", this.speedLevel);
        this.view.renderSpeedDisplay(this.speedLevel);
    }

    private playButtonClickSound() {
        // Implement sound playing logic here
        AudioService.instance.playSFX(AudioKey.BTN_CLICK);

    }

    round(value: number, decimals: number): number {
        const factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }

    unbindSystemEvents(): void {
        eventBus.off(GameEvent.CONFIG_LOADED, this.onConfigLoaded, this);
    }

    private saveSettings() {
        const settings = new SettingsDataModel(this.sfxLevel, this.musicLevel, this.isMuted);
        console.log("Saving settings: ", settings);
        LocalStorageUtil.setObject(GameConstants.AUDIO_SETTINGS_STORAGE_KEY, settings.toJSON());
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
    }

    disable(): void {
        this.unbindSystemEvents();
    }
}

