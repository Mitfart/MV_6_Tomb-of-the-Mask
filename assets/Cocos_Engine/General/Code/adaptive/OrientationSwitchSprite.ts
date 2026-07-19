import { _decorator, CCInteger, log, Node, SpriteComponent, SpriteFrame, Vec3, view } from 'cc';
import { OrientationSwitch } from './OrientationSwitch';
const { ccclass, property } = _decorator;

@ccclass('OrientationSwitchSprite')
export class OrientationSwitchSprite extends OrientationSwitch {
    @property(SpriteComponent) target: SpriteComponent = null;
    @property(SpriteFrame) sprite_ver: SpriteFrame = null;
    @property(SpriteFrame) sprite_hor: SpriteFrame = null;


    protected applyOrientation(isPortrait: boolean): void {
        this.target.spriteFrame = isPortrait ? this.sprite_ver : this.sprite_hor;
    }
}