import { IPopupData } from "./IPopupData";

export interface IPopup<T extends IPopupData> {
    show(data: T): void;
    hide(): void;
}
