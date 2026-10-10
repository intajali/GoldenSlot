// EventBus.ts
import { EventTarget } from 'cc';
import { EventPayloadMap } from './EventPayloadMap';

type EventKey = keyof EventPayloadMap;
type EventCallback<T> = (payload: T) => void;

export class EventBus {

    private static _instance: EventBus;
    static get instance(): EventBus {
        if (!this._instance) {
            this._instance = new EventBus();
        }
        return this._instance;
    }

    private bus: EventTarget = new EventTarget();

    on<K extends EventKey>(
        event: K,
        callback: EventCallback<EventPayloadMap[K]>,
        target?: any
    ): void {
        this.bus.on(event as string, callback as any, target);
    }

    once<K extends EventKey>(
        event: K,
        callback: EventCallback<EventPayloadMap[K]>,
        target?: any
    ): void {
        this.bus.once(event as string, callback as any, target);
    }

    off<K extends EventKey>(
        event: K,
        callback: EventCallback<EventPayloadMap[K]>,
        target?: any
    ): void {
        this.bus.off(event as string, callback as any, target);
    }

    offByTarget(target: any): void {
        this.bus.targetOff(target);
    }

    emit<K extends EventKey>(
        event: K,
        payload?: EventPayloadMap[K]
    ): void {
        this.bus.emit(event as string, payload);
    }

    /** Clears ALL listeners safely */
    clear(): void {
        this.bus = new EventTarget();
    }
}

export const eventBus = EventBus.instance;
