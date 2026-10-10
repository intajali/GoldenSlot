import { _decorator } from 'cc';
import { BaseUIController } from '../../core/base/BaseUIController';
import { JackpotMeterView } from '../panelview/JackpotMeterView';
import { GameManager } from '../../game/manager/GameManager';
import { PaytableTierEnum } from '../../core/models/PaytableTierEnum';
import { JackpotSymbol } from '../../game/jackpot/JackpotSymbol';
import { eventBus } from '../../core/events/EventBus';
import { GameEvent } from '../../core/events/GameEvent';
import { WinCounter } from '../../core/utils/WinCounter';
import { LocalStorageUtil } from '../../core/utils/LocalStorageUtil';
import { GameConstants } from '../../core/utils/GameConstants';
const { ccclass, property } = _decorator;

@ccclass('JackpotMeterViewUIController')
export class JackpotMeterViewUIController extends BaseUIController<JackpotMeterView> {

    winCounter = new WinCounter();

    init(): void {
        this.bindSystemEvents();
    }

    enable(): void {
        this.renderJackpotAmounts();
    }

    private bindSystemEvents() {
        eventBus.on(GameEvent.PROGRESSIVE_JACKPOT_UPDATED, this.onProgressiveJackpotUpdated, this);
    }


    renderJackpotAmounts() {
        const dataContainer = GameManager.instance.getDataContainer();

        const paytable = dataContainer.getPaytable();
        const specialTier = paytable.getTier(PaytableTierEnum.JACKPOT);
        // const jackpotTierSymbols = specialTier.getSymbols();
        // for (let i = 0; i < jackpotTierSymbols.length; i++) {
        //     const symbol = jackpotTierSymbols[i];
        //     //console.log(`Symbol: ${symbol}, Payouts: `, specialTier.getPayout(symbol, 1));
        // }
        const grandAmount = specialTier.getPayout(JackpotSymbol[JackpotSymbol.GRAND], 1);
        const majorAmountAmount = specialTier.getPayout(JackpotSymbol[JackpotSymbol.MAJOR], 1);
        const minorAmount = specialTier.getPayout(JackpotSymbol[JackpotSymbol.MINOR], 1);
        const miniAmount = specialTier.getPayout(JackpotSymbol[JackpotSymbol.MINI], 1);
        const storedGrandAmount = LocalStorageUtil.getNumber(GameConstants.JP_GRAND_AMOUNT_KEY, grandAmount);
        if (storedGrandAmount !== grandAmount) {
            LocalStorageUtil.setNumber(GameConstants.JP_GRAND_AMOUNT_KEY, grandAmount);
        }
        this.view.renderJackpotAmounts(storedGrandAmount, majorAmountAmount, minorAmount, miniAmount);
    }

    onProgressiveJackpotUpdated(amount: number) {
        this.view.renderGrandJackpotAmount(amount);
        console.log("JackpotMeterViewUIController received PROGRESSIVE_JACKPOT_UPDATED event with amount: ", amount);
        let storedGrandAmount = LocalStorageUtil.getNumber(GameConstants.JP_GRAND_AMOUNT_KEY);
        storedGrandAmount += amount;
        LocalStorageUtil.setNumber(GameConstants.JP_GRAND_AMOUNT_KEY, storedGrandAmount);
        console.log("Updated stored grand jackpot amount: ", storedGrandAmount);
        // this.winCounter.stop();
        // this.winCounter.start(
        //     0,
        //     amount,
        //     2000,
        //     (v: number) => {
        //         this.view.renderGrandJackpotAmount(v);
        //     },
        //     () => {
        //         console.log("FreeSpinCounterViewUIController - Win counter completed");
        //     }
        // );
    }

    unbindSystemEvents() {
        eventBus.off(GameEvent.PROGRESSIVE_JACKPOT_UPDATED, this.onProgressiveJackpotUpdated, this);
    }

    hide(): void {
        this.unbindSystemEvents();
    }
}

