// CommandBus.ts
type CommandHandler<T = any> = (payload?: T) => void;

export class CommandBus {

    private static _instance: CommandBus;
    static get instance(): CommandBus {
        if (!this._instance) {
            this._instance = new CommandBus();
        }
        return this._instance;
    }

    private handlers = new Map<string, CommandHandler>();

    register<T>(command: string, handler: CommandHandler<T>): void {
        this.handlers.set(command, handler);
    }

    unregister(command: string): void {
        this.handlers.delete(command);
    }

    execute<T>(command: string, payload?: T): void {
        const handler = this.handlers.get(command);
        if (!handler) {
            console.warn(`[CommandBus] No handler for ${command}`);
            return;
        }
        handler(payload);
    }

    clear(): void {
        this.handlers.clear();
    }
}

export const commandBus = CommandBus.instance;
