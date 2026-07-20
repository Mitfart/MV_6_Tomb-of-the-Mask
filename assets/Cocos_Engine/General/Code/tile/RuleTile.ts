import { _decorator, Component, Sprite, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('RuleTile')
export class RuleTile extends Component {
    @property(Sprite) public sprite: Sprite | null = null;
    @property({ type: SpriteFrame, displayName: 'Default', group: { name: 'Default', displayOrder: 0 } }) public defaultTile: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Top', group: { name: 'Edges', displayOrder: 1 } }) public top: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Right', group: { name: 'Edges', displayOrder: 1 } }) public right: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Bottom', group: { name: 'Edges', displayOrder: 1 } }) public bottom: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Left', group: { name: 'Edges', displayOrder: 1 } }) public left: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Top left', group: { name: 'Corners', displayOrder: 2 } }) public topLeft: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Top right', group: { name: 'Corners', displayOrder: 2 } }) public topRight: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Bottom left', group: { name: 'Corners', displayOrder: 2 } }) public bottomLeft: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Bottom right', group: { name: 'Corners', displayOrder: 2 } }) public bottomRight: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Top left', group: { name: 'Inner corners', displayOrder: 3 } }) public innerTopLeft: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Top right', group: { name: 'Inner corners', displayOrder: 3 } }) public innerTopRight: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Bottom left', group: { name: 'Inner corners', displayOrder: 3 } }) public innerBottomLeft: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Bottom right', group: { name: 'Inner corners', displayOrder: 3 } }) public innerBottomRight: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Top', group: { name: 'Singles', displayOrder: 4 } }) public topSingle: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Right', group: { name: 'Singles', displayOrder: 4 } }) public rightSingle: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Bottom', group: { name: 'Singles', displayOrder: 4 } }) public bottomSingle: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Left', group: { name: 'Singles', displayOrder: 4 } }) public leftSingle: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Top', group: { name: 'Inner singles', displayOrder: 5 } }) public topSingleInner: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Right', group: { name: 'Inner singles', displayOrder: 5 } }) public rightSingleInner: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Bottom', group: { name: 'Inner singles', displayOrder: 5 } }) public bottomSingleInner: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Left', group: { name: 'Inner singles', displayOrder: 5 } }) public leftSingleInner: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Horizontal', group: { name: 'Centers', displayOrder: 6 } }) public centerHorizontal: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Vertical', group: { name: 'Centers', displayOrder: 6 } }) public centerVertical: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'No corners', group: { name: 'Centers', displayOrder: 6 } }) public centerInner: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Full', group: { name: 'Centers', displayOrder: 6 } }) public center: SpriteFrame | null = null;

    @property({ type: SpriteFrame, displayName: 'Top left + bottom right', group: { name: 'Diagonals', displayOrder: 7 } }) public diagonalTopLeftBottomRight: SpriteFrame | null = null;
    @property({ type: SpriteFrame, displayName: 'Top right + bottom left', group: { name: 'Diagonals', displayOrder: 7 } }) public diagonalTopRightBottomLeft: SpriteFrame | null = null;

    public setFrame(frame: SpriteFrame | null): void { if (this.sprite) this.sprite.spriteFrame = frame || this.defaultTile; }
}
