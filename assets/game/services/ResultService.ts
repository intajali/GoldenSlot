import { IReelStripService } from "../../core/interfaces/reel/IReelStripService";
import { IResultService } from "../../core/interfaces/reel/IResultService";
import { GameManager } from "../manager/GameManager";
import { JackpotEvaluator } from "../results/JackpotEvaluator";
import { LineWinEvaluator } from "../results/LineWinEvaluator";
import { ScatterEvaluator } from "../results/ScatterEvaluator";
import { SpinEvaluationService } from "./SpinEvaluationService";

export class ResultService implements IResultService {

    private rng;
    private counter = 0;
    private rtp: number;


    constructor(private readonly strips: number[][], private readonly RTP: number = 92) {
        this.rng = new DefaultRNG();
        this.rtp = RTP / 100;
    }

    getFreeSpinTestData(): number[] {
        return [6, 13, 9, 22, 11]; // Default to free spins
    }

    getBonusTestData(): number[] {
        return [1, 9, 13, 1, 5]; // Default to bonus test data
    }

    getJackpotTestData(): number[] {
        return [15, 20, 19, 8, 5]; // Default to jackpot test data
    }

    private testResults = [
        [2, 6, 21, 29, 12],
        //[6, 13, 9, 22, 11],
        [30, 2, 23, 14, 33],
        [3, 13, 23, 33, 6],
        [6, 5, 12, 1, 5],
        [1, 9, 13, 1, 5],
        [0, 4, 17, 29, 12],
        [1, 5, 12, 29, 12],
        [3, 16, 24, 4, 12],
        [3, 16, 24, 4, 12],
        [3, 16, 24, 4, 12],
        [3, 16, 24, 4, 12],
        [3, 13, 23, 33, 6],
        [8, 16, 24, 4, 12],
        [6, 5, 12, 19, 5],
    ];

    generateResult(): number[] {
        return this.strips.map(strip => {
            const maxIndex = strip;
            return this.rng.nextInt(0, maxIndex);
        });
    }

    nextResult(): number[] {
        return this.testResults[this.counter++ % this.testResults.length];
    }

    // Calculate the payout probability to achieve the desired RTP
    calculateRTPResult(): number[] {
        const betManager = GameManager.instance.getBetManager();
        const targetReturn = betManager.getCurrentTotalBet() * this.rtp; // Target return based on RTP percentage

        // Simulate random results and calculate total winnings
        let totalWinnings = 0;
        let result: number[];

        // Keep trying to hit the target RTP
        do {
            result = this.generateResult(); // Generate a random result
            totalWinnings = this.calculateWinnings(result); // Calculate winnings for this result
        } while (totalWinnings < targetReturn); // Repeat until total winnings meet the RTP target

        return result;
    }

    calculateWinnings(reelStops: number[]): number {

        const gameManager = GameManager.instance;
        const dataContainer = gameManager.getDataContainer();
        const reelService: IReelStripService = dataContainer.getReelStripService();
        const paytable = dataContainer.getPaytable();
        const paylines = dataContainer.getPaylines();
        const betManager = gameManager.getBetManager();
        const lineEvaluator = new LineWinEvaluator(
            paylines,
            paytable,
            betManager
        );

        const scatterEvaluator = new ScatterEvaluator(
            paytable
        );

        const jackpotEvaluator = new JackpotEvaluator(paytable);

        const spinService = new SpinEvaluationService(
            lineEvaluator,
            scatterEvaluator,
            jackpotEvaluator,
        );

        const visibleIds = reelService.getVisibleSymbolsId(reelStops);
        //  console.log("Visible Symbols IDs:", visibleIds);

        const result = spinService.evaluateSpin(visibleIds);

        let winnings = 0;
        // Define a simple payout rule: sum of the result as winnings (you can adjust this)
        winnings += result.totalWin; // Add jackpot payout if triggered
        return winnings;
    }
}

export class DefaultRNG implements IRNG {

    nextInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    nextFloat(): number {
        return Math.random();
    }
}

export interface IRNG {
    nextInt(min: number, max: number): number;
    nextFloat(): number;
}


