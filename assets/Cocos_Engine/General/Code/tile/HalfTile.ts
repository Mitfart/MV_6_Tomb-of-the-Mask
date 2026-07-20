import { _decorator, Component, Sprite, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HalfTile')
export class HalfTile extends Component {
    @property(Sprite) public sprite: Sprite | null = null;
    @property({ type: SpriteFrame, displayName: 'Top left', group: { name: 'Corners', displayOrder: 1 } }) public topLeft: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Top right', group: { name: 'Corners', displayOrder: 1 } }) public topRight: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Bottom left', group: { name: 'Corners', displayOrder: 1 } }) public bottomLeft: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Bottom right', group: { name: 'Corners', displayOrder: 1 } }) public bottomRight: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Top', group: { name: 'Lines', displayOrder: 2 } }) public top: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Right', group: { name: 'Lines', displayOrder: 2 } }) public right: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Bottom', group: { name: 'Lines', displayOrder: 2 } }) public bottom: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Left', group: { name: 'Lines', displayOrder: 2 } }) public left: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Top left', group: { name: 'Inner corners', displayOrder: 3 } }) public innerTopLeft: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Top right', group: { name: 'Inner corners', displayOrder: 3 } }) public innerTopRight: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Bottom left', group: { name: 'Inner corners', displayOrder: 3 } }) public innerBottomLeft: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Bottom right', group: { name: 'Inner corners', displayOrder: 3 } }) public innerBottomRight: SpriteFrame | null = null;

    public setVariant(variant: number): void {
        const frame = [null, this.bottomRight, this.bottomLeft, this.bottom, this.topRight, this.right, null, this.innerTopLeft, this.topLeft, null, this.left, this.innerTopRight, this.top, this.innerBottomLeft, this.innerBottomRight, null][variant];
        if (this.sprite) this.sprite.spriteFrame = frame;
    }
}
