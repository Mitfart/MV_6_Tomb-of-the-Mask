import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { GridService } from '../../Cocos_Engine/General/Code/grid/GridService';
import { HalfTileLite } from '../../Cocos_Engine/General/Code/tile/HalfTileLite';
import { DoubleTileRenderer } from './DoubleTileRenderer';
import { PlayerController } from '../Player/PlayerController';
import type { LevelConfig } from '../../Infrastructure/LevelLibrary';

const { ccclass, property } = _decorator;

@ccclass('LevelBuilder')
export class LevelBuilder extends Component {
    @property(GridService) public grid!: GridService;
    @property(DoubleTileRenderer) public tileRenderer!: DoubleTileRenderer;
    @property(PlayerController) public player!: PlayerController;
    @property(Prefab) public wallColliderPrefab!: Prefab;
    @property(Node) public wallParent!: Node;
    @property(Prefab) public spikePrefab!: Prefab;
    @property(Node) public spikeParent!: Node;

    public build(config: LevelConfig): void {
        const level = config.cells;
        const start = this.validate(level);
        if (!start) {
            console.error('[LevelBuilder] Invalid level');
            return;
        }
        this.grid.configure(level[0].length, level.length);
        this.wallParent.removeAllChildren();
        this.spikeParent.removeAllChildren();
        this.tileRenderer.render(level);
        for (let row = 0; row < level.length; row++) for (let column = 0; column < level[row].length; column++) {
            const cell = level[row][column];
            if (this.isWall(cell)) {
                const wall = instantiate(this.wallColliderPrefab);
                wall.setPosition(this.grid.cellToWorld(column, row));
                this.wallParent.addChild(wall);
            }
            const center = this.grid.cellToWorld(column, row);
            const offset = this.grid.cellSize * 0.25;
            for (let halfRow = 0; halfRow < 2; halfRow++) for (let halfColumn = 0; halfColumn < 2; halfColumn++) {
                if (!this.tileRenderer.isSpike(cell, halfColumn, halfRow)) continue;
                const spike = instantiate(this.spikePrefab);
                const halfTile = spike.getComponent(HalfTileLite);
                if (!halfTile) {
                    console.error('[LevelBuilder] Spike Prefab missing HalfTileLite');
                    spike.destroy();
                    return;
                }
                halfTile.setVariant(this.tileRenderer.getSpikeVariant(cell, halfColumn, halfRow));
                spike.setPosition(center.x + (halfColumn ? offset : -offset), center.y + (halfRow ? -offset : offset));
                this.spikeParent.addChild(spike);
            }
        }
        this.player.configure(level, start.x, start.y);
    }

    private validate(level: readonly (readonly string[])[]): { x: number; y: number } | null {
        if (level.length < 3 || level.some(row => row.length !== level[0].length || row.some(cell => cell.length !== 4))) return null;
        let start: { x: number; y: number } | null = null;
        for (let row = 0; row < level.length; row++) for (let column = 0; column < level[row].length; column++) {
            const cell = level[row][column];
            if ((row === 0 || column === 0 || row === level.length - 1 || column === level[row].length - 1) && !this.isWall(cell)) return null;
            if (cell.includes('P')) {
                if (start) return null;
                start = { x: column, y: row };
            }
        }
        return start;
    }

    private isWall(cell: string | undefined): boolean { return cell?.includes('#') || cell?.includes('^') || false; }
}
