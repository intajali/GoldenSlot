import { _decorator, AudioClip, Component, Enum } from 'cc';
import { AudioKey } from './AudioKey';
import { AudioService } from './AudioService';
const { ccclass, property } = _decorator;


@ccclass('AudioMapper')
export class AudioMapper extends Component {

    @property({ type: AudioClip })
    bgmClip: AudioClip = null!;

    @property({ type: AudioClip })
    btnClick: AudioClip = null!;

    @property({ type: AudioClip })
    reelSpin: AudioClip = null!;

    @property({ type: AudioClip })
    reelStop: AudioClip = null!;

    @property({ type: AudioClip })
    lineWin: AudioClip = null!;

    @property({ type: AudioClip })
    popupAppear: AudioClip = null!;

    @property({ type: AudioClip })
    jackpotCoinShower: AudioClip = null!;

    @property({ type: AudioClip })
    bonus: AudioClip = null!;

    @property({ type: AudioClip })
    coinCollect: AudioClip = null!;

    start() {
        AudioService.instance.registerBatch({
            [AudioKey.BGM_MAIN]: this.bgmClip,
            [AudioKey.BTN_CLICK]: this.btnClick,
            [AudioKey.REEL_SPIN]: this.reelSpin,
            [AudioKey.REEL_STOP]: this.reelStop,
            [AudioKey.LINE_WIN]: this.lineWin,
            [AudioKey.POPUP_APPEAR]: this.popupAppear,
            [AudioKey.JACKPOT]: this.jackpotCoinShower,
            [AudioKey.BONUS]: this.bonus,
            [AudioKey.COIN_COLLECT]: this.coinCollect,
        });

        // Optional: start BGM

    }
}



