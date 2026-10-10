import { IPaylineProvider } from "../../core/interfaces/IPaylineProvider";
import { IPaytable } from "../interface/IPaytable";
import { IWinEvaluator } from "../../core/interfaces/IWinEvaluator";
import { LineWinResult } from "../../core/models/LineWinResult";
import { BonusWinResult } from "../../core/models/BonusWinResult";
import { IBetManager } from "../../core/interfaces/IBetManager";


export class LineWinEvaluator implements IWinEvaluator<{ lineWins: LineWinResult[]; bonusWin?: BonusWinResult }> {

    constructor(
        private readonly paylines: IPaylineProvider,
        private readonly paytable: IPaytable,
        private readonly betManager: IBetManager, // Replace with actual type if available
        private readonly wildId = "WILD",
        private readonly bonusId = "BONUS"

    ) { }
    private readonly blockedPrefixes = ["SCAT"]
    evaluate(visible: string[][]): { lineWins: LineWinResult[]; bonusWin?: BonusWinResult } {
        let lineWins: LineWinResult[] = [];

        // 👉 BONUS tracking
        let bonusCount = 0;
        const bonusPositions: { reel: number; row: number }[] = [];

        // --- BONUS SCAN (whole grid) ---
        for (let reel = 0; reel < visible.length; reel++) {
            for (let row = 0; row < visible[reel].length; row++) {
                const symbol = visible[reel][row];
                if (symbol.startsWith(this.bonusId)) {
                    bonusCount++;
                    bonusPositions.push({ reel, row });
                }
            }
        }

        const lines = this.paylines.getPaylines();

        lines.forEach((line, lineIndex) => {
            let baseSymbol: string | null = null;
            let matchCount = 0;
            const positions: { reel: number; row: number }[] = [];

            for (let reel = 0; reel < line.length; reel++) {
                const row = line[reel];
                const symbol = visible[reel][row];

                // Block SCAT from line wins
                if (this.isBlocked(symbol)) break;

                if (symbol.startsWith(this.bonusId)) break;

                if (!baseSymbol && !this.isWild(symbol)) {
                    baseSymbol = symbol;
                }

                if (
                    symbol === baseSymbol ||
                    this.isWild(symbol) ||
                    (this.isWild(baseSymbol!) && !this.isWild(symbol))
                ) {
                    matchCount++;
                    positions.push({ reel, row });

                    // If base was wild, replace with real symbol
                    if (this.isWild(baseSymbol!) && !this.isWild(symbol)) {
                        baseSymbol = symbol;
                    }
                } else {
                    break;
                }
            }

            if (!baseSymbol) return;

            const winAmount = this.betManager.getCurrentTotalBet() * this.paytable.getPayout(baseSymbol, matchCount);
            if (winAmount <= 0) return;

            lineWins.push({
                lineIndex,
                symbolId: baseSymbol,
                matchCount,
                winAmount,
                positions
            });
        });

        // --- BONUS PAYOUT ---
        let bonusWin: BonusWinResult | undefined;

        if (bonusCount > 0) {
            const bonusAmount = this.paytable.getPayout(this.bonusId, bonusCount);
            if (bonusAmount > 0) {
                bonusWin = {
                    symbolId: this.bonusId,
                    count: bonusCount,
                    winAmount: bonusAmount,
                    positions: bonusPositions
                };
            }
        }
        return { lineWins, bonusWin }
    }

    private isWild(symbol: string): boolean {
        return symbol?.startsWith(this.wildId);
    }

    private isBlocked(symbol: string): boolean {
        return this.blockedPrefixes.some(p => symbol.startsWith(p));
    }
}
