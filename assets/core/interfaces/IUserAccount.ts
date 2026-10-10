
export interface IUserAccount {

    balance: number;            // Current player balance
    lastBetAmount: number;      // Last bet placed
    addBalance(amount: number): void;
    deductBalance(amount: number): void; // returns false if insufficient
    notify(): void;
    isBalanceSufficient(betAmount: number): boolean;

}

