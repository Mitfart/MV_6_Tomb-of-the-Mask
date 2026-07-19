import { _decorator, Button, Component } from 'cc';
import super_html_playable from './super_html_playable';
const { ccclass } = _decorator;

@ccclass('UI_GameDownloadBtn')
export class UI_GameDownloadBtn extends Component {
    private readonly buttons: Button[] = [];

    protected onEnable(): void {
        this.bindButtons();
    }

    protected onDisable(): void {
        this.unbindButtons();
    }

    private bindButtons(): void {
        this.unbindButtons();
        this.buttons.push(...this.getComponentsInChildren(Button));
        const ownButton = this.getComponent(Button);
        if (ownButton && !this.buttons.includes(ownButton)) {
            this.buttons.push(ownButton);
        }
        this.buttons.forEach(button => button.node.on(Button.EventType.CLICK, this.download, this));
    }

    private unbindButtons(): void {
        this.buttons.forEach(button => button.node.off(Button.EventType.CLICK, this.download, this));
        this.buttons.length = 0;
    }

    private download(): void {
        super_html_playable.download();
    }
}
