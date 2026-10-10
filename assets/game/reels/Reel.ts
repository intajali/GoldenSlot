// Reel.ts
// Represents a single reel in the slot game
// Handles spinning, stopping, and symbol display


import { _decorator, Component, Node, Tween } from 'cc';

import { TweenKey, TweenUtil } from 'db://assets/core/utils/TweenUtil';
import { ReelState } from '../../core/base/ReelState';
import { SymbolType, SymbolView } from '../symbols/view/SymbolView';
import { SymbolLookup } from '../symbols/SymbolLookup';
import { BaseReel } from '../../core/base/BaseReel';
import { IReelStripService } from '../../core/interfaces/reel/IReelStripService';
import { IGameContext } from '../interface/IGameContext';
import { AudioKey } from '../audio/AudioKey';
import { AudioService } from '../audio/AudioService';

const { ccclass, property } = _decorator;
@ccclass('Reel')
export class Reel extends BaseReel {

    @property({ type: [Node] })
    symbols: Node[] = [];

    @property
    symbolHeight = 165;

    private spinSpeed;

    @property
    accelTime = 0.3;

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

    @property
    stopDuration = 0.6;

    private accelElapsed = 0;
    private stopElapsed = 0;
    private stopStartDistance = 0;

    private reelState: ReelState = ReelState.IDLE;

    private reelIndex = 0;

    private symbolRowsCount = 0;
    private totalHeight = 0;

    private currentSpeed = 0;
    private remainingStopDistance = 0;
    private decelStartDistance = 0;

    private stopResolve!: () => void;

    private reelService!: IReelStripService;

    public init(
        reelIndex: number,
        context: IGameContext
    ) {

        if (!context) {
            throw new Error("Reel.init missing dependencies");
        }
        this.reelIndex = reelIndex;
        const dataContainer = context.getDataContainer();
        this.reelService = dataContainer.getReelStripService();
        this.spinSpeed = context.getSession().gameSpinSpeed;
        this.symbolRowsCount = dataContainer.getGameConfig().symbolRowsCount;

        this.layoutSymbols();
        this.bindInitialSymbols();
    }

    private layoutSymbols() {
        for (let i = 0; i < this.symbols.length; i++) {
            this.symbols[i].setPosition(0, i * this.symbolHeight, 0);
        }
        this.totalHeight = this.symbolHeight * this.symbols.length;
    }

    private bindInitialSymbols() {
        const strip = this.reelService.getReelStrip(this.reelIndex);
        for (let i = 0; i < this.symbols.length; i++) {
            const symbolId = strip[i % strip.length];
            this.symbols[i]
                .getComponent(SymbolView)
                .bind(SymbolLookup.get(symbolId));
        }
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

    private decelerate(dt: number): void {
        this.move(this.currentSpeed * dt);
        this.remainingStopDistance -= this.currentSpeed * dt;

        if (this.remainingStopDistance <= this.decelStartDistance) {
            this.currentSpeed = Math.max(
                this.currentSpeed -
                this.getDecelRate(this.spinSpeed, this.normalDecelTime, dt),
                this.minStopSpeed
            );
        }

        if (this.remainingStopDistance <= 0) {
            this.reelState = ReelState.SNAPPING;
        }
    }

    public startSpin() {

        if (this.reelState !== ReelState.IDLE &&
            this.reelState !== ReelState.STOPPED) {
            return;
        }

        this.accelElapsed = 0;
        this.currentSpeed = 0;
        this.currentSpeed = 0;
        this.reelState = ReelState.STARTING;
    }

    isSpinning(): boolean {
        return this.reelState !== ReelState.IDLE &&
            this.reelState !== ReelState.STOPPED;
    }

    setSpinSpeed(speed: number): void {
        this.spinSpeed = speed;
    }

    /**
     * Stop the reel at a specific index
     * @param stopIndex 
     * @param isBonus 
     * @returns 
     */
    public stopAt(
        stopIndex: number,
        isBonus = false
    ): Promise<void> {

        return new Promise(resolve => {

            if (this.reelState !== ReelState.SPINNING) {
                resolve();
                return;
            }

            this.reelState = ReelState.STOPPING;
            this.stopResolve = resolve;

            this.bindStopResult(stopIndex);
            this.calculateStopDistances();
        });
    }

    private calculateStopDistances(): void {

        const centerRow = Math.floor(this.symbolRowsCount / 2);
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

    private bindStopResult(stopIndex: number) {
        const visible =
            this.reelService.getVisibleRowSymbols(
                this.reelIndex,
                stopIndex
            );

        for (let i = 0; i < this.symbols.length; i++) {

            const view = this.symbols[i].getComponent(SymbolView);
            view.bind(SymbolLookup.get(visible[i]));
            if (visible[i].startsWith("JACKPOT") || visible[i].startsWith("SCAT") || visible[i].startsWith("WILD") || visible[i].startsWith("BONUS")) {
                view.setFrame(true);
                view.setTitleVisible(true, this.setSymbolTitleFrame(visible[i]));

            } else {
                view.setFrame(false);
                view.setTitleVisible(false, SymbolType.NORMAL);
            }

        }
    }

    private setSymbolTitleFrame(symbolId: string): SymbolType {
        if (symbolId.startsWith("SCAT")) {
            return SymbolType.SCATTER;
        }
        else if (symbolId.startsWith("WILD")) {
            return SymbolType.WILD;
        }
        else if (symbolId.startsWith("BONUS")) {
            return SymbolType.BONUS;
        }
        else if (symbolId.startsWith("JACKPOT")) {
            return SymbolType.JACKPOT;
        }
        else {
            return SymbolType.NORMAL;
        }

    }

    private snapExact() {
        for (let i = 0; i < this.symbols.length; i++) {
            this.symbols[i].setPosition(0, i * this.symbolHeight, 0);
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

    public getVisibleSymbol(row: number): SymbolView {
        const center = Math.floor(this.symbolRowsCount / 2);
        return this.symbols[row + center - 1].getComponent(SymbolView);
    }

    getDecelRate(spinSpeed: number, decelTime: number, dt: number): number {
        return (spinSpeed / decelTime) * dt;
    }

}
