import { _decorator, Component } from 'cc';
import { UI_CoinAddict } from './UI_CoinAddict';
import { UI_CoinCounter } from './UI_CoinCounter';

const { ccclass, property } = _decorator;

@ccclass('UI_GameController')
export class UI_GameController extends Component {
    @property(UI_CoinCounter) public coinCounter: UI_CoinCounter | null = null;
    @property(UI_CoinAddict) public coinAddict: UI_CoinAddict | null = null;

    private coins = 0;

    public resetCoins(): void {
        this.coins = 0;
        this.coinCounter?.setCount(this.coins);
        this.coinAddict?.hide();
    }

    public addCoin(): void {
        this.coins++;
        this.coinCounter?.setCount(this.coins);
    }

    public showCoinAddict(): void {
        this.coinAddict?.show();
    }
}
