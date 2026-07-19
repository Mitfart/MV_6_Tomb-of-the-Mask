import { _decorator, Component, randomRangeInt, SpriteComponent, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('RandomSpriteRenderer')
export class RandomSpriteRenderer extends Component {
    @property(SpriteComponent) renderer: SpriteComponent = null;
    @property([SpriteFrame]) sprites: SpriteFrame[] = [];


    protected onLoad(): void {
        this.renderer.spriteFrame = this.sprites[randomRangeInt(0, this.sprites.length)];
    }
}