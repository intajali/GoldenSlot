
import { BasePopupView } from "db://assets/core/ui/popup/BasePopupView";
import { IPopupData } from "db://assets/core/ui/popup/IPopupData";
import { PopupType } from "db://assets/core/enum/PopupType";

export class PopupHandler {

    private static _instance: PopupHandler;
    static get instance() {
        return this._instance ??= new PopupHandler();
    }
    private popups = new Map<PopupType, BasePopupView<any>>();

    private activePopup?: BasePopupView<any>;

    register(popupType: PopupType, popup: BasePopupView<any>) {
        this.popups.set(popupType, popup);
        popup.node.active = false;
    }



    show<T>(type: PopupType, data?: T) {
        this.activePopup?.hide();

        const popup = this.popups.get(type);
        this.activePopup = popup;
        if (!popup) {
            console.error(`Popup not found: ${type}`);
            return;
        }
        popup.show(data);
    }

    hideCurrent() {
        this.activePopup?.hide();
        this.activePopup = undefined;
    }
}
