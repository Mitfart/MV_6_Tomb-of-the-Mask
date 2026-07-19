import { _decorator, Component, Sprite, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('DualGridTile')
export class DualGridTile extends Component {
    @property(Sprite)
    public sprite: Sprite | null = null;

    @property({ type: SpriteFrame, displayName: 'Top left' })
    public topLeft: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Top right' })
    public topRight: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Top' })
    public top: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Bottom left' })
    public bottomLeft: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Left' })
    public left: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Split: top-right + bottom-left' })
    public splitTopRightBottomLeft: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Inner bottom-right' })
    public innerBottomRight: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Bottom right' })
    public bottomRight: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Split: top-left + bottom-right' })
    public splitTopLeftBottomRight: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Right' })
    public right: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Inner bottom-left' })
    public innerBottomLeft: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Bottom' })
    public bottom: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Inner top-right' })
    public innerTopRight: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Inner top-left' })
    public innerTopLeft: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Center' })
    public center: SpriteFrame | null = null;

    public setVariant(variant: number): void {
        if (!this.sprite) {
            console.error('[DualGridTile] Missing sprite');
            return;
        }

        const frame = [
            null,
            this.bottomRight,
            this.bottomLeft,
            this.bottom,
            this.topRight,
            this.right,
            this.splitTopRightBottomLeft,
            this.innerTopLeft,
            this.topLeft,
            this.splitTopLeftBottomRight,
            this.left,
            this.innerTopRight,
            this.top,
            this.innerBottomLeft,
            this.innerBottomRight,
            this.center,
        ][variant];
        if (!frame) {
            console.error(`[DualGridTile] Missing frame for variant ${variant}`);
            return;
        }

        this.sprite.spriteFrame = frame;
    }
}
