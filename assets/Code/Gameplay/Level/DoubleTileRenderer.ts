import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { GridService } from '../../../Cocos_Engine/General/Code/grid/GridService';
import { HalfTile } from '../../../Cocos_Engine/General/Code/tile/HalfTile';

const { ccclass, property } = _decorator;

@ccclass('DoubleTileRenderer')
export class DoubleTileRenderer extends Component {
    @property(GridService) public grid!: GridService;
    @property(Prefab) public tilePrefab!: Prefab;
    @property(Node) public tileParent!: Node;

    public render(level: readonly (readonly string[])[]): void {
        this.tileParent.removeAllChildren();
        const offset = this.grid.cellSize * 0.25;

        for (let row = 0; row < level.length; row++) for (let column = 0; column < level[row].length; column++) {
            if (level[row][column].includes('T')) continue;
            const center = this.grid.cellToWorld(column, row);
            // Cell chars: [0] top, [1] down, [2] left, [3] right. # wall, ^ spike, . empty, P player.
            for (let halfRow = 0; halfRow < 2; halfRow++) for (let halfColumn = 0; halfColumn < 2; halfColumn++) {
                if (!this.isWall(level, column * 2 + halfColumn, row * 2 + halfRow)
                    || this.isSpike(level[row][column], halfColumn, halfRow)) continue;

                const tile = instantiate(this.tilePrefab);
                const halfTile = tile.getComponent(HalfTile);
                if (!halfTile) {
                    console.error('[DoubleTileRenderer] Tile Prefab missing HalfTile');
                    tile.destroy();
                    return;
                }
                halfTile.setVariant(this.getVariant(level, column * 2 + halfColumn, row * 2 + halfRow));
                tile.setPosition(
                    center.x + (halfColumn ? offset : -offset),
                    center.y + (halfRow ? -offset : offset),
                );
                this.tileParent.addChild(tile);
            }
        }
    }

    public getVariant(level: readonly (readonly string[])[], column: number, row: number): number {
        const top = this.isWall(level, column, row - 1);
        const down = this.isWall(level, column, row + 1);
        const left = this.isWall(level, column - 1, row);
        const right = this.isWall(level, column + 1, row);
        if (!top && !left) return 8;
        if (!top && !right) return 4;
        if (!down && !left) return 2;
        if (!down && !right) return 1;
        if (!top) return 12;
        if (!down) return 3;
        if (!left) return 10;
        if (!right) return 5;
        if (!this.isWall(level, column - 1, row - 1)) return 14;
        if (!this.isWall(level, column + 1, row - 1)) return 13;
        if (!this.isWall(level, column - 1, row + 1)) return 11;
        if (!this.isWall(level, column + 1, row + 1)) return 7;
        return 15;
    }

    public isSpike(cell: string, halfColumn: number, halfRow: number): boolean {
        return cell[halfRow] === '^' || cell[halfColumn + 2] === '^';
    }

    public getSpikeVariant(cell: string, halfColumn: number, halfRow: number): number {
        const vertical = cell[halfRow] === '^';
        const horizontal = cell[halfColumn + 2] === '^';
        if (vertical && horizontal) return [8, 4, 2, 1][halfRow * 2 + halfColumn];
        if (vertical) return halfRow === 0 ? 12 : 3;
        return halfColumn === 0 ? 10 : 5;
    }

    private isWall(level: readonly (readonly string[])[], column: number, row: number): boolean {
        if (row < 0 || row >= level.length * 2 || column < 0 || column >= level[0].length * 2) return false;
        const cell = level[Math.floor(row / 2)][Math.floor(column / 2)];
        return cell.includes('T') || this.isSolid(cell[row % 2]) || this.isSolid(cell[column % 2 + 2]);
    }

    private isSolid(value: string): boolean { return value === '#' || value === '^' || value === 'T'; }
}
