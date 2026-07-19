import { _decorator, CCString, Label, log, SpriteComponent, SpriteFrame } from 'cc';
import { Localize } from './Localize';
import { LangCode } from './Localization';
const { ccclass, property, requireComponent } = _decorator;

@ccclass("LocalizeSprite")
@requireComponent(SpriteComponent)
export class LocalizeSprite extends Localize {
    @property(SpriteFrame) EN: SpriteFrame = null;
    @property(SpriteFrame) DE: SpriteFrame = null;
    @property(SpriteFrame) NL: SpriteFrame = null;
    @property(SpriteFrame) FR: SpriteFrame = null;
    @property(SpriteFrame) IT: SpriteFrame = null;
    @property(SpriteFrame) ES: SpriteFrame = null;

    protected set(data: string): void {
        const lang = LangCode[data];
        switch(lang) {
            case LangCode.DE: this.getComponent(SpriteComponent).spriteFrame = this.DE; break;
            case LangCode.NL: this.getComponent(SpriteComponent).spriteFrame = this.NL; break;
            case LangCode.FR: this.getComponent(SpriteComponent).spriteFrame = this.FR; break;
            case LangCode.IT: this.getComponent(SpriteComponent).spriteFrame = this.IT; break;
            case LangCode.ES: this.getComponent(SpriteComponent).spriteFrame = this.ES; break;
            default: case LangCode.EN: this.getComponent(SpriteComponent).spriteFrame = this.EN; break;
        }
    }
}