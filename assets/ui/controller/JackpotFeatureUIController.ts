import { _decorator } from 'cc';
import { BaseUIController } from '../../core/base/BaseUIController';
import { JackpotFeaturePanelView } from '../panelview/JackpotFeaturePanelView';
import { Coroutine } from '../../core/utils/Coroutine';
import { AudioKey } from '../../game/audio/AudioKey';
import { AudioService } from '../../game/audio/AudioService';
import { ParticleGroupName, ParticleManager } from '../../game/manager/ParticleManager';
import { JACKPOT_CONFIG } from '../../game/jackpot/JackpotConfig';
import { JackpotSymbol } from '../../game/jackpot/JackpotSymbol';
import { WinCounter } from '../../core/utils/WinCounter';
import { GameManager } from '../../game/manager/GameManager';
import { LocalStorageUtil } from '../../core/utils/LocalStorageUtil';
import { GameConstants } from '../../core/utils/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('JackpotFeatureUIController')
export class JackpotFeatureUIController extends BaseUIController<JackpotFeaturePanelView> {

    private stopIndex = 0;

    private winCounter = new WinCounter();

    private jackpotMapping = new Map<number, JackpotSymbol>([
        [0, JackpotSymbol.MINI],
        [1, JackpotSymbol.MINOR],
        [2, JackpotSymbol.MAJOR],
        [3, JackpotSymbol.GRAND],
        [4, JackpotSymbol.MINI],
    ]);

    init(): void {
        this.enable();
    }

    async show(): Promise<void> {
        this.view.render();

        await Coroutine.instance.delay(200);
        this.view.startSpin();

        this.stopIndex = Math.floor(Math.random() * 5); // Random stop index for demo
        if (GameManager.instance.isJackpotTestMode) {
            console.log("Jackpot test mode enabled: Using test stop index from GameManager");
            this.stopIndex = GameManager.instance.testModeStopIndex;
            console.log("Test stop index: ", this.stopIndex);
        }
        await Coroutine.instance.delay(2000); // Simulate reel spinning for 2 seconds


        console.log('Jackpot Feature UI Controller :: Stopping reel at index:', this.stopIndex);
        await this.view.stopSpin(this.stopIndex);
        this.evaluateJackpotWins();
    }

    private async evaluateJackpotWins(): Promise<void> {

        const jackpotSymbol = this.jackpotMapping.get(this.stopIndex);
        const jackpot = JACKPOT_CONFIG[jackpotSymbol];
        if (jackpot) {
            console.log(`Jackpot Won: ${jackpot.payout} on ${JackpotSymbol[jackpot.symbol]}`);
            if (jackpot.symbol === JackpotSymbol.GRAND) {
                let storedGrandAmount = LocalStorageUtil.getNumber(GameConstants.JP_GRAND_AMOUNT_KEY);
                this.startwinCountUp(storedGrandAmount);
            } else {
                this.startwinCountUp(jackpot.payout);
            }
        }
        AudioService.instance.playLoop(AudioKey.JACKPOT);
        ParticleManager._instance.play(ParticleGroupName.BIG_WIN);
        await Coroutine.instance.delay(5000); // Wait for jackpot popup to be noticed
        ParticleManager._instance.stop(ParticleGroupName.BIG_WIN);
        await Coroutine.instance.delay(1000);
        AudioService.instance.stopLoop();
        // Reset jackpot meter display after win celebration
        LocalStorageUtil.remove(GameConstants.JP_GRAND_AMOUNT_KEY);
        this.hide();
    }

    startwinCountUp(targetAmount: number): void {
        this.winCounter.start(
            0,
            targetAmount,
            5000,
            (v: number) => {
                this.view.renderJackpotAmount(v);
            },
            () => {
                console.log("JackpotFeatureUIController - Win counter completed");
            }
        );
    }

}

