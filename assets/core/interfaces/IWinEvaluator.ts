export interface IWinEvaluator<T> {
    evaluate(visibleSymbols: string[][]): T;
}
