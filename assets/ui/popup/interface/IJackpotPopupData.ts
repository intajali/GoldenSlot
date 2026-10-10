
import { IPopupData } from 'db://assets/core/ui/popup/IPopupData';
import { JackpotSymbol } from 'db://assets/game/jackpot/JackpotSymbol';

export interface IJackpotPopupData extends IPopupData {
    winAmount: number;
    jpSymbol: JackpotSymbol;
}

