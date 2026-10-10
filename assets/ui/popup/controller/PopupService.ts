import { PopupType } from "db://assets/core/enum/PopupType";
import { PopupHandler } from "./PopupHandler";

export class PopupService {

    //// Shows a sound selection popup and returns a promise that resolves to the user's choice.
    public static async showSoundSelection(title: string, source: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            PopupHandler.instance.show(PopupType.SOUND_SELECTION, {
                title,
                source,
                resolve
            });
        });
    }

    /// Shows a win popup with the given title and message, and returns a promise that resolves when the user interacts with the popup.
    public static async showFreeGameWinPopup(title: string, message: string, source: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            PopupHandler.instance.show(PopupType.WIN, {
                title,
                message,
                source,
                resolve
            });
        });
    }

    // Shows an error popup with the given title and message, and returns a promise that resolves when the user interacts with the popup.
    public static async showErrorPopup(title: string, message: string, source: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            PopupHandler.instance.show(PopupType.ERROR, {
                title,
                message,
                source,
                resolve
            });
        });
    }
}


