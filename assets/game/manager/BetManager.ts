import { _decorator } from 'cc';
import { IBetManager } from '../../core/interfaces/IBetManager';
import { IBetConfig } from '../../core/interfaces/config/IBetConfig';
import { BetDataModel } from '../../core/models/BetDataModel';
import { commandBus } from '../../core/events/CommandBus';
import { GameCommand } from '../../core/events/GameCommand';
import { eventBus } from '../../core/events/EventBus';
import { GameEvent } from '../../core/events/GameEvent';

const { ccclass } = _decorator;

@ccclass('BetManager')
export class BetManager implements IBetManager {

    private betAmounts: number[] = [];
    private multipliers: number[] = [];

    private currentBetIndex = 0;
    private currentMultiplierIndex = 0;

    private paylines: number;
    private payPerLine: number;

    private totalBetAmount: number = 0;

    constructor() {
        this.bindCommands();
    }

    private bindCommands(): void {

        commandBus.register(GameCommand.BET_INCREASE, this.increaseBet.bind(this));
        commandBus.register(GameCommand.BET_DECREASE, this.decreaseBet.bind(this));
        commandBus.register(GameCommand.BET_MAX, this.maxBet.bind(this));
        commandBus.register(GameCommand.MULTIPLIER_INCREASE, this.nextMultiplier.bind(this));
        commandBus.register(GameCommand.MULTIPLIER_DECREASE, this.prevMultiplier.bind(this));
    }

    public bind(betConfig: IBetConfig) {
        try {
            this.betAmounts = betConfig.betAmounts;
            this.multipliers = betConfig.multipliers;
            this.paylines = betConfig.paylines;
            this.payPerLine = betConfig.payPerLine;

            this.currentBetIndex = betConfig.defaultBetIndex;
            this.currentMultiplierIndex = betConfig.defaultMultiplierIndex;

        } catch (error) {
            console.error('Failed to load bet config JSON:', error);
            // Fallback default values
            this.betAmounts = [1, 2, 5, 10, 20, 50];
            this.multipliers = [1, 2, 5, 10, 20];
            this.currentBetIndex = 1;
        }
        this.notify();
    }

    public getCurrentTotalBet(): number {
        this.totalBetAmount = this.betAmounts[this.currentBetIndex] * this.multipliers[this.currentMultiplierIndex];
        return this.totalBetAmount; // Convert to credits
    }

    public increaseBet() {
        if (this.currentBetIndex < this.betAmounts.length - 1) {
            this.currentBetIndex += 1;
            this.notify();
        }
    }

    public decreaseBet() {
        if (this.currentBetIndex > 0) {
            this.currentBetIndex -= 1;
            this.notify();
        }
    }

    public maxBet() {
        this.currentBetIndex = this.betAmounts.length - 1;
        this.currentMultiplierIndex = 0;
        this.notify();
    }

    public minBet() {
        this.currentBetIndex = 0;
        this.currentMultiplierIndex = 0;
        this.notify();
    }

    public notify() {
        eventBus.emit(GameEvent.BET_CHANGED, this.createNewBetData());
    }

    private createNewBetData(): BetDataModel {
        return new BetDataModel(
            this.betAmounts[this.currentBetIndex],
            this.multipliers[this.currentMultiplierIndex],
            this.currentBetIndex === 0,
            this.currentBetIndex === this.betAmounts.length - 1,
            this.currentMultiplierIndex === 0,
            this.currentMultiplierIndex === this.multipliers.length - 1,
            this.paylines,
            this.payPerLine
        );
    }

    public nextMultiplier() {
        if (this.currentMultiplierIndex < this.multipliers.length - 1) {
            this.currentMultiplierIndex += 1;

            this.notify();
        }
    }

    public prevMultiplier() {

        if (this.currentMultiplierIndex > 0) {
            this.currentMultiplierIndex -= 1;
            this.notify();
        }
    }

    protected onDestroy(): void {
        this.unbindCommands();
    }

    unbindCommands(): void {
        commandBus.unregister(GameCommand.BET_INCREASE);
        commandBus.unregister(GameCommand.BET_DECREASE);
        commandBus.unregister(GameCommand.BET_MAX);
        commandBus.unregister(GameCommand.MULTIPLIER_INCREASE);
        commandBus.unregister(GameCommand.MULTIPLIER_DECREASE);
    }

}


