import { IUIController } from "../ui/interface/IUIController";

export abstract class BaseUIController<TView> implements IUIController {
    protected view: TView;

    constructor(view: TView) {
        this.view = view;
    }

    abstract init(): void;

    show(): void {
        (this.view as any).show?.();
    }

    hide(): void {
        (this.view as any).hide?.();
    }

    enable(): void {
        (this.view as any).setInteractable?.(true);
    }

    disable(): void {
        (this.view as any).setInteractable?.(false);
    }
}
