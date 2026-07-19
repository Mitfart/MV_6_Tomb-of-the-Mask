import { _decorator, Component, CCFloat, tween, Button, AnimationComponent, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Tutorial_Btn')
export class Tutorial_Btn extends Component {
    private static DELTA_TIME: number = .1;

    @property(Button) targetBtn: Button = null;
    @property(UIOpacity) opacity: UIOpacity = null;
    @property(AnimationComponent) tuttorialAnim: AnimationComponent = null;
    @property(CCFloat) delayBeforePlay: number = .5;
    @property(CCFloat) delayBeforeReplay: number = 5;
    @property(CCFloat) showHideDuration: number = .25;

    private _timeToShow: number = 0;
    private _showing: boolean = false;


    protected onLoad(): void {
        this.targetBtn.node.on(Button.EventType.CLICK, this.stopTuttorial, this);
        
        this.hide(true);

        this._timeToShow = this.delayBeforePlay;
        this.schedule(() => {
            if (this._showing || !this.targetBtn.enabled || !this.targetBtn.interactable)
                return;
            
            this._timeToShow -= Tutorial_Btn.DELTA_TIME;
            if (this._timeToShow <= 0) 
                this.show(); 
        }, Tutorial_Btn.DELTA_TIME);
    }

    protected start(): void {
        this.hide(true);
    }
    
    public show() {
        tween(this.opacity)
            .call(() => {
                this._showing = true;
                this.tuttorialAnim.play();
            })
            .to(this.showHideDuration, { opacity: 255 })
            .start();
    }
    
    public hide(instantly: boolean = false) {
        if (!instantly) {
            tween(this.opacity)
                .to(this.showHideDuration, { opacity: 0 })
                .call(() => { 
                    this.tuttorialAnim.stop();
                    this._showing = false;
                })
                .start();
        } else {
            this.opacity.opacity = 0;
            this.tuttorialAnim.stop();
            this._showing = false;
        }
    }

    public stopTuttorial() {
        this.hide();
        this._timeToShow = this.delayBeforeReplay;
    }
}