export interface IWinContext {
    onEvaluationCompleted(totalWin: number): void;
    isWinSnappingDone(): boolean;
}