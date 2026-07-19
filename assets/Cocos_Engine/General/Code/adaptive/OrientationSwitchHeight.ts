import { _decorator, CCFloat, UITransform} from 'cc';
import { OrientationSwitch } from './OrientationSwitch';
const { ccclass, property } = _decorator;

@ccclass('OrientationSwitchHeight')
export class OrientationSwitchHeight extends OrientationSwitch {
    @property(UITransform) transform: UITransform = null;
    @property(CCFloat) hor_height: number = 0;
    @property(CCFloat) ver_height: number = 0;
    

    protected override applyOrientation(isPortrait: boolean): void {
        const size = this.transform.contentSize;
        size.set(size.width, isPortrait ? this.ver_height : this.hor_height);
        this.transform.contentSize = size; 
    }
}