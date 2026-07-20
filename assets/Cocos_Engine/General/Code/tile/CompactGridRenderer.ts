import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { GridService } from '../grid/GridService';
import { DualGridTile } from './DualGridTile';

const { ccclass, property } = _decorator;

@ccclass('CompactGridRenderer')
export class CompactGridRenderer extends Component {
    @property(GridService) public grid: GridService | null = null;
    @property(Prefab) public tilePrefab: Prefab | null = null;
    @property(Node) public tileParent: Node | null = null;

    public render(level: readonly (readonly string[])[]): void {
        if (!this.grid || !this.tilePrefab || !this.tileParent) {
            console.error('[CompactGridRenderer] Missing grid, tilePrefab, or tileParent');
            return;
        }
        this.tileParent.removeAllChildren();
        for (let row = 0; row < level.length; row++) for (let column = 0; column < level[row].length; column++) {
            if (!this.isWall(level, column, row) || level[row][column] === 'W') continue;
            const tile = instantiate(this.tilePrefab);
            const view = tile.getComponent(DualGridTile);
            if (!view) {
                console.error('[CompactGridRenderer] tilePrefab missing DualGridTile');
                return;
            }
            view.setVariant(this.getVariant(level, column, row));
            tile.setPosition(this.grid.cellToWorld(column, row));
            this.tileParent.addChild(tile);
        }
    }

    private getVariant(level: readonly (readonly string[])[], column: number, row: number): number {
        const up = this.isWall(level, column, row - 1);
        const right = this.isWall(level, column + 1, row);
        const down = this.isWall(level, column, row + 1);
        const left = this.isWall(level, column - 1, row);
        if (right && down) return 14;
        if (left && down) return 13;
        if (right && up) return 11;
        if (left && up) return 7;
        if (left && right) return 12;
        if (up && down) return 10;
        if (up) return 8;
        if (right) return 4;
        if (down) return 2;
        if (left) return 1;
        return 15;
    }

    private isWall(level: readonly (readonly string[])[], column: number, row: number): boolean {
        return row >= 0 && row < level.length && column >= 0 && column < level[0].length && (level[row][column] === '#' || level[row][column] === 'W');
    }
}
