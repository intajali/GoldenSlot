// UserAccountManager.ts
// Manages user account data such as balance and bets
// Provides methods to modify and retrieve account information


import { IUserAccount } from '../../core/interfaces/IUserAccount';
import { eventBus } from '../../core/events/EventBus';
import { GameEvent } from '../../core/events/GameEvent';
import { LocalStorageUtil } from '../../core/utils/LocalStorageUtil';
import { GameConstants } from '../../core/utils/GameConstants';

export class UserAccountManager implements IUserAccount {

    balance: number = 1000;
    lastBetAmount: number = 0;

    constructor(initialBalance: number = 1000) {
        const savedBalance = LocalStorageUtil.getNumber(GameConstants.USER_CREDIT_KEY, initialBalance);
        this.balance = savedBalance;
        this.notify();
    }

    public getBalance(): number {
        return this.balance;
    }

    public getLastBetAmount(): number {
        return this.lastBetAmount;
    }

    public isBalanceSufficient(betAmount: number): boolean {
        return this.balance >= betAmount;
    }

    /** Add credits to the balance */
    public addBalance(amount: number) {
        if (amount <= 0) {
            console.warn(`Attempted to add non-positive amount: ${amount}`);
            return;
        }
        console.log(`Current Balance before adding: ${this.balance}`);
        this.balance += amount;
        LocalStorageUtil.setNumber(GameConstants.USER_CREDIT_KEY, this.balance);
        console.log(`Added ${amount} → Balance: ${this.balance}`);
        this.notify();
    }

    /** Deduct credits for a spin, return false if insufficient */
    public deductBalance(amount: number) {
        if (amount <= 0) {
            console.warn(`Attempted to deduct non-positive amount: ${amount}`);
            return;
        }
        this.lastBetAmount = amount;
        if (!this.isBalanceSufficient(amount)) {
            console.warn(`Insufficient balance: ${this.balance} for bet: ${amount}`);
            return;
        }
        this.balance -= amount;
        console.log(`Deducted ${amount} , Current Balance: ${this.balance}`);
        LocalStorageUtil.setNumber(GameConstants.USER_CREDIT_KEY, this.balance);
        this.notify();
    }

    /** Reset balance (for testing or new game) */
    public resetBalance(amount: number = 1000) {
        this.balance = amount;
        this.lastBetAmount = 0;
        console.log(`Balance reset to ${this.balance}`);
        this.notify();
    }

    notify(): void {
        eventBus.emit(GameEvent.CREDIT_CHANGED, this.balance);
    }
}