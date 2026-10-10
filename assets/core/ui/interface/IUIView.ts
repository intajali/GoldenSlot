export interface IUIView {
    render(data?: any): void;
    hide(): void;
    setInteractable?(value: boolean): void;
}
