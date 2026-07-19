import { _decorator, Camera, CameraComponent, CCBoolean, CCFloat, CCInteger, log, Node, Vec3, view } from 'cc';
import { OrientationSwitch } from './OrientationSwitch';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('OrientationSwitchCamera')
@requireComponent(Camera)
export class OrientationSwitchCamera extends OrientationSwitch {
    @property(CCFloat) ver_height: number = 640;
    @property(CCFloat) hor_height: number = 360;
    

    protected applyOrientation(isPortrait: boolean): void {
        this.getComponent(Camera).orthoHeight = isPortrait ? this.ver_height : this.hor_height;
    }
}