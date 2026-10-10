import { IPopupData } from "./IPopupData";

export interface IConfirmPopup extends IPopupData {
    onConfirm: () => void;
    onCancel?: () => void;
}


