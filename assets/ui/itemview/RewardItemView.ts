import { __private, _decorator, Button, tween, Label, Node, Vec3, UITransform } from 'cc';
import { BaseListItemView } from '../../core/base/BaseListItemView';
import { DailyRewardsDataModel } from '../model/DailyRewardsDataModel';
const { ccclass, property } = _decorator;

@ccclass('RewardItemView')
export class RewardItemView extends BaseListItemView<DailyRewardsDataModel> {

    @property({ type: Button })
    private claimButton: Button;

    @property({ type: Label })
    private lbClaimAmount: Label;

    @property({ type: Node })
    private lockNode: Node;

    @property({ type: Node })
    private coinNode: Node;

    public onItemClicked?: (data: DailyRewardsDataModel, coinPos: Vec3) => void;
    private itemData: DailyRewardsDataModel;

    private isClaimed: boolean = false;
    private isLocked: boolean = false;

    render(data: DailyRewardsDataModel): void {
        this.itemData = data;
        this.isClaimed = data.claimed;
        this.isLocked = data.locked;
        this.lbClaimAmount.string = `$${data.amount}`;
        this.claimButton.node.off(Button.EventType.CLICK, this.onClaimButtonClicked, this);
        this.claimButton.node.on(Button.EventType.CLICK, this.onClaimButtonClicked, this);
        if (this.isLocked) {
            this.lockNode.active = true;
            this.claimButton.interactable = false;
        } else {
            this.lockNode.active = false;
            this.claimButton.interactable = true;
        }
        if (this.isClaimed) {
            this.claimButton.interactable = false; // Disable the claim button
        }
        //else {
        //     this.claimButton.interactable = true; // Enable the claim button
        // }
    }

    onClaimButtonClicked() {
        if (this.isLocked) {
            console.log("Item is locked and cannot be claimed.");
            return;
        }
        if (!this.isClaimed) {
            this.isClaimed = true;
            this.lockNode.active = false; // Show lock icon to indicate claimed
            this.claimButton.interactable = false; // Disable the claim button
        }
        this.onItemClicked?.(this.itemData, this.coinNode.getWorldPosition());
    }
}



