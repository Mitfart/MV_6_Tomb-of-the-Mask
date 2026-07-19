import { _decorator, CCBoolean, CCFloat, CCInteger, log, Node, Vec3, view } from 'cc';
import { OrientationSwitch } from './OrientationSwitch';
const { ccclass, property } = _decorator;

@ccclass('OrientationSwitchAngle')
export class OrientationSwitchAngle extends OrientationSwitch {
    @property(CCFloat) ver_angle: number = 0;
    @property(CCFloat) hor_angle: number = 0;
    

    protected applyOrientation(isPortrait: boolean): void {
        this.node.angle = isPortrait ? this.ver_angle : this.hor_angle;
    }
}