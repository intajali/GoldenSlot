import { _decorator, Component, ParticleSystem2D, Vec2, Vec3, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SquareOrbitParticles')
export class SquareOrbitParticles extends Component {

    @property(ParticleSystem2D)
    particleSystem: ParticleSystem2D = null!;

    @property(Node)
    centerObject: Node = null!; // parent square

    @property
    orbitSize: number = 100; // half-square size

    @property
    speed: number = 180; // degrees/sec

    private angle: number = 0;

    private isActive: boolean = false;

    show() {
        // console.log('Showing square orbit particles');
        this.particleSystem.resetSystem();
        this.isActive = true;
    }

    hide() {
        this.isActive = false;
        this.particleSystem.stopSystem();
    }

    update(deltaTime: number) {
        if (!this.isActive) return;
        this.angle += this.speed * deltaTime;
        if (this.angle >= 360) this.angle -= 360;

        const half = this.orbitSize;
        const positions: Vec2[] = [
            new Vec2(-half, -half),
            new Vec2(half, -half),
            new Vec2(half, half),
            new Vec2(-half, half)
        ];

        const t = (this.angle % 360) / 90;
        const edgeIndex = Math.floor(t);
        const lerpT = t - edgeIndex;

        const start = positions[edgeIndex];
        const end = positions[(edgeIndex + 1) % 4];

        // Local position relative to centerObject
        const localPos = new Vec3(
            start.x + (end.x - start.x) * lerpT,
            start.y + (end.y - start.y) * lerpT,
            0
        );

        // Set particle system as child of centerObject
        this.particleSystem.node.setParent(this.centerObject);
        this.particleSystem.node.setPosition(localPos);
    }
}