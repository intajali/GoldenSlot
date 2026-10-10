import { IPopupData } from "db://assets/core/ui/popup/IPopupData";


export interface IWinPopupData extends IPopupData {
    winAmount: number;
    currency?: string;
    multiplier?: number;

    onCollect: () => void;
}
