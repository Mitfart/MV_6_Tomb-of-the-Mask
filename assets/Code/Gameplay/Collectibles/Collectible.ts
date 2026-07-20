import { _decorator, Component, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { UI_GameController } from '../../UI/UI_GameController';

const { ccclass, property } = _decorator;

export enum CollectibleKind {
    Point,
    Coin,
    CoinBoost,
}

@ccclass('Collectible')
export class Collectible extends Component {
    @property(Sprite) public sprite: Sprite | null = null;
    @property(SpriteFrame) public coinSprite: SpriteFrame | null = null;
    @property public collectRadius = 18;

    private kind = CollectibleKind.Point;
    private player: Component | null = null;
    private ui: UI_GameController | null = null;
    private onCoinBoost: ((center: Readonly<Vec3>) => void) | null = null;
    private previousPlayerPosition = new Vec3();
    private baseScale = new Vec3(1, 1, 1);

    public configure(kind: CollectibleKind, player: Component, ui: UI_GameController | null, onCoinBoost: ((center: Readonly<Vec3>) => void) | null): void {
        this.kind = kind;
        this.player = player;
        this.ui = ui;
        this.onCoinBoost = onCoinBoost;
        this.baseScale.set(this.node.scale);
        this.previousPlayerPosition.set(player.node.worldPosition);
        this.node.active = true;
    }

    public getKind(): CollectibleKind { return this.kind; }

    public convertToCoin(delay: number): void {
        if (!this.node.active || this.kind !== CollectibleKind.Point) return;
        this.kind = CollectibleKind.Coin;
        tween(this.node)
            .delay(delay)
            .to(0.04, { scale: this.baseScale.clone().multiplyScalar(0.7) })
            .call(() => {
                if (this.node.active && this.sprite && this.coinSprite) this.sprite.spriteFrame = this.coinSprite;
            })
            .to(0.06, { scale: this.baseScale.clone().multiplyScalar(1.35) })
            .to(0.08, { scale: this.baseScale })
            .start();
    }

    protected update(): void {
        if (!this.player || !this.node.active) return;
        const current = this.player.node.worldPosition;
        if (this.touchesPlayer(this.previousPlayerPosition, current)) this.collect();
        this.previousPlayerPosition.set(current);
    }

    private collect(): void {
        switch (this.kind) {
            case CollectibleKind.Coin:
                this.ui?.addCoin();
                break;
            case CollectibleKind.CoinBoost:
                this.onCoinBoost?.(this.node.worldPosition);
                break;
        }
        this.node.active = false;
    }

    private touchesPlayer(from: Readonly<Vec3>, to: Readonly<Vec3>): boolean {
        const point = this.node.worldPosition;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const lengthSquared = dx * dx + dy * dy;
        const progress = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((point.x - from.x) * dx + (point.y - from.y) * dy) / lengthSquared));
        const closestX = from.x + dx * progress;
        const closestY = from.y + dy * progress;
        const radius = this.collectRadius * this.collectRadius;
        const distanceX = point.x - closestX;
        const distanceY = point.y - closestY;
        return distanceX * distanceX + distanceY * distanceY <= radius;
    }
}
