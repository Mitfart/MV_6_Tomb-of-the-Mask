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

    @property({ type: SpriteFrame, displayName: 'Spikes/Line' })
    public spikeLine: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Spikes/Corner' })
    public spikeCorner: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Spikes/Inner corner' })
    public spikeInnerCorner: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Spikes/Diagonal' })
    public spikeDiagonal: SpriteFrame | null = null;

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

    public setSpikeVariant(variant: number): void {
        if (!this.sprite) return;
        const spike = variant === 3 || variant === 5 || variant === 10 || variant === 12 ? this.spikeLine
            : variant === 1 || variant === 2 || variant === 4 || variant === 8 ? this.spikeCorner
                : variant === 7 || variant === 11 || variant === 13 || variant === 14 ? this.spikeInnerCorner
                    : variant === 6 || variant === 9 ? this.spikeDiagonal : null;
        if (!spike) {
            console.error(`[DualGridTile] Missing spike frame for variant ${variant}`);
            return;
        }
        this.sprite.spriteFrame = spike;
        this.node.angle = [0, 90, 180, -90][[3, 5, 12, 10].indexOf(variant)] ?? 0;
    }
}
