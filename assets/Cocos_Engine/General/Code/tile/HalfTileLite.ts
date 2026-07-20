import { _decorator, Component, Sprite, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HalfTileLite')
export class HalfTileLite extends Component {
    @property(Sprite) public sprite!: Sprite;
    @property({ type: SpriteFrame, displayName: 'Top-left corner' }) public corner!: SpriteFrame;
    @property({ type: SpriteFrame, displayName: 'Top line' }) public line!: SpriteFrame;
    @property({ type: SpriteFrame, displayName: 'Bottom-right inner corner' }) public innerCorner!: SpriteFrame;

    public setVariant(variant: number): void {
        this.sprite.spriteFrame = [null, this.corner, this.corner, this.line, this.corner, this.line, null, this.innerCorner, this.corner, null, this.line, this.innerCorner, this.line, this.innerCorner, this.innerCorner, null][variant];
        this.node.angle = [0, 180, 90, 180, -90, -90, 0, 180, 0, 0, 90, 90, 0, -90, 0, 0][variant];
    }
}
