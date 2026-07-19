import { _decorator, Component, screen, macro } from 'cc';

export abstract class OrientationSwitch extends Component {
    protected onLoad(): void {
        screen.on('window-resize', this.onWindowResize, this);
        screen.on('orientation-change', this.onOrientationChange, this);

        this.applyCurrentOrientation();
    }

    protected onEnable(): void { this.applyCurrentOrientation(); }

    protected start(): void { this.applyCurrentOrientation(); }
    

    protected abstract applyOrientation(isPortrait: boolean): void;


    protected applyCurrentOrientation(): void {
        const res = screen.resolution;
        this.applyOrientation(
            this.isPortrait(
                this.getOrientation(
                    res.width, 
                    res.height
                )
            )
        );
    }

    private onWindowResize(width: number, height: number) {
        this.applyOrientation(this.isPortrait(this.getOrientation(width, height)));
    }

    private onOrientationChange(orientation: number) {
        this.applyOrientation(this.isPortrait(orientation));
    }
    

    private getOrientation(w: number, h: number): number {
        return w < h ? macro.ORIENTATION_PORTRAIT : macro.ORIENTATION_LANDSCAPE;
    }

    private isPortrait(orientation: number): boolean {
        return orientation === macro.ORIENTATION_PORTRAIT 
            || orientation === macro.ORIENTATION_PORTRAIT_UPSIDE_DOWN;
    }
}