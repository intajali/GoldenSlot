// ReelsManager.ts
// Manages all reels in the slot game
// Handles starting/stopping reels and evaluating results

import { _decorator, Component, Node, ParticleSystem, ParticleSystem2D } from 'cc';
import { Coroutine } from 'db://assets/core/utils/Coroutine';
import { LineWinResult } from 'db://assets/core/models/LineWinResult';
import { Reel } from '../reels/Reel';
import { SymbolView } from '../symbols/view/SymbolView';
import { BaseReel } from '../../core/base/BaseReel';
import { IReelsController } from '../../core/interfaces/reel/IReelsController';
import { IGameContext } from '../interface/IGameContext';
import { BonusWinResult } from '../../core/models/BonusWinResult';

const { ccclass, property } = _decorator;

@ccclass('ReelsManager')
export class ReelsManager extends Component implements IReelsController {

    @property({ type: [Reel] })
    public reels: BaseReel[] = [];

    @property({ type: [Node] })
    public particleNodes: Node[] = [];

    @property
    public IsSpinning = false;

    private stopLineWinLoop: boolean = false;

    activeHighlights: SymbolView[] = [];

    public initReels(context: IGameContext) {
        console.log('Initializing reels with game data...');

        for (let i = 0; i < this.reels.length; i++) {
            const reel = this.reels[i];
            (reel as Reel).init(i, context);
        }
    }
    /** 
    * Start all reels 
    */
    public async startSpin() {
        if (this.IsSpinning) return;
        this.clearHighlights();
        this.IsSpinning = true;
        this.stopLineWinLoop = true; // Stop any ongoing win highlight loops

        for (const reel of this.reels) {
            reel.startSpin();
            await Coroutine.instance.delay(100);
        }
    }

    /**     * Stop all reels at specified positions
    * @param results Array of symbol indices where each reel should stop
    */
    public async stopSpin(results: number[]): Promise<void> {
        if (!this.IsSpinning) return;

        const stopPromises: Promise<void>[] = [];

        for (let i = 0; i < this.reels.length; i++) {
            const reel = this.reels[i];
            const stopIndex = results[i];

            stopPromises.push(
                (async () => {
                    await Coroutine.instance.delay(i * 500); // stagger without blocking
                    console.log(`Stopping reel ${i + 1} at index ${stopIndex}`);
                    await reel.stopAt(stopIndex);
                    const particle = this.particleNodes[i];
                    particle.active = true;

                    const ps = particle.getComponentInChildren(ParticleSystem2D);
                    ps?.resetSystem();

                    // optional: auto hide after 1 sec
                    await Coroutine.instance.delay(1000);
                    particle.active = false;
                })()
            );
        }



        await Promise.all(stopPromises);
        this.IsSpinning = false;
    }

    setReelSpinSpeed(speed: number): void {
        for (let i = 0; i < this.reels.length; i++) {
            const reel = this.reels[i];
            (reel as Reel).setSpinSpeed(speed);
        }
    }

    /**
     *  Play win highlight animations
     * @param lineWins 
     */
    public async playLineWinHighlight(lineWins: LineWinResult[]) {
        this.stopLineWinLoop = false;
        while (!this.stopLineWinLoop) {
            //  console.log("Playing win highlights for line wins:", lineWins[0].positions);
            this.clearHighlights();

            for (let win of lineWins) {
                this.clearHighlights();
                // console.log(`Highlighted line win on line ${win.lineIndex} with win amount ${win.winAmount}`);
                win.positions.forEach(p => {
                    const view = this.getSymbolView(p.reel, p.row);
                    view.highlightLineWin();
                    this.activeHighlights.push(view);
                });
                await Coroutine.instance.delay(1000);
            }
        }
    }

    public async playBonusWinHighlight(bonusWins: BonusWinResult) {
        // console.log("Playing win highlights for bonus wins:", bonusWins.positions);
        bonusWins.positions.forEach(p => {
            const view = this.getSymbolView(p.reel, p.row);
            view.highlightBonusWin();
            this.activeHighlights.push(view);
        });
    }

    public async playSpecialSymbolHighlight(symbolId: string, positions: { reel: number; row: number }[]) {
        // console.log(`Playing special symbol highlight for ${symbolId} at positions:`, positions);
        positions.forEach(p => {
            const view = this.getSymbolView(p.reel, p.row);
            view.showSpecialSymbolEffect();
            this.activeHighlights.push(view);
        });
    }

    public async setSymbolFrame(symbolId: string, positions: { reel: number; row: number }[]) {
        positions.forEach(p => {
            const view = this.getSymbolView(p.reel, p.row);
            view.setFrame();
        });
    }

    private getSymbolView(reel: number, row: number): SymbolView {
        const reelImpl = this.reels[reel] as Reel;
        return reelImpl.getVisibleSymbol(row);
    }

    /**
     * Clear all active highlights
     */
    public clearHighlights() {
        for (const symbol of this.activeHighlights) {
            symbol.clearHighlight();
        }
        this.activeHighlights.length = 0;
    }

    public isSpinning(): boolean {
        return this.IsSpinning;
    }
}

