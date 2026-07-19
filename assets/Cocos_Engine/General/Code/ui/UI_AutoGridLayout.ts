import { _decorator, Component, Layout, Size, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UI_AutoGridLayout')
export class UI_AutoGridLayout extends Component {
    @property(Layout)
    public gridLayout: Layout | null = null;

    protected onEnable(): void {
        view.on('canvas-resize', this.updateLayout, this);
        this.node.on(UITransform.EventType.SIZE_CHANGED, this.updateLayout, this);
        this.updateLayout();
    }

    protected onDisable(): void {
        view.off('canvas-resize', this.updateLayout, this);
        this.node.off(UITransform.EventType.SIZE_CHANGED, this.updateLayout, this);
    }

    private updateLayout(): void {
        if (!this.gridLayout) {
            console.error('[UI_AutoGridLayout] Missing gridLayout');
            return;
        }

        const transform = this.gridLayout.node.getComponent(UITransform);
        if (!transform) {
            console.error('[UI_AutoGridLayout] Missing UITransform on gridLayout');
            return;
        }

        const count = this.gridLayout.node.children.length;
        if (count === 0) {
            return;
        }

        const containerWidth = transform.contentSize.width;
        const containerHeight = transform.contentSize.height;
        const spacingX = this.gridLayout.spacingX;
        const spacingY = this.gridLayout.spacingY;
        let columns = 1;
        let rows = count;
        let cell = 0;

        for (let candidateColumns = 1; candidateColumns <= count; candidateColumns++) {
            const candidateRows = Math.ceil(count / candidateColumns);
            const availableWidth = containerWidth - spacingX * (candidateColumns - 1);
            const availableHeight = containerHeight - spacingY * (candidateRows - 1);
            const candidateCell = Math.min(availableWidth / candidateColumns, availableHeight / candidateRows);

            if (candidateCell > cell) {
                columns = candidateColumns;
                rows = candidateRows;
                cell = candidateCell;
            }
        }

        cell = Math.max(0, cell);
        const usedWidth = columns * cell + spacingX * (columns - 1);
        const usedHeight = rows * cell + spacingY * (rows - 1);

        this.gridLayout.type = Layout.Type.GRID;
        this.gridLayout.resizeMode = Layout.ResizeMode.CHILDREN;
        this.gridLayout.constraint = Layout.Constraint.FIXED_COL;
        this.gridLayout.constraintNum = columns;
        this.gridLayout.cellSize = new Size(cell, cell);
        this.gridLayout.paddingLeft = (containerWidth - usedWidth) * 0.5;
        this.gridLayout.paddingRight = this.gridLayout.paddingLeft;
        this.gridLayout.paddingTop = (containerHeight - usedHeight) * 0.5;
        this.gridLayout.paddingBottom = this.gridLayout.paddingTop;
        this.gridLayout.updateLayout(true);
    }
}
