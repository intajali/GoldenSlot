export class GameException extends Error {
    public readonly code: string;

    constructor(message: string, code = 'GAME_ERROR') {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
    }
}

export class ConfigLoadException extends GameException {
    constructor(message: string) {
        super(message, 'CONFIG_LOAD_FAILED');
    }
}