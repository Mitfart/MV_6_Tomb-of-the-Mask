import { _decorator, Component, Enum } from 'cc';
import { LevelBuilder } from '../Gameplay/Level/LevelBuilder';
import { LevelId, LevelLibrary } from './LevelLibrary';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(LevelBuilder)
    public levelBuilder: LevelBuilder | null = null;

    @property({ type: Enum(LevelId) })
    public levelId = LevelId.Demo;

    protected start(): void {
        if (!this.levelBuilder) {
            console.error('[GameManager] Missing levelBuilder');
            return;
        }
        this.levelBuilder.build(LevelLibrary.get(this.levelId));
    }
}
