export interface IPopupData {
    title?: string;
    message?: string;
    source?: string; // Optional field to identify the source of the popup
    resolve?: (value: boolean) => void;
}

