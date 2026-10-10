// EventPayloads.ts
import { DailyRewardsDataModel } from '../../ui/model/DailyRewardsDataModel';
import { BetDataModel } from '../models/BetDataModel';
import { GameEvent } from './GameEvent';

export interface EventPayloadMap {
    [GameEvent.CONFIG_LOADED]: any;

    [GameEvent.BET_CHANGED]: BetDataModel;
    [GameEvent.CREDIT_CHANGED]: number;

    [GameEvent.SPIN_SPEED_CHANGED]: number;
    [GameEvent.DAILY_REWARD_CLAIMED]: number;

    [GameEvent.SPIN_STARTED]: void;
    [GameEvent.SPIN_ENDED]: void;
    [GameEvent.GAME_STATE_CHANGED]: string;
    [GameEvent.WIN_PRESENTATION]: any;

    [GameEvent.WIN_UPDATED]: any;
    [GameEvent.WIN_SNAPPED_DONE]: boolean;

    [GameEvent.AUTO_SPIN_COUNTER_UPDATED]: number;
    [GameEvent.AUTO_SPIN_STARTED]: number;
    [GameEvent.AUTO_SPIN_STOPPED]: void;

    [GameEvent.FREE_SPIN_COUNTER_UPDATED]: number;
    [GameEvent.FREE_SPIN_WIN]: number;
    [GameEvent.FREE_SPIN_STARTED]: void;
    [GameEvent.FREE_SPIN_ENDED]: void;
    [GameEvent.START_REWARDS_TIMER]: void;

    [GameEvent.PROGRESSIVE_JACKPOT_UPDATED]: number;
}
