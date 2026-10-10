import { WinResultModel } from "../../core/models/WinResultModel";

export class GameSession {

    private readonly DEFAUT_FREE_SPIN_COUNT = 6;
    // ---- Round Result ----
    winAmount = 0;
    scatterWin = 0;
    freeSpinWin = 0;

    // ---- Free Spins ----
    inFreeSpins = false;
    freeSpinsLeft = 0;
    hasShownFreeSpinPopup = false;

    // ---- Auto Spin ----
    autoSpinEnabled = false;
    autoSpinLeft = 0;

    // ---- Bonus ----
    inBonus = false;

    //Win
    isWinSnappingDone = false;

    gameSpinSpeed = 2000; // Default spin speed in milliseconds

    // ----------------------
    // Round lifecycle
    // ----------------------

    resetRound(): void {
        this.winAmount = 0;
        this.scatterWin = 0;
        this.freeSpinWin = 0;
        this.isWinSnappingDone = false;
        this.hasShownFreeSpinPopup = false;

    }

    resetModes(): void {
        this.inFreeSpins = false;
        this.inBonus = false;
    }

    // ----------------------
    // Win application
    // ----------------------

    applyWinResult(result: WinResultModel): void {
        this.winAmount = result.totalWin;

        if (result.scatterWin.triggered) {
            this.scatterWin = result.scatterWin.winAmount;
            this.freeSpinsLeft += this.DEFAUT_FREE_SPIN_COUNT;
            this.inFreeSpins = true;
        }
    }

    // ----------------------
    // Auto spin helpers
    // ----------------------

    startAutoSpin(count: number): void {
        this.autoSpinEnabled = true;
        this.autoSpinLeft = count;
    }

    consumeAutoSpin(): boolean {
        if (!this.autoSpinEnabled || this.autoSpinLeft <= 0) {
            this.stopAutoSpin();
            return false;
        }

        this.autoSpinLeft--;
        return true;
    }

    stopAutoSpin(): void {
        this.autoSpinEnabled = false;
        this.autoSpinLeft = 0;
    }

    // ----------------------
    // Free spin helpers
    // ----------------------

    consumeFreeSpin(): boolean {
        if (!this.inFreeSpins || this.freeSpinsLeft <= 0) {
            this.inFreeSpins = false;
            this.freeSpinsLeft = 0;
            return false;
        }
        console.log(`Free Spin Left ${this.freeSpinsLeft}`);
        this.freeSpinsLeft--;
        return true;
    }

    // ----------------------
    // Guards
    // ----------------------

    isBaseGame(): boolean {
        return !this.inFreeSpins && !this.inBonus;
    }
}


