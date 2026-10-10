// IBetManager.ts
// Defines the interface for BetManager

import { IBetConfig } from "./config/IBetConfig";

export interface IBetManager {
    bind(betConfig: IBetConfig): void;
    getCurrentTotalBet(): number; // returns actual credits to deduct
    increaseBet(): void;
    decreaseBet(): void;
    nextMultiplier(): void;
    prevMultiplier(): void;
    notify(): void;
}
