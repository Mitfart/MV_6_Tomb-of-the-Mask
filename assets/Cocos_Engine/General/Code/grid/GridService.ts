import { _decorator, Component, Vec2, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('GridService')
export class GridService extends Component {
    @property
    public cellSize = 100;

    private width = 0;
    private height = 0;

    public configure(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    public cellToWorld(column: number, row: number): Vec3 {
        const clamped = this.clampCell(column, row);
        return new Vec3(
            (clamped.x - (this.width - 1) * 0.5) * this.cellSize,
            ((this.height - 1) * 0.5 - clamped.y) * this.cellSize,
        );
    }

    public vertexToWorld(column: number, row: number): Vec3 {
        return new Vec3(
            (column - this.width * 0.5) * this.cellSize,
            (this.height * 0.5 - row) * this.cellSize,
        );
    }

    public worldToCell(position: Readonly<Vec3>): Vec2 {
        const column = Math.round(position.x / this.cellSize + (this.width - 1) * 0.5);
        const row = Math.round((this.height - 1) * 0.5 - position.y / this.cellSize);
        return this.clampCell(column, row);
    }

    public clampCell(column: number, row: number): Vec2 {
        return new Vec2(
            Math.max(0, Math.min(this.width - 1, column)),
            Math.max(0, Math.min(this.height - 1, row)),
        );
    }
}
