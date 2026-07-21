import { _decorator, Component, instantiate, Node, Prefab, Sprite, SpriteFrame, Vec3 } from 'cc';
import { GridService } from '../../../Cocos_Engine/General/Code/grid/GridService';
import { HitBox } from './HitBox';
import { Arrow } from './Arrow';
import { CellDirection } from './CellDirection';
import { PlayerDamage } from '../Player/PlayerDamage';

const { ccclass, property } = _decorator;

@ccclass('Turret')
export class Turret extends Component {
    @property(Prefab)
    public arrowPrefab: Prefab | null = null;

    @property
    public shotInterval = 2;

    @property(Node)
    public view: Node | null = null;

    @property(Sprite)
    public sprite: Sprite | null = null;

    @property(SpriteFrame)
    public idleSprite: SpriteFrame | null = null;

    @property(SpriteFrame)
    public shotSprite: SpriteFrame | null = null;

    @property
    public shotFrameDuration = 0.1;

    private grid: GridService | null = null;
    private level: readonly (readonly string[])[] = [];
    private column = 0;
    private row = 0;
    private direction: CellDirection = 'top';
    private playerDamage: PlayerDamage | null = null;
    private remaining = 0;
    private shotFrameRemaining = 0;
    private viewScale = new Vec3(1, 1, 1);

    public configure(grid: GridService, level: readonly (readonly string[])[], column: number, row: number, direction: CellDirection, playerDamage: PlayerDamage): void {
        if (!this.arrowPrefab || !this.node.parent) {
            console.error('[Turret] Missing arrow Prefab or parent');
            this.enabled = false;
            return;
        }
        this.grid = grid;
        this.level = level;
        this.column = column;
        this.row = row;
        this.direction = direction;
        this.playerDamage = playerDamage;
        this.remaining = this.shotInterval;
        this.shotFrameRemaining = 0;
        if (this.sprite && this.idleSprite) this.sprite.spriteFrame = this.idleSprite;
        if (this.view) {
            const scale = this.view.scale;
            this.viewScale.set(Math.abs(scale.x), scale.y, scale.z);
            this.view.setScale(direction === 'right' ? -this.viewScale.x : this.viewScale.x, this.viewScale.y, this.viewScale.z);
            this.view.angle = direction === 'top' ? -90 : direction === 'down' ? 90 : 0;
        }
    }

    protected update(deltaTime: number): void {
        if (!this.grid || !this.arrowPrefab || !this.node.parent || !this.playerDamage) return;
        if (this.shotFrameRemaining > 0) {
            this.shotFrameRemaining -= deltaTime;
            if (this.shotFrameRemaining <= 0 && this.sprite && this.idleSprite) this.sprite.spriteFrame = this.idleSprite;
        }
        this.remaining -= deltaTime;
        if (this.remaining > 0) return;
        this.remaining = this.shotInterval;
        this.shotFrameRemaining = this.shotFrameDuration;
        if (this.sprite && this.shotSprite) this.sprite.spriteFrame = this.shotSprite;
        const node = instantiate(this.arrowPrefab);
        const arrow = node.getComponent(Arrow);
        const hitBox = node.getComponent(HitBox);
        if (!arrow || !hitBox) {
            console.error('[Turret] Arrow Prefab missing Arrow or HitBox');
            node.destroy();
            return;
        }
        this.node.parent.addChild(node);
        arrow.configure(this.grid, this.level, this.column, this.row, this.direction);
        hitBox.configure(this.playerDamage);
    }
}
