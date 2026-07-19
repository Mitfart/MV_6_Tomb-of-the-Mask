import { _decorator, CCFloat, Widget} from 'cc';
import { OrientationSwitch } from './OrientationSwitch';
const { ccclass, property } = _decorator;

@ccclass('OrientationSwitchWidget')
export class OrientationSwitchWidgetHorizontal extends OrientationSwitch {
    @property(Widget) widget: Widget = null;
    @property(CCFloat) padding: number = 5;
    

    protected override applyOrientation(isPortrait: boolean): void {
        if (isPortrait) {
            this.widget.isAlignLeft = true;
            this.widget.isAlignRight = true;

            this.widget.editorLeft = this.padding;
            this.widget.editorRight = this.padding;
        } else {
            this.widget.isAlignLeft = false;
            this.widget.isAlignRight = true;
            
            this.widget.editorRight = this.padding;
        }
    }
}