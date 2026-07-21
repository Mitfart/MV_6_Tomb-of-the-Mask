import { _decorator, Component, Vec3 } from 'cc';
import { GridService } from '../../../Cocos_Engine/General/Code/grid/GridService';
import { CellDirection, directionToDelta } from './CellDirection';

const { ccclass, property } = _decorator;

@ccclass('Bat')
export class Bat extends Component {
    @property
    public cellsPerSecond = 2;

    @property
    public wallWaitSeconds = 0.5;

    private grid: GridService | null = null;
    private from = new Vec3();
    private to = new Vec3();
    private target = new Vec3();
    private waitRemaining = 0;

    public configure(grid: GridService, level: readonly (readonly string[])[], column: number, row: number, direction: CellDirection): void {
        this.grid = grid;
        const [deltaColumn, deltaRow] = directionToDelta(direction);
        const from = this.findEnd(level, column, row, -deltaColumn, -deltaRow);
        const to = this.findEnd(level, column, row, deltaColumn, deltaRow);
        this.from.set(grid.cellToWorld(from.column, from.row));
        this.to.set(grid.cellToWorld(to.column, to.row));
        this.target.set(this.to);
        this.node.setPosition(grid.cellToWorld(column, row));
    }

    protected update(deltaTime: number): void {
        if (!this.grid) return;
        if (this.waitRemaining > 0) {
            this.waitRemaining -= deltaTime;
            return;
        }
        const position = this.node.position;
        const distance = Vec3.distance(position, this.target);
        const step = this.cellsPerSecond * this.grid.cellSize * deltaTime;
        if (distance <= step) {
            this.node.setPosition(this.target);
            this.target.set(this.target.equals(this.from) ? this.to : this.from);
            this.waitRemaining = this.wallWaitSeconds;
            return;
        }
        this.node.setPosition(
            position.x + (this.target.x - position.x) * step / distance,
            position.y + (this.target.y - position.y) * step / distance,
        );
    }

    private findEnd(level: readonly (readonly string[])[], column: number, row: number, deltaColumn: number, deltaRow: number): { column: number; row: number } {
        while (true) {
            const nextColumn = column + deltaColumn;
            const nextRow = row + deltaRow;
            if (nextRow < 0 || nextRow >= level.length || nextColumn < 0 || nextColumn >= level[0].length || this.isWall(level[nextRow][nextColumn])) return { column, row };
            column = nextColumn;
            row = nextRow;
        }
    }

    private isWall(cell: string): boolean { return cell.includes('#') || cell.includes('^') || cell.includes('T'); }
}
