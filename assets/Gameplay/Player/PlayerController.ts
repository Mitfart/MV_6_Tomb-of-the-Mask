import { _decorator, Component, input, Input, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
import { GridService } from '../../Cocos_Engine/General/Code/grid/GridService';

const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(GridService)
    public grid: GridService | null = null;

    @property(RigidBody2D)
    public body: RigidBody2D | null = null;

    @property
    public cellsPerSecond = 10;

    @property(Node)
    public trail: Node | null = null;

    private level: readonly (readonly string[])[] = [];
    private cell = new Vec2();
    private target: Vec3 | null = null;
    private touchStart = new Vec2();

    protected onEnable(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    protected onDisable(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public configure(level: readonly (readonly string[])[], startColumn: number, startRow: number): void {
        this.level = level;
        this.cell.set(startColumn, startRow);
        const position = this.grid?.cellToWorld(startColumn, startRow);
        if (position) this.node.setPosition(position);
        if (this.trail) this.trail.active = false;
    }

    protected update(deltaTime: number): void {
        if (!this.target || !this.grid || !this.body) return;
        const remaining = Vec3.distance(this.node.position, this.target);
        if (remaining > this.cellsPerSecond * this.grid.cellSize * deltaTime) return;

        this.node.setPosition(this.target);
        this.body.linearVelocity = Vec2.ZERO;
        this.target = null;
        if (this.trail) this.trail.active = false;
    }

    private onTouchStart(event: any): void {
        const point = event.getLocation();
        this.touchStart.set(point.x, point.y);
    }

    private onTouchEnd(event: any): void {
        if (this.target || !this.grid || !this.body || this.level.length === 0) return;
        const point = event.getLocation();
        const delta = new Vec2(point.x - this.touchStart.x, point.y - this.touchStart.y);
        if (delta.length() < 20) return;

        const direction = Math.abs(delta.x) >= Math.abs(delta.y)
            ? new Vec2(Math.sign(delta.x), 0)
            : new Vec2(0, Math.sign(delta.y));
        const targetCell = this.findTarget(direction);
        if (targetCell.equals(this.cell)) return;

        this.cell = targetCell;
        this.target = this.grid.cellToWorld(targetCell.x, targetCell.y);
        if (this.trail) {
            this.trail.angle = direction.x > 0 ? 0 : direction.x < 0 ? 180 : direction.y > 0 ? 90 : -90;
            this.trail.active = true;
        }
        this.body.linearVelocity = new Vec2(
            direction.x * this.cellsPerSecond * this.grid.cellSize,
            -direction.y * this.cellsPerSecond * this.grid.cellSize,
        );
    }

    private findTarget(direction: Readonly<Vec2>): Vec2 {
        const candidate = this.cell.clone();
        while (true) {
            const next = new Vec2(candidate.x + direction.x, candidate.y - direction.y);
            if (next.y < 0 || next.y >= this.level.length || next.x < 0 || next.x >= this.level[0].length || this.level[next.y][next.x] === '#') {
                return candidate;
            }
            candidate.set(next);
        }
    }
}
