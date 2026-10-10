import { __private, _decorator, Button, Component, instantiate, Node, Prefab } from 'cc';
import { IUIView } from '../../core/ui/interface/IUIView';
import { AutoSpinItemView } from '../itemview/AutoSpinItemView';
import { AutoSpinItemDataModel } from '../model/AutoSpinItemDataModel';
const { ccclass, property } = _decorator;

@ccclass('AutoSpinPanelView')
export class AutoSpinPanelView extends Component implements IUIView {

    @property({ type: Button })
    private btnStart: Button;

    @property({ type: Button })
    private btnClose: Button;

    @property({ type: Node })
    private itemParent: Node;

    @property({ type: Prefab })
    private itemPrefab: Prefab;

    private spinCounts = [10, 20, 30, 40, 50];

    private generatedItems: Node[] = [];

    public onStartButtonClicked?: () => void;
    public onCloseButtonClicked?: () => void;
    public onItemSelected?: (spinCount: number) => void;

    protected onLoad(): void {
        this.btnStart.node.on(Button.EventType.CLICK, () => this.onStartButtonClicked?.(), this);
        this.btnClose.node.on(Button.EventType.CLICK, () => this.onCloseButtonClicked?.(), this);
    }

    render(): void {
        for (let i = 0; i < this.spinCounts.length; i++) {
            const itemNode = this.generateItems(i);
            const itemComponent = itemNode.getComponent(AutoSpinItemView);
            if (itemComponent) {
                itemComponent.render(new AutoSpinItemDataModel(this.spinCounts[i], i));
                itemComponent.onItemClicked = (data: AutoSpinItemDataModel) => {
                    this.onSpinItemSelected(data);
                };
            }
        }
        this.setInteractable(false);
        this.node.active = true;
    }

    hide(): void {
        this.node.active = false;
    }

    private onSpinItemSelected(data: AutoSpinItemDataModel): void {
        this.generatedItems.forEach((itemNode, index) => {
            const itemComponent = itemNode.getComponent(AutoSpinItemView);
            if (itemComponent) {
                itemComponent.updateSelection(index === data.itemIndex);
            }
        });
        this.onItemSelected?.(data.spinCount);
    }

    setInteractable?(value: boolean): void {
        this.btnStart.interactable = value;
    }

    generateItems(index: number): Node {

        if (index < this.generatedItems.length) {
            return this.generatedItems[index];
        } else {

            const itemNode = instantiate(this.itemPrefab);
            itemNode.setParent(this.itemParent); // Detach from any parent
            itemNode.setPosition(0, 0, 0);
            itemNode.setScale(1, 1, 1);

            this.generatedItems.push(itemNode);
            return itemNode;
        }
    }

    protected onDestroy(): void {
        this.btnStart.node.off(Button.EventType.CLICK, () => this.onStartButtonClicked?.(), this);
        this.btnClose.node.off(Button.EventType.CLICK, () => this.onCloseButtonClicked?.(), this);
    }

}



