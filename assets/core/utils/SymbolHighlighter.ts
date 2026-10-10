import { _decorator, Component, Sprite, Animation, Color, AnimationClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SymbolHighlighter')
export class SymbolHighlighter extends Component {

    private sprite!: Sprite;
    private anim!: Animation;

    @property(AnimationClip)
    private line_win_anim: AnimationClip = null!;
    @property(AnimationClip)
    private bonus_win_anim: AnimationClip = null!;
    @property(AnimationClip)
    private idle_anim: AnimationClip = null!;

    public set(symbolSprite: Sprite) {
        this.sprite = symbolSprite;
        this.anim = this.node.getComponent(Animation)!;
    }

    public highlightLineWin() {
        if (!this.anim.getState(this.line_win_anim.name)) {
            this.anim.addClip(this.line_win_anim);
        }
        this.anim.stop();
        this.anim.play(this.line_win_anim.name);
    }

    public highlightBonusWin() {
        if (!this.anim.getState(this.bonus_win_anim.name)) {
            this.anim.addClip(this.bonus_win_anim);
        }
        this.anim.stop();
        this.anim.play(this.bonus_win_anim.name);
    }

    public clear() {
        if (!this.anim.getState(this.idle_anim.name)) {
            this.anim.addClip(this.idle_anim);
        }
        this.anim.stop();
        this.anim.play(this.idle_anim.name);
    }
}
