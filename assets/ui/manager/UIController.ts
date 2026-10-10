import { _decorator, Component } from 'cc';
import { IUIController } from '../../core/ui/interface/IUIController';
import { UIControllerToken } from '../../core/base/UIControllerToken';


const { ccclass } = _decorator;

@ccclass('UIController')
export class UIController {

    private static _instance: UIController;
    public static get instance(): UIController {
        if (!this._instance) {
            this._instance = new UIController();
        }
        return this._instance;
    }

    private active = false;

    private constructor() { }

    private controllers = new Map<UIControllerToken, IUIController>();

    load(): void {
        if (this.active)
            return;
        this.active = true;
    }

    register(key: UIControllerToken, controller: IUIController): void {
        this.controllers.set(key, controller);
    }

    initAll(): void {
        this.controllers.forEach(c => c.init());
    }

    show(key: UIControllerToken): void {
        this.controllers.get(key)?.show();
    }

    hide(key: UIControllerToken): void {
        this.controllers.get(key)?.hide();
    }

    enable(key: UIControllerToken): void {
        this.controllers.get(key)?.enable();
    }

    disable(key: UIControllerToken): void {
        this.controllers.get(key)?.disable();
    }

    hideAll(): void {
        this.controllers.forEach(c => c.hide());
    }

    destroy() {
        if (!this.active) return;
        this.active = false;
    }
}
