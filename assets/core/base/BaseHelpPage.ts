import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('BaseHelpPage')
export abstract class BaseHelpPage extends Component {
    show(): void {
        this.node.active = true;
        this.onBeforeShow();
        this.onShow();
    }

    hide(): void {
        this.onBeforeHide();
        this.node.active = false;
        this.onHide();
    }

    protected onBeforeShow(): void { }
    protected onBeforeHide(): void { }

    protected abstract onShow(): void;
    protected abstract onHide(): void;
}

