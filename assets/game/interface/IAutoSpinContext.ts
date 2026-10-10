export interface IAutoSpinContext {
    isAutoSpinEnabled(): boolean;
    consumeAutoSpin(): void;
    getAutoSpinCount(): number;
    disableAutoSpin(): void;
}
