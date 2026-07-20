import { _decorator, Component, Node } from 'cc';

const { ccclass, property } = _decorator;

export const PLAYER_DIED = 'player-died';

@ccclass('PlayerDamage')
export class PlayerDamage extends Component {
    @property(Component)
    public controller: Component | null = null;

    @property(Node)
    public visual: Node | null = null;

    private dead = false;

    public damage(): void {
        if (this.dead) return;
        this.dead = true;
        if (this.controller) this.controller.enabled = false;
        if (this.visual) this.visual.active = false;
        this.node.emit(PLAYER_DIED);
    }

    public reset(): void {
        this.dead = false;
        if (this.controller) this.controller.enabled = true;
        if (this.visual) this.visual.active = true;
    }
}
