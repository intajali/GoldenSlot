import { _decorator, Button, Component, Node } from 'cc';
import { IUIView } from '../../core/ui/interface/IUIView';
import { MenuButtonItemView } from '../itemview/MenuButtonItemView';
const { ccclass, property } = _decorator;

@ccclass('GameRulesButtonView')
export class GameRulesButtonView extends Component implements IUIView {

    private menuItemsNames: string[] = ['RULES', 'PAYTABLE', 'SP SYMBOLS', 'PAYLINES'];

    @property({ type: Button })
    private headerButtons: Button[] = [];

    private selectedIndex: number = -1;

    public onItemSelected?: (itemIndex: number) => void;

    onLoad() {
        // Attach click listeners once
        this.headerButtons.forEach((button, index) => {
            const itemView = button.getComponent(MenuButtonItemView);
            if (itemView) {
                itemView.onItemClicked = () => {
                    this.onSpinItemSelected(index);
                };
            }
        });
    }

    render(): void {

        this.headerButtons.forEach((button, index) => {
            const itemView = button.getComponent(MenuButtonItemView);
            if (itemView) {
                itemView.render({ label: this.menuItemsNames[index] || `Menu ${index + 1}`, index: index });
                itemView.updateSelection(index === 0); // default first selection
            }
        });

        this.node.active = true;
    }

    onSpinItemSelected(itemIndex: number): void {

        console.log("MenuButtonView :: iindex : ", itemIndex);

        if (this.selectedIndex === itemIndex) {
            return; // No change in selection
        }
        this.selectedIndex = itemIndex;

        this.headerButtons.forEach((itemNode, index) => {
            const itemComponent = itemNode.getComponent(MenuButtonItemView);
            if (itemComponent) {
                itemComponent.updateSelection(index === itemIndex);
            }
        });


        this.onItemSelected?.(this.selectedIndex);
    }

    hide(): void {

    }
    setInteractable?(value: boolean): void {

    }

}

