import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { GridService } from '../grid/GridService';
import { HalfTile } from './HalfTile';

const { ccclass, property } = _decorator;

@ccclass('DualGridRenderer')
export class DualGridRenderer extends Component {
    @property(GridService)
    public grid: GridService | null = null;

    @property(Prefab)
    public tilePrefab: Prefab | null = null;

    @property(Node)
    public tileParent: Node | null = null;

    public render(level: readonly (readonly string[])[]): void {
        if (!this.grid || !this.tilePrefab || !this.tileParent) {
            console.error('[DualGridRenderer] Missing grid, tilePrefab, or tileParent');
            return;
        }

        this.tileParent.removeAllChildren();
        const halfSize = this.grid.cellSize * 0.25;
        for (let row = 0; row < level.length; row++) {
            for (let column = 0; column < level[0].length; column++) {
                if (!this.isWall(level, column, row)) continue;
                const center = this.grid.cellToWorld(column, row);
                for (let halfRow = 0; halfRow < 2; halfRow++) {
                    for (let halfColumn = 0; halfColumn < 2; halfColumn++) {
                        const tile = instantiate(this.tilePrefab);
                        const view = tile.getComponent(HalfTile);
                        if (!view) {
                            console.error('[DualGridRenderer] tilePrefab missing HalfTile');
                            return;
                        }
                        view.setVariant(this.getVariant(level, column + halfColumn, row + halfRow));
                        tile.setPosition(center.x + (halfColumn ? halfSize : -halfSize), center.y + (halfRow ? -halfSize : halfSize));
                        this.tileParent.addChild(tile);
                    }
                }
            }
        }
    }

    private getVariant(level: readonly (readonly string[])[], column: number, row: number): number {
        return (this.isWall(level, column - 1, row - 1) ? 1 : 0)
            | (this.isWall(level, column, row - 1) ? 2 : 0)
            | (this.isWall(level, column - 1, row) ? 4 : 0)
            | (this.isWall(level, column, row) ? 8 : 0);
    }

    private isWall(level: readonly (readonly string[])[], column: number, row: number): boolean {
        return row >= 0 && row < level.length && column >= 0 && column < level[0].length && (level[row][column] === '#' || level[row][column] === 'W');
    }

}
