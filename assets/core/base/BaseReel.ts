import { Component } from "cc";

export abstract class BaseReel extends Component {
    abstract startSpin(): void;
    abstract stopAt(index: number, isBonus?: boolean): Promise<void>;
    abstract isSpinning(): boolean;
    abstract setSpinSpeed?(speed: number): void;
}
