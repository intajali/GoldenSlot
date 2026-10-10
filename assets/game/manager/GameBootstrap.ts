import { _decorator, Component, game, input, Node } from 'cc';
import { BaseBootstrap } from '../../core/base/BaseBootstrap';
import { InputManager } from './InputManager';
const { ccclass, property } = _decorator;

@ccclass('GameBootstrap')
export class GameBootstrap extends BaseBootstrap {

    private inputManager: InputManager = null;
    protected start(): void {
        this.inputManager = new InputManager();
        this.inputManager.enable();
    }

    protected onDestroy(): void {
        this.shotdown();
    }

    protected shotdown(): void {
        this.inputManager?.destroy();
    }

}

