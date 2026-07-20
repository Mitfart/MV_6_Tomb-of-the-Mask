import { _decorator, Component, Enum } from 'cc';
import { LevelBuilder } from '../Gameplay/Level/LevelBuilder';
import { PLAYER_DIED } from '../Gameplay/Player/PlayerDamage';
import { LevelId, LevelLibrary } from './LevelLibrary';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(LevelBuilder)
    public levelBuilder: LevelBuilder | null = null;

    @property({ type: Enum(LevelId) })
    public levelId = LevelId.Demo;

    protected onEnable(): void {
        this.levelBuilder?.node.on(PLAYER_DIED, this.onPlayerDied, this);
    }

    protected onDisable(): void {
        this.levelBuilder?.node.off(PLAYER_DIED, this.onPlayerDied, this);
    }

    protected start(): void {
        this.restart();
    }

    private onPlayerDied(): void {
        this.scheduleOnce(this.restart, 0.5);
    }

    private restart(): void {
        if (!this.levelBuilder) {
            console.error('[GameManager] Missing levelBuilder');
            return;
        }
        this.levelBuilder.build(LevelLibrary.get(this.levelId));
    }
}
