import { _decorator, Component, Node } from 'cc';
import { BaseReel } from '../../core/base/BaseReel';
import { ReelState } from '../../core/base/ReelState';
import { TweenKey, TweenUtil } from '../../core/utils/TweenUtil';
import { AudioKey } from '../audio/AudioKey';
import { AudioService } from '../audio/AudioService';
import { JackpotSymbolView } from '../symbols/view/JackpotSymbolView';
import { SymbolLookup } from '../symbols/SymbolLookup';
const { ccclass, property } = _decorator;

@ccclass('JackpotReel')
export class JackpotReel extends BaseReel {

    @property({ type: [Node] })
    symbols: Node[] = [];

    @property
    symbolHeight: number = 180;

    @property
    normalDecelTime = 0.45;

    @property
    bonusDecelTime = 0.8;

    @property
    minStopSpeed = 600;

    @property
    bounceDistance = 30;

    @property
    bounceDownTime = 0.06;

    @property
    bounceUpTime = 0.12;

    private spinSpeed = 2000;
    private visibleCount = 5;
    private totalHeight = 0;

    private accelElapsed = 0;
    private stopElapsed = 0;
    private stopStartDistance = 0;

    private currentSpeed = 0;
    private remainingStopDistance = 0;

    private stopDuration = 0.6;
    private accelTime = 0.3;

    private reelState: ReelState = ReelState.IDLE;
    private stopResolve!: () => void;

    private finalStopIndex = 0;

    onLoad() {
        this.layoutSymbols();
    }

    private layoutSymbols() {
        for (let i = 0; i < this.symbols.length; i++) {
            this.symbols[i].setPosition(0, i * this.symbolHeight, 0);
        }
        this.totalHeight = this.symbolHeight * this.symbols.length;
    }

    startSpin(): void {
        if (this.reelState !== ReelState.IDLE &&
            this.reelState !== ReelState.STOPPED) {
            return;
        }

        this.accelElapsed = 0;
        this.currentSpeed = 0;
        this.currentSpeed = 0;
        this.reelState = ReelState.STARTING;
    }

    protected update(dt: number): void {
        if (!this.isSpinning()) return;
        this.updateMotion(dt);
        if (this.reelState === ReelState.SNAPPING) {
            this.finalizeStop();
        }
    }

    private updateMotion(dt: number): void {
        switch (this.reelState) {

            case ReelState.STARTING:
                this.accelerate(dt);
                break;

            case ReelState.SPINNING:
                this.move(this.spinSpeed * dt);
                break;

            case ReelState.STOPPING:
                this.decelerateSmooth(dt);
                break;
        }
    }

    private move(deltaY: number) {
        for (const s of this.symbols) {
            let y = s.position.y - deltaY;
            if (y < 0) y += this.totalHeight;
            else if (y >= this.totalHeight) y -= this.totalHeight;
            s.setPosition(0, y, 0);
        }
    }

    private accelerate(dt: number): void {

        this.accelElapsed += dt;

        const t = Math.min(this.accelElapsed / this.accelTime, 1);

        // Ease-out cubic for smooth feel
        const eased = 1 - Math.pow(1 - t, 3);

        this.currentSpeed = this.spinSpeed * eased;

        this.move(this.currentSpeed * dt);

        if (t >= 1) {
            this.reelState = ReelState.SPINNING;
            this.accelElapsed = 0;
        }
    }

    private decelerateSmooth(dt: number): void {

        this.stopElapsed += dt;

        const t = Math.min(this.stopElapsed / this.stopDuration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);

        // Calculate total distance that SHOULD be covered by now
        const targetDistance = this.stopStartDistance * eased;

        // Calculate how much to move THIS frame
        const moveThisFrame =
            targetDistance - (this.stopStartDistance - this.remainingStopDistance);

        this.move(moveThisFrame);

        this.remainingStopDistance -= moveThisFrame;

        if (t >= 1) {
            this.remainingStopDistance = 0;
            this.reelState = ReelState.SNAPPING;
        }
    }

    stopAt(index: number, isBonus?: boolean): Promise<void> {
        return new Promise(resolve => {

            if (this.reelState !== ReelState.SPINNING) {
                resolve();
                return;
            }
            this.finalStopIndex = index;
            this.reelState = ReelState.STOPPING;
            this.stopResolve = resolve;

            this.bindStopResult(index);
            this.calculateStopDistances();
        });
    }

    private calculateStopDistances(): void {

        const centerRow = Math.floor(this.visibleCount / 2);
        const targetY = centerRow * this.symbolHeight;
        const centerNode = this.symbols[centerRow];

        let offset = (centerNode.position.y - targetY + this.totalHeight)
            % this.totalHeight;

        const extraSpins = 2;

        this.remainingStopDistance =
            offset + this.totalHeight * extraSpins;

        this.stopElapsed = 0;
        this.stopStartDistance = this.remainingStopDistance;
    }

    bindStopResult(index: number) {

        for (let i = 0; i < this.symbols.length; i++) {
            const view = this.symbols[i].getComponent(JackpotSymbolView);
            view?.bind(SymbolLookup.get("jp_mini")); // Placeholder, should bind actual jackpot symbol based on index
        }
    }

    private finalizeStop(): void {
        this.snapExact();
        this.reelState = ReelState.BOUNCING;
        AudioService.instance.playSFX(AudioKey.REEL_STOP);
        TweenUtil.playReelBounce(
            TweenKey.REEL,
            this.node,
            this.bounceDistance,
            this.bounceDownTime,
            this.bounceUpTime,
            () => {
                this.reelState = ReelState.STOPPED;
                this.stopResolve?.();
            }
        );
    }

    private snapExact() {

        const visibleIndex = 2; // center row
        const target = this.finalStopIndex;

        for (let i = 0; i < this.symbols.length; i++) {

            // Down-spin alignment formula
            const newIndex =
                (i - (target - visibleIndex) + this.symbols.length)
                % this.symbols.length;

            this.symbols[i].setPosition(0, newIndex * this.symbolHeight, 0);
        }
    }

    private snapExact1() {
        for (let i = 0; i < this.symbols.length; i++) {
            this.symbols[i].setPosition(0, i * this.symbolHeight, 0);
        }
    }

    isSpinning(): boolean {
        return this.reelState !== ReelState.IDLE &&
            this.reelState !== ReelState.STOPPED;
    }

    setSpinSpeed(speed: number): void {
        this.spinSpeed = speed;
    }
}

