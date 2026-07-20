import { _decorator, Component, Label } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('UI_CoinCounter')
export class UI_CoinCounter extends Component {
    @property(Label) public value: Label | null = null;

    public setCount(count: number): void {
        if (!this.value) {
            console.error('[UI_CoinCounter] Missing value');
            return;
        }
        this.value.string = String(count);
    }
}
