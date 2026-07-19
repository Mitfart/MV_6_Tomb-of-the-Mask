import { _decorator, Component, UITransform, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UI_AspectFillToParent')
export class UI_AspectFillToParent extends Component {
    @property(UITransform)
    public target: UITransform | null = null;

    protected onEnable(): void {
        view.on('canvas-resize', this.updateScale, this);
        this.node.on(UITransform.EventType.SIZE_CHANGED, this.updateScale, this);
        this.node.parent?.on(UITransform.EventType.SIZE_CHANGED, this.updateScale, this);
        this.updateScale();
    }

    protected onDisable(): void {
        view.off('canvas-resize', this.updateScale, this);
        this.node.off(UITransform.EventType.SIZE_CHANGED, this.updateScale, this);
        this.node.parent?.off(UITransform.EventType.SIZE_CHANGED, this.updateScale, this);
    }

    private updateScale(): void {
        const target = this.target ?? this.node.getComponent(UITransform);
        if (!target) {
            console.error('[UI_AspectFillToParent] Missing target');
            return;
        }

        const parent = target.node.parent?.getComponent(UITransform);
        if (!parent) {
            console.error('[UI_AspectFillToParent] Missing parent UITransform');
            return;
        }

        const targetSize = target.contentSize;
        const parentSize = parent.contentSize;
        if (targetSize.width <= 0 || targetSize.height <= 0 || parentSize.width <= 0 || parentSize.height <= 0) {
            return;
        }

        const scale = Math.max(parentSize.width / targetSize.width, parentSize.height / targetSize.height);
        target.node.setScale(scale, scale, target.node.scale.z);
    }
}
