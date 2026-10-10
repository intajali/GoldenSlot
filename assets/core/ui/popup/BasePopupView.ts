import { _decorator, Component } from 'cc';
import { IPopupData } from './IPopupData';
import { IPopup } from './IPopup';
const { ccclass } = _decorator;

@ccclass('BasePopupView')
export abstract class BasePopupView<T extends IPopupData>
    extends Component
    implements IPopup<T> {
    abstract popupId: string;
    protected data!: T;

    show(data: T): void {
        this.data = data;
        this.applyData(data);
        this.node.active = true;
    }

    hide(): void {
        this.node.active = false;
    }

    // Hooks (Template Method)
    protected abstract applyData(data: T): void;


}
