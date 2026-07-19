import { _decorator, Component, input, Input, Node, UITransform, Vec2, Vec3 } from 'cc';
import { GridService } from '../../Cocos_Engine/General/Code/grid/GridService';

const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(GridService)
    public grid: GridService | null = null;

    @property
    public cellsPerSecond = 10;

    @property(Node)
    public trail: Node | null = null;

    @property(Node)
    public visual: Node | null = null;

    private level: readonly (readonly string[])[] = [];
    private cell = new Vec2();
    private target: Vec3 | null = null;
    private moveStart = new Vec3();
    private trailOffset = new Vec3();
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
        if (this.trail) {
            this.trail.active = true;
            this.trail.setScale(0, 0, 1);
        }
    }

    protected update(deltaTime: number): void {
        if (!this.grid) return;
        if (!this.target) {
            this.retractTrail(deltaTime);
            return;
        }
        const remaining = Vec3.distance(this.node.position, this.target);
        const step = this.cellsPerSecond * this.grid.cellSize * deltaTime;
        if (remaining <= step) {
            this.node.setPosition(this.target);
            this.updateTrail();
            this.target = null;
            return;
        }

        const position = this.node.position;
        this.node.setPosition(
            position.x + (this.target.x - position.x) * step / remaining,
            position.y + (this.target.y - position.y) * step / remaining,
        );
        this.updateTrail();
    }

    private onTouchStart(event: any): void {
        const point = event.getLocation();
        this.touchStart.set(point.x, point.y);
    }

    private onTouchEnd(event: any): void {
        if (this.target || !this.grid || this.level.length === 0) return;
        const point = event.getLocation();
        const delta = new Vec2(point.x - this.touchStart.x, point.y - this.touchStart.y);
        if (delta.length() < 20) return;

        const direction = Math.abs(delta.x) >= Math.abs(delta.y)
            ? new Vec2(Math.sign(delta.x), 0)
            : new Vec2(0, Math.sign(delta.y));
        const targetCell = this.findTarget(direction);
        if (targetCell.equals(this.cell)) return;

        this.cell = targetCell;
        if (this.visual) this.visual.angle = direction.x > 0 ? 90 : direction.x < 0 ? -90 : direction.y > 0 ? 180 : 0;
        this.moveStart.set(this.node.position);
        this.trailOffset.set(-direction.x * this.grid.cellSize * 0.5, -direction.y * this.grid.cellSize * 0.5);
        this.target = this.grid.cellToWorld(targetCell.x, targetCell.y);
        if (this.trail) {
            this.trail.angle = (direction.x > 0 ? 0 : direction.x < 0 ? 180 : direction.y > 0 ? 90 : -90) - 90;
            this.trail.setScale(0, 0, 1);
            this.trail.active = true;
            this.updateTrail();
        }
    }

    private updateTrail(): void {
        if (!this.trail || !this.grid) return;
        const trailTransform = this.trail.getComponent(UITransform);
        if (!trailTransform) {
            console.error('[PlayerController] Trail missing UITransform');
            return;
        }

        const position = this.node.position;
        const cellsTravelled = Vec3.distance(this.moveStart, position) / this.grid.cellSize;
        trailTransform.setContentSize(this.grid.cellSize, this.grid.cellSize);
        this.trail.setScale(Math.min(1, cellsTravelled * 0.5), cellsTravelled, 1);
        this.trail.setPosition(
            (this.moveStart.x - position.x) * 0.5 + this.trailOffset.x,
            (this.moveStart.y - position.y) * 0.5 + this.trailOffset.y,
        );
    }

    private retractTrail(deltaTime: number): void {
        if (!this.trail) return;
        const scaleX = Math.max(0, this.trail.scale.x - deltaTime * 12);
        const scaleY = Math.max(0, this.trail.scale.y - deltaTime * 12);
        const positionScale = this.trail.scale.y === 0 ? 0 : scaleY / this.trail.scale.y;
        this.trail.setScale(scaleX, scaleY, 1);
        this.trail.setPosition(this.trail.position.x * positionScale, this.trail.position.y * positionScale);
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
