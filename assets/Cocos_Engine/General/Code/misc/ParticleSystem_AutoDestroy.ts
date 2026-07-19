import { _decorator, Component, ParticleSystem } from 'cc';
const { ccclass } = _decorator;

@ccclass('ParticleSystem_AutoDestroy')
export class ParticleSystem_AutoDestroy extends Component {
    start() {
        const particle = ParticleSystem ? this.getComponent(ParticleSystem) : null;
        if (particle) {
            const duration = particle.duration;
            const lifeTime = particle.startLifetime.constant; 
            
            this.scheduleOnce(() => {
                this.node.destroy();
            }, duration + lifeTime + 0.5);
        }
    }
}