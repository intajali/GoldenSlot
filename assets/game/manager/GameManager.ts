
// GameManager.ts
// Central manager for game flow and state transitions
// Coordinates between reels, user account, and bet management
// Handles game start and spin evaluation
//
//------------------------------------------------------------------

import { _decorator, Component, game, UI } from 'cc';
const { ccclass, property } = _decorator;

import { ReelsManager } from './ReelsManager';
import { UserAccountManager } from './UserAccountManager';
import { BetManager } from './BetManager';
import { GameDataContainer } from 'db://assets/game/data/GameDataContainer';
import { IGameContext } from 'db://assets/game/interface/IGameContext';
import { SlotStateMachine } from '../statemachine/SlotStateMachine';
import { LoadState } from '../state/LoadState';
import { SpinningState } from '../state/SpinningState';
import { AutoSpinState } from '../state/AutoSpinState';
import { GameSession } from '../data/GameSession';
import { IBetManager } from '../../core/interfaces/IBetManager';
import { IReelsController } from '../../core/interfaces/reel/IReelsController';
import { IUserAccount } from '../../core/interfaces/IUserAccount';
import { IState } from '../../core/interfaces/IState';
import { eventBus } from '../../core/events/EventBus';
import { GameEvent } from '../../core/events/GameEvent';
import { IdleState } from '../state/IdleState';
import { commandBus } from '../../core/events/CommandBus';
import { GameCommand } from '../../core/events/GameCommand';
import { UIController } from '../../ui/manager/UIController';
import { UIControllerToken } from '../../core/base/UIControllerToken';
import { JackpotSymbol } from '../jackpot/JackpotSymbol';
import { JackpotData } from '../jackpot/JackpotHandler';

@ccclass('GameManager')
export class GameManager extends Component implements IGameContext {

    @property({ type: ReelsManager })
    reelsManager: ReelsManager;

    private accountManager: UserAccountManager;
    private betManager: BetManager;
    private dataContainer: GameDataContainer;
    private slotStateMachine = new SlotStateMachine();
    private session = new GameSession();


    private static _instance: GameManager = null;

    public static get instance(): GameManager {
        return this._instance;
    }


    public isJackpotTestMode = false; // Set to true to enable test mode features
    public isScatterTestMode = false; // Set to true to enable scatter test mode features
    public isBonusTestMode = false; // Set to true to enable bonus test mode features

    private grandJPAmount: number = 0;

    protected onEnable(): void {
        if (GameManager._instance) {
            this.node.destroy();
            return;
        }
        GameManager._instance = this;

        this.bindCommands();
    }

    protected onLoad(): void {
        //LocalStorageUtil.clear();
        this.dataContainer = new GameDataContainer();
        this.betManager = new BetManager();

        this.changeState(
            new LoadState(this)
        );
    }

    protected start(): void {
        this.accountManager = new UserAccountManager(1000);
    }

    private bindCommands(): void {
        eventBus.on(GameEvent.WIN_SNAPPED_DONE, this.setWinSnappingStatus, this);
        eventBus.on(GameEvent.AUTO_SPIN_STARTED, this.onAutoSpinStarted, this);
        eventBus.on(GameEvent.SPIN_SPEED_CHANGED, this.onSpinSpeedChanged, this);
        eventBus.on(GameEvent.DAILY_REWARD_CLAIMED, this.onDailyRewardClaimed, this);

        commandBus.register(GameCommand.SPIN, this.requestSpin.bind(this));
        commandBus.register(GameCommand.STOP_AUTO_SPIN, this.onAutoSpinStopped.bind(this));
    }



    unbindCommands(): void {
        // Unbind commands if necessary
        eventBus.off(GameEvent.WIN_SNAPPED_DONE, this.setWinSnappingStatus, this);
        eventBus.off(GameEvent.AUTO_SPIN_STARTED, this.onAutoSpinStarted, this);
        eventBus.off(GameEvent.SPIN_SPEED_CHANGED, this.onSpinSpeedChanged, this);
        eventBus.off(GameEvent.DAILY_REWARD_CLAIMED, this.onDailyRewardClaimed, this);

        commandBus.unregister(GameCommand.SPIN);
        commandBus.unregister(GameCommand.STOP_AUTO_SPIN);
    }

    update(dt: number) {
        this.slotStateMachine.update(dt);
    }

    changeState(state: IState): void {
        this.slotStateMachine.changeState(state);
    }

    onSpinSpeedChanged(speed: number) {
        console.log("Spin Speed Changed to: ", speed);
        this.session.gameSpinSpeed = speed;
        this.reelsManager.setReelSpinSpeed(speed);
    }

    onConfigLoaded() {
        //console.log("Config Loaded - Transitioning to Idle State");
        const betConfig = this.dataContainer.getbetConfig();
        const gameConfig = this.dataContainer.getGameConfig();
        //AudioService.instance.playBGM(AudioKey.BGM_MAIN);
        this.betManager.bind(betConfig);
        this.session.gameSpinSpeed = gameConfig.reelSpinSpeed;
        this.reelsManager.initReels(this);
        //console.log("Emitting CONFIG_LOADED event with reelSpinSpeed: ", this.session.gameSpinSpeed);
        eventBus.emit(GameEvent.CONFIG_LOADED, {
            spinSpeed: this.session.gameSpinSpeed, maxSpinSpeed: gameConfig.maxSpinSpeed,
            balance: this.accountManager.getBalance()
        });
        UIController.instance.enable(UIControllerToken.JACKPOT_METER_PANEL);
        this.changeState(
            new IdleState(this)
        );
    }

    requestSpin() {
        this.changeState(
            new SpinningState(this)
        );
    }

    onAutoSpinStarted(spinCount: number) {
        this.session.startAutoSpin(spinCount);
        this.changeState(
            new AutoSpinState(this)
        );
    }

    onAutoSpinStopped() {
        this.session.stopAutoSpin();
        this.changeState(
            new IdleState(this)
        );
    }

    getSession(): GameSession {
        return this.session;
    }

    getReelsController(): IReelsController {
        return this.reelsManager;
    }
    getBetManager(): IBetManager {
        return this.betManager;
    }

    getAccountManager(): IUserAccount {
        return this.accountManager;
    }

    public setWinSnappingStatus(status: boolean) {
        //console.log(`Win Snapping Status Updated: ${status}`);
        this.session.isWinSnappingDone = status;
        //console.log("this.session.winAmount :: " + this.session.winAmount);
        if (status && this.session.winAmount > 0 && !this.session.hasShownFreeSpinPopup) {
            this.accountManager.addBalance(this.session.winAmount);
        }
    }

    onDailyRewardClaimed(amount: number) {
        //console.log("Daily Reward Claimed:", amount);
        this.accountManager.addBalance(amount);
    }

    public getDataContainer(): GameDataContainer {
        return this.dataContainer;
    }

    protected onDestroy(): void {
        this.unbindCommands();
    }

    public testModeStopIndex: number = 0; // Default stop index for test mode

    public setJackpotTestMode(enabled: boolean, jackpotSymbol: JackpotSymbol = JackpotSymbol.MINI) {
        this.isJackpotTestMode = enabled;
        this.testModeStopIndex = jackpotSymbol;
        console.log("Test mode set to: ", enabled, " with jackpot symbol: ", this.testModeStopIndex);
    }

    public getGrandJPAmount(): number {
        return this.grandJPAmount;
    }

    public setGrandJPAmount(amount: number): void {
        this.grandJPAmount = amount;
    }


}

