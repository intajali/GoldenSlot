

import { _decorator, Label, Button, view, Vec3, Node, Animation, AnimationClip } from 'cc';
import { IWinPopupData } from '../interface/IWinPopupData';
import { BasePopupView } from 'db://assets/core/ui/popup/BasePopupView';
import { TweenKey, TweenUtil } from 'db://assets/core/utils/TweenUtil';


const { ccclass, property } = _decorator;

@ccclass('WinPopupView')
export class WinPopupView extends BasePopupView<IWinPopupData> {
    popupId: string = 'WinPopup';

    @property(Label)
    titleLabel!: Label;

    @property(Label)
    winAmountLabel!: Label;

    @property(Label)
    multiplierLabel!: Label;

    @property(Button)
    collectButton!: Button;

    @property({ type: Node })
    private containerNode: Node;

    // PopupService.showWinPopup to show a popup for displaying win information when the game loads.

    protected applyData(data: IWinPopupData): void {
        console.log(`[WinPopup] Called from: ${data.source}`);

        this.titleLabel.string = data.title ?? 'YOU WIN';

        this.collectButton.node.off(Button.EventType.CLICK);
        this.collectButton.node.on(Button.EventType.CLICK, this.onCollectClicked, this);

        const screenWidth = view.getVisibleSize().width;

        // Start position (off-screen left)
        this.containerNode.setPosition(new Vec3(-screenWidth, 0, 0));

        TweenUtil.playSlideFromLeft(TweenKey.BONUS_WIN, this.containerNode, this.containerNode.position);
    }

    private playSpinButtonAnimation() {
        const anim = this.collectButton.node.getComponent(Animation);

        if (!anim) {
            console.warn("No Animation component found on collect button");
            return;
        }

        if (anim) {
            const clips = anim.clips;
            if (clips.length === 0) {
                console.warn("No animation clips attached");
                return;
            }

            anim.stop();
            anim.play(clips[0].name);
        }
    }

    show(data: IWinPopupData): void {
        super.show(data);
        this.playSpinButtonAnimation();
    }


    private onCollectClicked() {
        this.data.resolve(true);
        this.hide();
    }

}
