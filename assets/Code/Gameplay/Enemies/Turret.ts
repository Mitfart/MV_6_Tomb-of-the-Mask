import { _decorator, Component, instantiate, Prefab } from 'cc';
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

    private grid: GridService | null = null;
    private level: readonly (readonly string[])[] = [];
    private column = 0;
    private row = 0;
    private direction: CellDirection = 'top';
    private playerDamage: PlayerDamage | null = null;
    private remaining = 0;

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
    }

    protected update(deltaTime: number): void {
        if (!this.grid || !this.arrowPrefab || !this.node.parent || !this.playerDamage) return;
        this.remaining -= deltaTime;
        if (this.remaining > 0) return;
        this.remaining = this.shotInterval;
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
