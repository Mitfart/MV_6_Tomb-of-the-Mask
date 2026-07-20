import { _decorator, Component, instantiate, Node, Prefab, SpriteFrame } from 'cc';
import { GridService } from '../grid/GridService';
import { RuleTile } from './RuleTile';

const { ccclass, property } = _decorator;

@ccclass('RuleTileRenderer')
export class RuleTileRenderer extends Component {
    @property(GridService) public grid: GridService | null = null;
    @property(Prefab) public tilePrefab: Prefab | null = null;
    @property(Node) public tileParent: Node | null = null;

    public render(level: readonly (readonly string[])[]): void {
        if (!this.grid || !this.tilePrefab || !this.tileParent) return;
        this.tileParent.removeAllChildren();
        for (let row = 0; row < level.length; row++) for (let column = 0; column < level[row].length; column++) {
            if (!this.isWall(level, column, row)) continue;
            const tile = instantiate(this.tilePrefab);
            const view = tile.getComponent(RuleTile);
            if (!view) {
                console.error('[RuleTileRenderer] tilePrefab missing RuleTile');
                return;
            }
            view.setFrame(this.getFrame(view, level, column, row));
            tile.setPosition(this.grid.cellToWorld(column, row));
            this.tileParent.addChild(tile);
        }
    }

    private getFrame(v: RuleTile, l: readonly (readonly string[])[], x: number, y: number): SpriteFrame | null {
        const t = this.isWall(l, x, y - 1), r = this.isWall(l, x + 1, y), b = this.isWall(l, x, y + 1), left = this.isWall(l, x - 1, y);
        const tl = this.isWall(l, x - 1, y - 1), tr = this.isWall(l, x + 1, y - 1), bl = this.isWall(l, x - 1, y + 1), br = this.isWall(l, x + 1, y + 1);
        if (t && r && b && left) {
            if (!tl && !tr && bl && br) return v.topSingleInner;
            if (tl && !tr && !bl && br) return v.rightSingleInner;
            if (tl && tr && !bl && !br) return v.bottomSingleInner;
            if (!tl && tr && bl && !br) return v.leftSingleInner;
            if (!tl || !tr || !bl || !br) return v.centerInner;
            return v.center;
        }
        if (left && r && !t && !b) return v.centerHorizontal;
        if (t && b && !left && !r) return v.centerVertical;
        if (b && !t && !left && !r) return v.topSingle;
        if (left && !t && !r && !b) return v.rightSingle;
        if (t && !r && !b && !left) return v.bottomSingle;
        if (r && !t && !b && !left) return v.leftSingle;
        if (r && b && !t && !left) return v.topLeft;
        if (left && b && !t && !r) return v.topRight;
        if (r && t && !b && !left) return v.bottomLeft;
        if (left && t && !b && !r) return v.bottomRight;
        if (tl && br && !tr && !bl) return v.diagonalTopLeftBottomRight;
        if (tr && bl && !tl && !br) return v.diagonalTopRightBottomLeft;
        if (!t) return v.top;
        if (!r) return v.right;
        if (!b) return v.bottom;
        if (!left) return v.left;
        return v.defaultTile;
    }

    private isWall(level: readonly (readonly string[])[], x: number, y: number): boolean {
        return y >= 0 && y < level.length && x >= 0 && x < level[0].length && level[y][x] === '#';
    }
}
