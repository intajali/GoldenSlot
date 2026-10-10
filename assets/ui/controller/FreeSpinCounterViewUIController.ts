import { _decorator } from 'cc';
import { FreeSpinCounterView } from '../panelview/FreeSpinCounterView';
import { BaseUIController } from '../../core/base/BaseUIController';
import { eventBus } from '../../core/events/EventBus';
import { GameEvent } from '../../core/events/GameEvent';
import { WinCounter } from '../../core/utils/WinCounter';
const { ccclass } = _decorator;

@ccclass('FreeSpinCounterViewUIController')
export class FreeSpinCounterViewUIController extends BaseUIController<FreeSpinCounterView> {

    private totalWin: number = 0;
    private winCounter = new WinCounter();
    init(): void {
        this.bindSystemEvents();
        this.enable();
    }

    show(): void {
        this.view.render();
    }

    hide(): void {
        this.view.hide();

    }

    disable(): void {
        this.unbindSystemEvents();
    }

    bindSystemEvents(): void {
        eventBus.on(GameEvent.FREE_SPIN_COUNTER_UPDATED, this.onFreeSpinCounterUpdated, this);
        eventBus.on(GameEvent.FREE_SPIN_WIN, this.onFreeSpinWin, this);
        eventBus.on(GameEvent.FREE_SPIN_STARTED, this.onFreeSpinStarted, this);
    }

    onFreeSpinStarted() {
        this.totalWin = 0;
        this.view.renderWin(this.totalWin);
    }
    onFreeSpinCounterUpdated(freeSpinCounter: number) {
        this.view.renderCount(freeSpinCounter);
    }

    async onFreeSpinWin(winAmount: number) {
        console.log("FreeSpinCounterViewUIController - onFreeSpinWin:", winAmount);
        const intervalMs = this.getStepIntervalMs(winAmount, 2000);
        this.winCounter.start(
            this.totalWin,
            this.totalWin + winAmount,
            2000,
            (v: number) => {
                this.view.renderWin(v);
            },
            () => {
                this.totalWin += winAmount;
                console.log("FreeSpinCounterViewUIController - Win counter completed");
            }
        );
    }

    unbindSystemEvents(): void {
        // Unbind system events here
        eventBus.off(GameEvent.FREE_SPIN_COUNTER_UPDATED, this.onFreeSpinCounterUpdated, this);
        eventBus.off(GameEvent.FREE_SPIN_WIN, this.onFreeSpinWin, this);
        eventBus.off(GameEvent.FREE_SPIN_STARTED, this.onFreeSpinStarted, this);
    }

    getStepIntervalMs(target: number, maxDurationMs: number = 2000): number {
        if (target <= 0) return 0;

        const interval = maxDurationMs / target;

        // Optional safety clamp (minimum 16ms ≈ 60fps)
        return interval; //Math.max(16, interval);
    }

    public async runCounter(
        startValue: number,
        endValue: number,
        step: number,
        intervalMs: number,
        callback: (value: number) => void,
        onComplete?: () => void
    ) {
        const forward = startValue <= endValue;

        for (
            let value = startValue;
            forward ? value <= endValue : value >= endValue;
            value += forward ? step : -step
        ) {
            callback(value);
            await this.delay(intervalMs);
        }

        onComplete?.();
    }

    private delay(ms: number) {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }

}

