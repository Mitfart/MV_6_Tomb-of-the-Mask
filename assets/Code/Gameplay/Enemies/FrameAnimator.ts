import { _decorator, Component, Sprite, SpriteFrame } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('FrameAnimator')
export class FrameAnimator extends Component {
    @property(Sprite)
    public sprite: Sprite | null = null;

    @property([SpriteFrame])
    public frames: SpriteFrame[] = [];

    @property
    public framesPerSecond = 8;

    private elapsed = 0;
    private frameIndex = -1;

    protected onEnable(): void {
        this.elapsed = 0;
        this.frameIndex = -1;
        this.applyFrame(0);
    }

    protected update(deltaTime: number): void {
        if (!this.sprite || this.frames.length < 2 || this.framesPerSecond <= 0) return;
        this.elapsed += deltaTime;
        this.applyFrame(Math.floor(this.elapsed * this.framesPerSecond) % this.frames.length);
    }

    private applyFrame(index: number): void {
        if (!this.sprite || !this.frames[index] || this.frameIndex === index) return;
        this.frameIndex = index;
        this.sprite.spriteFrame = this.frames[index];
    }
}
