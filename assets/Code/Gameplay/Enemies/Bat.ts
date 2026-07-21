import { _decorator, Component, Node, Vec3 } from 'cc';
import { GridService } from '../../../Cocos_Engine/General/Code/grid/GridService';
import { CellDirection, directionToDelta } from './CellDirection';

const { ccclass, property } = _decorator;

@ccclass('Bat')
export class Bat extends Component {
    @property
    public cellsPerSecond = 2;

    @property
    public wallWaitSeconds = 0.5;

    @property
    public swayAmplitude = 4;

    @property
    public swayFrequency = 4;

    @property(Node)
    public view: Node | null = null;

    private grid: GridService | null = null;
    private from = new Vec3();
    private to = new Vec3();
    private target = new Vec3();
    private basePosition = new Vec3();
    private viewScale = new Vec3(1, 1, 1);
    private horizontal = false;
    private swayTime = 0;
    private waitRemaining = 0;

    public configure(grid: GridService, level: readonly (readonly string[])[], column: number, row: number, direction: CellDirection): void {
        this.grid = grid;
        const [deltaColumn, deltaRow] = directionToDelta(direction);
        this.horizontal = deltaColumn !== 0;
        const from = this.findEnd(level, column, row, -deltaColumn, -deltaRow);
        const to = this.findEnd(level, column, row, deltaColumn, deltaRow);
        this.from.set(grid.cellToWorld(from.column, from.row));
        this.to.set(grid.cellToWorld(to.column, to.row));
        this.target.set(this.to);
        this.basePosition.set(grid.cellToWorld(column, row));
        this.node.setPosition(this.basePosition);
        const scale = this.view?.scale ?? Vec3.ONE;
        this.viewScale.set(Math.abs(scale.x), scale.y, scale.z);
        this.updateView();
    }

    protected update(deltaTime: number): void {
        if (!this.grid) return;
        if (this.waitRemaining > 0) {
            this.waitRemaining -= deltaTime;
            return;
        }
        const distance = Vec3.distance(this.basePosition, this.target);
        const step = this.cellsPerSecond * this.grid.cellSize * deltaTime;
        if (distance <= step) {
            this.basePosition.set(this.target);
            this.node.setPosition(this.target);
            this.target.set(this.target.equals(this.from) ? this.to : this.from);
            this.updateView();
            this.waitRemaining = this.wallWaitSeconds;
            return;
        }
        this.basePosition.set(
            this.basePosition.x + (this.target.x - this.basePosition.x) * step / distance,
            this.basePosition.y + (this.target.y - this.basePosition.y) * step / distance,
        );
        this.swayTime += deltaTime;
        const offset = Math.sin(this.swayTime * this.swayFrequency * Math.PI * 2) * this.swayAmplitude;
        this.node.setPosition(
            this.basePosition.x + (this.horizontal ? 0 : offset),
            this.basePosition.y + (this.horizontal ? offset : 0),
        );
    }

    private updateView(): void {
        if (!this.view) return;
        const mirror = this.target.x < this.basePosition.x || this.target.y < this.basePosition.y;
        this.view.setScale(mirror ? -this.viewScale.x : this.viewScale.x, this.viewScale.y, this.viewScale.z);
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
