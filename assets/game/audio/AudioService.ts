import {
    _decorator,
    Component,
    AudioSource,
    AudioClip,
    director
} from 'cc';
import { AudioKey } from './AudioKey';
import { LocalStorageUtil } from '../../core/utils/LocalStorageUtil';
import { SettingsDataModel } from '../../ui/model/SettingsDataModel';
import { GameConstants } from '../../core/utils/GameConstants';


const { ccclass } = _decorator;

@ccclass('AudioService')
export class AudioService extends Component {

    private static _instance: AudioService;
    static get instance(): AudioService {
        if (!this._instance) {
            console.warn('AudioService not initialized');
        }
        return this._instance;
    }

    private bgm!: AudioSource;
    private sfx!: AudioSource;

    private clips = new Map<AudioKey, AudioClip>();

    private muted = false;
    private bgmVolume = 1;
    private sfxVolume = 1;

    /* ---------------- LIFECYCLE ---------------- */

    onLoad() {
        if (AudioService._instance) {
            this.node.destroy();
            return;
        }

        AudioService._instance = this;
        director.addPersistRootNode(this.node);

        this.bgm = this.node.addComponent(AudioSource);
        this.sfx = this.node.addComponent(AudioSource);

        this.loadSettings();
    }

    /* ---------------- INIT ---------------- */

    register(key: AudioKey, clip: AudioClip) {
        this.clips.set(key, clip);
    }

    registerBatch(map: Partial<Record<AudioKey, AudioClip>>) {
        for (const key in map) {
            const clip = map[key as AudioKey];
            if (clip) {
                this.clips.set(key as AudioKey, clip);
            }
        }
    }

    /* ---------------- BGM ---------------- */

    playBGM(key: AudioKey, loop = true) {
        if (this.muted) return;

        const clip = this.clips.get(key);
        if (!clip) return;

        this.bgm.stop();
        this.bgm.clip = clip;
        this.bgm.loop = loop;
        this.bgm.volume = this.bgmVolume;
        this.bgm.play();
    }

    stopBGM() {
        this.bgm.stop();
    }

    /* ---------------- SFX ---------------- */

    playSFX(key: AudioKey, volumeScale = 1) {
        if (this.muted) return;

        const clip = this.clips.get(key);
        if (!clip) return;

        this.sfx.playOneShot(
            clip,
            this.sfxVolume * volumeScale
        );
    }

    /* ------------ LOOPED SFX (REELS) ------------ */

    playLoop(key: AudioKey) {
        if (this.muted) return;

        const clip = this.clips.get(key);
        if (!clip) return;

        this.sfx.stop();
        this.sfx.clip = clip;
        this.sfx.loop = true;
        this.sfx.volume = this.sfxVolume;
        this.sfx.play();
    }

    stopLoop() {
        this.sfx.stop();
        this.sfx.loop = false;
    }

    /* ---------------- SETTINGS ---------------- */

    mute(value: boolean) {
        this.muted = value;
        this.bgm.volume = value ? 0 : this.bgmVolume;
        this.sfx.volume = value ? 0 : this.sfxVolume;
        this.saveSettings();
    }

    setBgmVolume(v: number) {
        this.bgmVolume = Math.max(0, Math.min(1, v));
        this.bgm.volume = this.bgmVolume;
        this.saveSettings();
    }

    setSfxVolume(v: number) {
        this.sfxVolume = Math.max(0, Math.min(1, v));
        this.saveSettings();
    }

    isMuted(): boolean {
        return this.muted;
    }

    /* ---------------- PERSISTENCE ---------------- */

    private saveSettings() {
        const settings = new SettingsDataModel(this.sfxVolume, this.bgmVolume, this.muted);
        LocalStorageUtil.setObject(GameConstants.AUDIO_SETTINGS_STORAGE_KEY, settings.toJSON());
    }

    private loadSettings() {
        const savedSettings = LocalStorageUtil.getObject(GameConstants.AUDIO_SETTINGS_STORAGE_KEY, '');
        if (savedSettings) {
            const settingsDataModel = SettingsDataModel.fromJSON(savedSettings);
            this.sfxVolume = settingsDataModel.sfxLevel ?? 0.5;
            this.bgmVolume = settingsDataModel.musicLevel ?? 0.5;
            this.muted = settingsDataModel.isMuted ?? false;
        }
    }
}
