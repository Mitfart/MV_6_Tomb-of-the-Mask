import { _decorator, BoxCollider2D, Collider2D, Component } from 'cc';
import { PlayerDamage } from '../Player/PlayerDamage';

const { ccclass, property } = _decorator;

@ccclass('HitBox')
export class HitBox extends Component {
    @property(BoxCollider2D)
    public hitbox: BoxCollider2D | null = null;

    private playerCollider: Collider2D | null = null;
    private playerDamage: PlayerDamage | null = null;
    private needsSync = true;

    public configure(playerDamage: PlayerDamage): void {
        this.playerDamage = playerDamage;
        this.playerCollider = playerDamage.getComponent(Collider2D);
        this.needsSync = true;
        if (!this.hitbox || !this.playerCollider) {
            console.error('[HitBox] Missing hitbox or player Collider2D');
            this.enabled = false;
            return;
        }
        this.hitbox.sensor = true;
    }

    protected update(): void {
        if (this.needsSync) {
            this.needsSync = false;
            return;
        }
        if (!this.hitbox || !this.playerCollider) return;
        this.hitbox.apply();
        this.playerCollider.apply();
        const hit = this.hitbox.worldAABB;
        const player = this.playerCollider.worldAABB;
        if (hit.x < player.x + player.width && hit.x + hit.width > player.x && hit.y < player.y + player.height && hit.y + hit.height > player.y) this.playerDamage?.damage();
    }
}
