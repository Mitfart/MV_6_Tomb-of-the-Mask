import { _decorator, Component, Node, Size, Sprite, SpriteFrame, tween, Tween, Vec3 } from 'cc';
import { HitBox } from './HitBox';

const { ccclass, property } = _decorator;

@ccclass('Fish')
export class Fish extends Component {
    @property(Node)
    public visual: Node | null = null;

    @property(Sprite)
    public sprite: Sprite | null = null;

    @property(SpriteFrame)
    public smallSprite: SpriteFrame | null = null;

    @property(SpriteFrame)
    public bigSprite: SpriteFrame | null = null;

    @property
    public smallDuration = 1.5;

    @property
    public bigDuration = 1;

    private hitBox: HitBox | null = null;
    private baseSize = new Size();
    private visualScale = new Vec3(1, 1, 1);
    private expanded = false;
    private remaining = 0;

    public configure(cellSize: number): void {
        this.hitBox = this.getComponent(HitBox);
        const collider = this.hitBox?.hitbox;
        if (!collider) {
            console.error('[Fish] Missing HitBox or BoxCollider2D');
            this.enabled = false;
            return;
        }
        this.baseSize.set(cellSize, cellSize);
        const scale = this.visual?.scale ?? Vec3.ONE;
        this.visualScale.set(scale.x, scale.y, scale.z);
        this.expanded = false;
        this.remaining = this.smallDuration;
        this.applyState();
    }

    protected onDisable(): void {
        if (this.visual) Tween.stopAllByTarget(this.visual);
    }

    protected update(deltaTime: number): void {
        if (!this.hitBox) return;
        this.remaining -= deltaTime;
        if (this.remaining > 0) return;
        this.expanded = !this.expanded;
        this.remaining = this.expanded ? this.bigDuration : this.smallDuration;
        this.applyState();
    }

    private applyState(): void {
        const collider = this.hitBox?.hitbox;
        if (!collider) return;
        const size = this.expanded ? 3 : 1;
        collider.size = new Size(this.baseSize.width * size, this.baseSize.height * size);
        const frame = this.expanded ? this.bigSprite : this.smallSprite;
        if (this.sprite && frame) this.sprite.spriteFrame = frame;
        if (this.visual) tween(this.visual)
            .to(0.1, { scale: new Vec3(
                this.visualScale.x * (this.expanded ? 1 : 1 / 3),
                this.visualScale.y * (this.expanded ? 1 : 1 / 3),
                this.visualScale.z,
            ) })
            .start();
    }
}
