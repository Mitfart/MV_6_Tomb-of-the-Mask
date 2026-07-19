import { _decorator, AnimationClip, AnimationComponent, warn } from 'cc';
import { Localize } from './Localize';
import { LangCode } from './Localization';
const { ccclass, property, requireComponent } = _decorator;

@ccclass("LocalizeAnimation")
@requireComponent(AnimationComponent)
export class LocalizeAnimation extends Localize {
    @property(AnimationClip) RU: AnimationClip = null;
    @property(AnimationClip) NL: AnimationClip = null;
    @property(AnimationClip) CH: AnimationClip = null;
    @property(AnimationClip) ES: AnimationClip = null;
    @property(AnimationClip) BE: AnimationClip = null;
    @property(AnimationClip) DE: AnimationClip = null;


    protected set(data: string): void {
        const code = LangCode[data];
        switch(code) {
            case LangCode.RU: this.getComponent(AnimationComponent).play(this.RU.name); break;
            case LangCode.NL: this.getComponent(AnimationComponent).play(this.NL.name); break;
            case LangCode.CH: this.getComponent(AnimationComponent).play(this.CH.name); break;
            case LangCode.ES: this.getComponent(AnimationComponent).play(this.ES.name); break;
            case LangCode.BE: this.getComponent(AnimationComponent).play(this.BE.name); break;
            case LangCode.DE: this.getComponent(AnimationComponent).play(this.DE.name); break;
            default: warn(`Incorrect code: "${code}"`); break;
        }
    }
}

