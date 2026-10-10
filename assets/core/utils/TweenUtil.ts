import { tween, Tween, Node, Vec3, UIOpacity, Sprite, view } from 'cc';



export class TweenUtil {

    /** key → tween */
    private static _tweenMap = new Map<TweenKey, Tween<any>>();

    /* ---------------- CORE ---------------- */

    static play<T>(
        key: TweenKey,
        t: Tween<T>
    ): Tween<T> {

        // Stop existing tween with same key
        this.stopByKey(key);
        console.log('Playing tween with key:', key);
        this._tweenMap.set(key, t);
        t.start();
        return t;
    }

    static findByKey<T>(key: TweenKey): Tween<T> | undefined {
        return this._tweenMap.get(key) as Tween<T> | undefined;
    }

    static stopByKey(key: TweenKey) {
        console.log('Stopping tween with key:', key);
        const t = this._tweenMap.get(key);
        if (!t) return;

        t.stop();
        this._tweenMap.delete(key);
    }

    static stopNode(node: Node) {
        Tween.stopAllByTarget(node);

        // cleanup tracked tweens for this node
        for (const [key, t] of this._tweenMap) {
            if ((t as any)?._target === node) {
                this._tweenMap.delete(key);
            }
        }
    }

    static stopAll() {
        for (const t of this._tweenMap.values()) {
            t.stop();
        }
        this._tweenMap.clear();
    }

    /* ---------------- HELPERS ---------------- */

    static playOpacityPulse(
        key: TweenKey,
        opacity: UIOpacity,
        min = 160,
        max = 255,
        duration = 0.4
    ) {
        const t = tween(opacity)
            .repeatForever(
                tween()
                    .to(duration, { opacity: min })
                    .to(duration, { opacity: max })
            );

        return this.play(key, t);
    }

    static playScalePulse(
        key: TweenKey,
        node: Node,
        scale = 1.15,
        duration = 0.4
    ) {
        const t = tween(node)
            .repeatForever(
                tween()
                    .to(duration, { scale: new Vec3(scale, scale, 1) })
                    .to(duration, { scale: new Vec3(1, 1, 1) })
            );

        return this.play(key, t);
    }

    /// Bounce animation for reels (e.g., when they stop)

    static playReelBounce(
        key: TweenKey,
        node: Node,
        bounceDistance: number,
        downTime: number,
        upTime: number,
        onComplete?: () => void
    ) {
        Tween.stopAllByTarget(node);

        const startPos = node.position.clone();

        const t = tween(node)
            .to(
                downTime,
                { position: startPos.clone().add(new Vec3(0, -bounceDistance, 0)) },
                { easing: 'quadOut' }
            )
            .to(
                upTime,
                { position: startPos },
                { easing: 'quadIn' }
            )
            .call(() => onComplete?.());

        return this.play(key, t);
    }

    // Fill animation for sprites (e.g., loading bars)
    static animateFillAsync(
        key: TweenKey,
        sprite: Sprite,
        duration: number,
        onProgress?: (progress: number) => void,
        onComplete?: () => void
    ) {

        sprite.fillRange = 0;
        let frameCounter = 0;

        const t = tween(sprite)
            .to(duration, { fillRange: 1 }, {
                onUpdate: (target: Sprite) => {
                    frameCounter++;

                    // Call only every 10 frames
                    if (frameCounter % 30 === 0) {
                        onProgress?.(target.fillRange);
                    }
                }
            })
            .call(() => {
                onComplete?.();
            });

        return this.play(key, t);

    }

    static playPopupDrop(key: TweenKey, node: Node, dropTime = 0.3, popTime = 0.2) {
        // Stop any existing tweens on the node
        Tween.stopAllByTarget(node);

        Tween.stopAllByTarget(node);
        const dropHeight = 160;
        const endPos = node.position.clone();
        const startPos = endPos.clone().add(new Vec3(0, dropHeight, 0)); // drop down by 50 units

        // Optional: add a dim background fade-in here

        node.setScale(new Vec3(0.86, 0.86, 1));
        node.setPosition(startPos);


        // Create the tween sequence for the dropdown and pop effect without .parallel()
        const tweenSequence = tween(node)
            // Drop down
            .to(dropTime, { position: endPos }, { easing: 'quadIn' })
            // Pop overshoot with scaling (removed .parallel() for simplicity)
            .to(popTime, { scale: new Vec3(1.06, 1.06, 1) }, { easing: 'backOut' })
            // Settle the position and scale
            .to(0.10, { scale: new Vec3(1.0, 1.0, 1) }, { easing: 'quadOut' })
            .start();

        console.log("Tween sequence started");

        // Check if the tween is playing
        tweenSequence
            .call(() => {
                console.log("Tween callback executed");
            });

        // Call a method (presumably `play`) that executes the tween
        return this.play(key, tweenSequence);
    }

    static playScalePop(key: TweenKey, node: Node, popScale = 1.25, popTime = 0.3) {
        Tween.stopAllByTarget(node);

        const startScale = node.scale.clone();
        const minScale = new Vec3(0.1, 0.1, 1);  // Start scaling from 0.1
        const maxScale = new Vec3(popScale, popScale, 1);  // Target scale of 1.25
        node.setScale(minScale);  // Set initial scale to minScale

        const t = tween(node)
            .to(popTime, { scale: maxScale }, { easing: 'backOut' })  // Scale up to 1.25
            .to(0.1, { scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' });  // Set scale back to 1

        return this.play(key, t);
    }

    static playSlideFromLeft(key: TweenKey, node: Node, startPos: Vec3, endPos: Vec3 = new Vec3(0, 0, 0), duration: number = 0.3) {
        // Stop any existing tweens on the node
        Tween.stopAllByTarget(node);

        node.setPosition(startPos);

        const t = tween(node)
            .to(duration, { position: endPos }, {
                easing: 'expoInOut'
            })
            .start();
    }

    static playSlideToBottom(key: TweenKey, node: Node, startPos: Vec3, endPos: Vec3 = new Vec3(0, 0, 0), duration: number = 0.3) {
        // Stop any existing tweens on the node
        Tween.stopAllByTarget(node);

        node.setPosition(startPos);

        const t = tween(node)
            .to(duration, { position: endPos }, {
                easing: 'expoInOut'
            })
            .start();
    }

}

export enum TweenKey {
    LINE_WIN = 'WIN',
    BONUS_WIN = 'BONUS',
    REEL = 'REEL',
    UI = 'UI',
    SYSTEM = 'SYSTEM',
    UI_PANEL_POPUP = "UI_PANEL_POPUP",
    UI_SCALE_POP = "UI_SCALE_POP",
    UI_DOWN = "UI_DOWN",
}
