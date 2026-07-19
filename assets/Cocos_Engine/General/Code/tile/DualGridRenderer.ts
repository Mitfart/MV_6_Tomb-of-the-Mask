import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { GridService } from '../grid/GridService';
import { DualGridTile } from './DualGridTile';

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
        for (let row = 1; row < level.length; row++) {
            for (let column = 1; column < level[0].length; column++) {
                const variant = this.getVariant(level, column, row);
                if (variant === 0) continue;

                const tile = instantiate(this.tilePrefab);
                const view = tile.getComponent(DualGridTile);
                if (!view) {
                    console.error('[DualGridRenderer] tilePrefab missing DualGridTile');
                    return;
                }
                view.setVariant(variant);
                tile.setPosition(this.grid.vertexToWorld(column, row));
                this.tileParent.addChild(tile);
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
        return row >= 0 && row < level.length && column >= 0 && column < level[0].length && level[row][column] === '#';
    }

}
