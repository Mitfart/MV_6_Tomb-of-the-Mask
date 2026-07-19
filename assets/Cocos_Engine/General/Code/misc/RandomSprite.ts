import { _decorator, Component, randomRangeInt, SpriteComponent, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('RandomSprite')
export class RandomSprite extends Component {
    @property(SpriteComponent) renderer: SpriteComponent = null;
    @property([SpriteFrame]) sprites: SpriteFrame[] = [];


    protected onLoad(): void {
        this.renderer.spriteFrame = this.sprites[randomRangeInt(0, this.sprites.length)];
    }
}