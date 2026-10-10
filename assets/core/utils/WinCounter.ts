// export class WinCounter {
//     private timerId: number | null = null;
//     private value = 0;

//     start(
//         from: number,
//         to: number,
//         durationMs: number,
//         onUpdate: (v: number) => void,
//         onComplete?: () => void
//     ) {
//         // stop previous run
//         this.stop();

//         this.value = from;
//         const totalSteps = Math.max(1, to - from);
//         const interval = Math.max(1, Math.floor(durationMs / totalSteps));

//         onUpdate(this.value);

//         this.timerId = window.setInterval(() => {
//             this.value += 1;
//             onUpdate(this.value);

//             if (this.value >= to) {
//                 this.stop();
//                 onUpdate(to);
//                 onComplete?.();
//             }
//         }, interval);
//     }

//     stop() {
//         if (this.timerId !== null) {
//             clearInterval(this.timerId);
//             this.timerId = null;
//         }
//     }
// }
import { tween, Tween, TweenEasing } from 'cc';

export class WinCounter {

    private current = { value: 0 };
    private tweenRef: Tween<{ value: number }> | null = null;

    start(
        from: number,
        to: number,
        durationMs: number,
        onUpdate: (v: number) => void,
        onComplete?: () => void,
        ease: TweenEasing = 'linear'
    ) {
        this.stop();

        this.current.value = from;
        const durationSec = durationMs / 1000;

        this.tweenRef = tween(this.current)
            .to(durationSec,
                { value: to },
                {
                    easing: ease,
                    onUpdate: () => {
                        onUpdate(Math.floor(this.current.value));
                    },
                    onComplete: () => {
                        onUpdate(to);
                        onComplete?.();
                        this.tweenRef = null;
                    }
                }
            )
            .start();
    }

    stop() {
        if (this.tweenRef) {
            this.tweenRef.stop();
            this.tweenRef = null;
        }
    }
}