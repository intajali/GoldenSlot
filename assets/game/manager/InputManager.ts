// InputManager.ts
import { input, Input, EventKeyboard, EventTouch, KeyCode } from 'cc';
import { InputAction } from '../../core/base/InputAction';
import { commandBus } from '../../core/events/CommandBus';
import { GameCommand } from '../../core/events/GameCommand';


export class InputManager {

    private enabled = false;

    public constructor() { }

    // ------------------------------------------------------------------
    // LIFECYCLE
    // ------------------------------------------------------------------
    enable(): void {
        if (this.enabled) return;
        this.enabled = true;

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    disable(): void {
        if (!this.enabled) return;
        this.enabled = false;

        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    destroy(): void {
        this.disable();
    }

    // ------------------------------------------------------------------
    // INPUT TRANSLATION
    // ------------------------------------------------------------------
    private onKeyDown(event: EventKeyboard): void {
        switch (event.keyCode) {
            case KeyCode.KEY_S:
            case KeyCode.SPACE:
                this.dispatch(InputAction.SPIN);
                break;

        }
    }

    private onTouchEnd(event: EventTouch): void {
        // Example: tap anywhere spins
        //this.dispatch(InputAction.SPIN);
    }

    // ------------------------------------------------------------------
    // DISPATCH GAME INTENT
    // ------------------------------------------------------------------
    private dispatch(action: InputAction): void {
        switch (action) {
            case InputAction.SPIN:
                commandBus.execute(GameCommand.SPIN);
                break;
        }
    }
}
