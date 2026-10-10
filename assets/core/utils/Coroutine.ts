// Coroutine.ts
// Generic async utility for delays, polling, and counters
// No Component, no Node, no scene dependency

export type CancelablePromise<T = void> = {
    promise: Promise<T>;
    cancel: () => void;
};

export class Coroutine {

    private static _instance: Coroutine;

    public static get instance(): Coroutine {
        if (!this._instance) {
            this._instance = new Coroutine();
        }
        return this._instance;
    }

    private constructor() { } // prevent new()
    private runId = 0;

    /* -------------------------------------------------------------------------- */
    /*                                   Delay                                    */
    /* -------------------------------------------------------------------------- */

    public delay(ms: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    public delayCancelable(ms: number): CancelablePromise {
        let timeoutId: number | null = null;

        const promise = new Promise<void>((resolve) => {
            timeoutId = window.setTimeout(() => {
                timeoutId = null;
                resolve();
            }, ms);
        });

        return {
            promise,
            cancel: () => {
                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
            }
        };
    }

    /* -------------------------------------------------------------------------- */
    /*                                 Wait Until                                 */
    /* -------------------------------------------------------------------------- */

    public waitUntil(
        condition: () => boolean,
        checkIntervalMs = 100
    ): CancelablePromise {

        let intervalId: number | null = null;

        const promise = new Promise<void>((resolve) => {
            intervalId = window.setInterval(() => {
                if (condition()) {
                    if (intervalId !== null) {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                    resolve();
                }
            }, checkIntervalMs);
        });

        return {
            promise,
            cancel: () => {
                if (intervalId !== null) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            }
        };
    }

    /* -------------------------------------------------------------------------- */
    /*                                Run Counter                                  */
    /* -------------------------------------------------------------------------- */

    public async runCounter(
        startValue: number,
        endValue: number,
        step: number,
        intervalMs: number,
        callback: (value: number) => void,
        onComplete?: () => void
    ) {
        const currentRunId = ++this.runId;
        const forward = startValue <= endValue;

        for (
            let value = startValue;
            forward ? value <= endValue : value >= endValue;
            value += forward ? step : -step
        ) {
            // Cancel if a newer run started
            if (currentRunId !== this.runId) return;

            callback(value);
            await this.delay(intervalMs);
        }

        // Only complete if still the active run
        if (currentRunId === this.runId) {
            onComplete?.();
        }
    }
}

