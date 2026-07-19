import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { GridService } from '../../Cocos_Engine/General/Code/grid/GridService';
import { DualGridRenderer } from '../../Cocos_Engine/General/Code/tile/DualGridRenderer';
import { PlayerController } from '../Player/PlayerController';

const { ccclass, property } = _decorator;

@ccclass('LevelBuilder')
export class LevelBuilder extends Component {
    @property(GridService)
    public grid: GridService | null = null;

    @property(DualGridRenderer)
    public dualGrid: DualGridRenderer | null = null;

    @property(PlayerController)
    public player: PlayerController | null = null;

    @property(Prefab)
    public wallColliderPrefab: Prefab | null = null;

    @property(Node)
    public wallParent: Node | null = null;

    public build(level: readonly (readonly string[])[]): void {
        const start = this.validate(level);
        if (!start || !this.grid || !this.dualGrid || !this.player || !this.wallColliderPrefab || !this.wallParent) {
            console.error('[LevelBuilder] Missing reference or invalid level');
            return;
        }

        this.grid.configure(level[0].length, level.length);
        this.wallParent.removeAllChildren();
        for (let row = 0; row < level.length; row++) {
            for (let column = 0; column < level[row].length; column++) {
                if (level[row][column] !== '#') continue;
                const wall = instantiate(this.wallColliderPrefab);
                wall.setPosition(this.grid.cellToWorld(column, row));
                this.wallParent.addChild(wall);
            }
        }
        this.dualGrid.render(level);
        this.player.configure(level, start.x, start.y);
    }

    private validate(level: readonly (readonly string[])[]): { x: number; y: number } | null {
        if (level.length < 3 || level.some(row => row.length !== level[0].length)) {
            console.error('[LevelBuilder] Level must be rectangular');
            return null;
        }

        let start: { x: number; y: number } | null = null;
        for (let row = 0; row < level.length; row++) {
            for (let column = 0; column < level[row].length; column++) {
                const edge = row === 0 || column === 0 || row === level.length - 1 || column === level[row].length - 1;
                if (edge && level[row][column] !== '#') {
                    console.error('[LevelBuilder] Level edge must be walls');
                    return null;
                }
                if (level[row][column] === 'P') {
                    if (start) {
                        console.error('[LevelBuilder] Level must have one Player spawn');
                        return null;
                    }
                    start = { x: column, y: row };
                }
            }
        }
        if (!start) console.error('[LevelBuilder] Level missing Player spawn');
        return start;
    }
}
