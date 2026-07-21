import { _decorator, Component, tween, Tween, Vec3 } from 'cc';
import { GridService } from '../../../Cocos_Engine/General/Code/grid/GridService';
import { CellDirection, directionToDelta } from './CellDirection';

const { ccclass, property } = _decorator;

@ccclass('Arrow')
export class Arrow extends Component {
    @property
    public cellsPerSecond = 4;

    @property
    public popDuration = 0.08;

    private grid: GridService | null = null;
    private baseScale = new Vec3();
    private target = new Vec3();

    public configure(grid: GridService, level: readonly (readonly string[])[], column: number, row: number, direction: CellDirection): void {
        this.grid = grid;
        const scale = this.node.scale;
        this.baseScale.set(direction === 'right' ? -Math.abs(scale.x) : Math.abs(scale.x), scale.y, scale.z);
        this.node.angle = direction === 'top' ? -90 : direction === 'down' ? 90 : 0;
        const start = grid.cellToWorld(column, row);
        const [deltaColumn, deltaRow] = directionToDelta(direction);
        while (true) {
            const nextColumn = column + deltaColumn;
            const nextRow = row + deltaRow;
            if (nextRow < 0 || nextRow >= level.length || nextColumn < 0 || nextColumn >= level[0].length || this.isWall(level[nextRow][nextColumn])) break;
            column = nextColumn;
            row = nextRow;
        }
        this.target.set(grid.cellToWorld(column, row));
        this.node.setPosition(
            start.x + deltaColumn * grid.cellSize * 0.5,
            start.y - deltaRow * grid.cellSize * 0.5,
        );
        this.node.setScale(0, 0, this.baseScale.z);
        tween(this.node).to(this.popDuration, { scale: this.baseScale }).start();
    }

    protected onDisable(): void {
        Tween.stopAllByTarget(this.node);
    }

    protected update(deltaTime: number): void {
        if (!this.grid) return;
        const position = this.node.position;
        const distance = Vec3.distance(position, this.target);
        const step = this.cellsPerSecond * this.grid.cellSize * deltaTime;
        if (distance <= step) {
            this.node.destroy();
            return;
        }
        this.node.setPosition(
            position.x + (this.target.x - position.x) * step / distance,
            position.y + (this.target.y - position.y) * step / distance,
        );
    }

    private isWall(cell: string): boolean { return cell.includes('#') || cell.includes('^') || cell.includes('T'); }
}
