import { _decorator, Component, instantiate, Label, Node, UITransform, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('UI_CoinAddict')
export class UI_CoinAddict extends Component {
    @property(Label) public title: Label | null = null;
    @property public waveHeight = 12;
    @property public waveSpeed = 8;
    @property public waveOffset = 0.7;

    private glyphs: Node[] = [];
    private basePositions: Vec3[] = [];
    private elapsed = 0;

    protected onLoad(): void {
        if (!this.title) {
            console.error('[UI_CoinAddict] Missing title');
            return;
        }
        this.title.node.active = false;
    }

    protected update(deltaTime: number): void {
        if (this.glyphs.length === 0) return;
        this.elapsed += deltaTime;
        for (let index = 0; index < this.glyphs.length; index++) {
            const position = this.basePositions[index];
            this.glyphs[index].setPosition(position.x, position.y + Math.sin(this.elapsed * this.waveSpeed + index * this.waveOffset) * this.waveHeight, position.z);
        }
    }

    public show(): void {
        this.hide();
        if (!this.title || this.title.node.parent !== this.node) {
            console.error('[UI_CoinAddict] Title must be a direct child');
            return;
        }
        const text = this.title.string;
        const transform = this.title.getComponent(UITransform);
        const width = transform?.width ?? this.title.fontSize * text.length;
        const step = width / text.length;
        const origin = this.title.node.position;
        this.elapsed = 0;
        for (let index = 0; index < text.length; index++) {
            const glyph = instantiate(this.title.node);
            glyph.parent = this.node;
            glyph.setScale(1, 1, 1);
            glyph.active = true;
            glyph.getComponent(Label)!.string = text[index];
            glyph.setPosition(origin.x - width * 0.5 + step * (index + 0.5), origin.y, origin.z);
            this.glyphs.push(glyph);
            this.basePositions.push(glyph.position.clone());
        }
    }

    public hide(): void {
        for (const glyph of this.glyphs) glyph.destroy();
        this.glyphs = [];
        this.basePositions = [];
    }
}
