import { ReelStrip } from "../../core/utils/GameConfigLoader";
import { GameSession } from "../data/GameSession";
import { JACKPOT_CONFIG } from "./JackpotConfig";
import { JackpotSymbol } from "./JackpotSymbol";

export class JackpotHandler {

    constructor() {

    }

    MIN_BET_FOR_JACKPOT = 10;

    injectJackpotSymbol(reels: ReelStrip[], currentBet: number, session: GameSession, jackpotData?: JackpotData): ReelStrip[] {

        if (session.freeSpinsLeft > 0 || session.inBonus) {
            return;
        }

        //  Only trigger jackpot during normal spins and if bet is above threshold
        // if (currentBet < this.MIN_BET_FOR_JACKPOT) {
        //     return;
        // }
        //  Only reels 2–4 (index 1,2,3 if 0-based)
        const eligibleReels = reels.filter(
            r => r.index >= 1 && r.index <= 3
        );

        if (eligibleReels.length === 0) return;

        let reel = eligibleReels[Math.floor(Math.random() * eligibleReels.length)];
        //const reel = eligibleReels[1];

        let symbolIndex = Math.floor(Math.random() * reel.strip.length);
        // symbolIndex = 12; // For testing, force to 12

        let jackpotSymbol = this.getRandomJackpot();

        if (jackpotData) {
            jackpotSymbol = jackpotData.symbol;
            reel = reels.find(r => r.index === jackpotData.reelIndex) || reel;
            symbolIndex = jackpotData.stopIndex;
        }

        reel.strip[symbolIndex] = JackpotSymbol[jackpotSymbol];

        console.log(`Jackpot injected: ${jackpotSymbol} at reel ${reel.index} index ${symbolIndex}`);

        return reels;
    }

    getRandomJackpot(): JackpotSymbol {
        const totalWeight = JACKPOT_CONFIG.reduce((s, j) => s + j.weight, 0);
        let rand = Math.random() * totalWeight;

        for (const jp of JACKPOT_CONFIG) {
            rand -= jp.weight;
            if (rand <= 0) {
                return jp.symbol;
            }
        }

        return JackpotSymbol.MINI;
    }


}

export class JackpotData {
    symbol: JackpotSymbol;
    reelIndex: number;
    stopIndex: number;

    constructor(symbol: JackpotSymbol, reelIndex: number, stopIndex: number) {
        this.symbol = symbol;
        this.reelIndex = reelIndex;
        this.stopIndex = stopIndex;
    }
}

