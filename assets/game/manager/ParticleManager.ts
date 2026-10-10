import { _decorator, Component, ParticleSystem2D } from 'cc';
const { ccclass, property } = _decorator;

export enum ParticleGroupName {
    NONE = 'NONE',
    BIG_WIN = 'BIG_WIN',
    MEGA_WIN = 'MEGA_WIN',
    SUPER_WIN = 'SUPER_WIN',
    SCATTER_HIGHLIGHT = 'SCATTER_HIGHLIGHT'
}

@ccclass('ParticleGroup')
export class ParticleGroup {
    @property
    name = ParticleGroupName.NONE;

    @property([ParticleSystem2D])
    particles: ParticleSystem2D[] = [];
}
@ccclass('ParticleManager')
export class ParticleManager extends Component {

    public static _instance: ParticleManager;

    @property([ParticleGroup])
    groups: ParticleGroup[] = [];

    onLoad(): void {
        if (ParticleManager._instance) {
            console.warn('Multiple instances of ParticleManager detected. This should not happen.');
        }
        ParticleManager._instance = this;
    }

    play(groupName: ParticleGroupName): void {
        this.getGroup(groupName)?.forEach(p => {
            p.node.active = true;
            p.resetSystem();
        });
    }

    stop(groupName: ParticleGroupName): void {
        this.getGroup(groupName)?.forEach(p => {
            p.stopSystem();
        });
    }

    disable(groupName: ParticleGroupName): void {
        this.getGroup(groupName)?.forEach(p => {
            p.node.active = false;
        });
    }

    private getGroup(name: ParticleGroupName): ParticleSystem2D[] | null {
        return this.groups.find(g => g.name === name)?.particles ?? null;
    }
}



