import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { GridService } from '../../../Cocos_Engine/General/Code/grid/GridService';
import { HalfTileLite } from '../../../Cocos_Engine/General/Code/tile/HalfTileLite';
import { DoubleTileRenderer } from './DoubleTileRenderer';
import { PlayerController } from '../Player/PlayerController';
import { PlayerDamage, PLAYER_DIED } from '../Player/PlayerDamage';
import { Collectible, CollectibleKind } from '../Collectibles/Collectible';
import { UI_GameController } from '../../UI/UI_GameController';
import type { LevelConfig } from '../../Infrastructure/LevelLibrary';

const { ccclass, property } = _decorator;

@ccclass('LevelBuilder')
export class LevelBuilder extends Component {
    @property({ type: GridService, group: { name: 'Level' } }) public grid!: GridService;
    @property({ type: DoubleTileRenderer, group: { name: 'Level' } }) public tileRenderer!: DoubleTileRenderer;

    @property({ type: Prefab, group: { name: 'Player' } }) public playerPrefab!: Prefab;
    @property({ type: Node, group: { name: 'Player' } }) public playerParent!: Node;

    @property({ type: Prefab, group: { name: 'Walls' } }) public wallColliderPrefab!: Prefab;
    @property({ type: Node, group: { name: 'Walls' } }) public wallParent!: Node;
    @property({ type: Prefab, group: { name: 'Spikes' } }) public spikePrefab!: Prefab;
    @property({ type: Node, group: { name: 'Spikes' } }) public spikeParent!: Node;

    @property({ type: Prefab, group: { name: 'Collectibles' } }) public pointPrefab: Prefab | null = null;
    @property({ type: Prefab, group: { name: 'Collectibles' } }) public coinPrefab: Prefab | null = null;
    @property({ type: Prefab, group: { name: 'Collectibles' } }) public coinBoostPrefab: Prefab | null = null;
    @property({ type: Node, group: { name: 'Collectibles' } }) public collectibleParent: Node | null = null;
    @property({ group: { name: 'Collectibles' } }) public coinWaveDelayPerCell = 0.04;

    private player: PlayerController | null = null;
    private ui: UI_GameController | null = null;
    private collectibles: Collectible[] = [];

    public setUIController(ui: UI_GameController | null): void {
        this.ui = ui;
    }

    public build(config: LevelConfig): void {
        const level = config.cells;
        const start = this.validate(level);
        if (!start) {
            console.error('[LevelBuilder] Invalid level');
            return;
        }
        this.grid.configure(level[0].length, level.length);
        this.wallParent.removeAllChildren();
        this.spikeParent.removeAllChildren();
        this.collectibleParent?.removeAllChildren();
        this.collectibles = [];
        this.ui?.resetCoins();
        this.tileRenderer.render(level);
        for (let row = 0; row < level.length; row++) for (let column = 0; column < level[row].length; column++) {
            const cell = level[row][column];
            if (this.isWall(cell)) {
                const wall = instantiate(this.wallColliderPrefab);
                wall.setPosition(this.grid.cellToWorld(column, row));
                this.wallParent.addChild(wall);
            }
            const center = this.grid.cellToWorld(column, row);
            const offset = this.grid.cellSize * 0.25;
            for (let halfRow = 0; halfRow < 2; halfRow++) for (let halfColumn = 0; halfColumn < 2; halfColumn++) {
                if (!this.tileRenderer.isSpike(cell, halfColumn, halfRow)) continue;
                const spike = instantiate(this.spikePrefab);
                const halfTile = spike.getComponent(HalfTileLite);
                if (!halfTile) {
                    console.error('[LevelBuilder] Spike Prefab missing HalfTileLite');
                    spike.destroy();
                    return;
                }
                halfTile.setVariant(this.tileRenderer.getSpikeVariant(cell, halfColumn, halfRow));
                spike.setPosition(center.x + (halfColumn ? offset : -offset), center.y + (halfRow ? -offset : offset));
                this.spikeParent.addChild(spike);
            }
        }
        this.player?.node.destroy();
        const playerNode = instantiate(this.playerPrefab);
        this.playerParent.addChild(playerNode);
        const player = playerNode.getComponent(PlayerController);
        const damage = playerNode.getComponent(PlayerDamage);
        if (!player || !damage) {
            console.error('[LevelBuilder] Player Prefab missing PlayerController or PlayerDamage');
            playerNode.destroy();
            return;
        }
        this.player = player;
        player.grid = this.grid;
        damage.node.on(PLAYER_DIED, this.onPlayerDied, this);
        player.configure(level, start.x, start.y);
        this.spawnCollectibles(config, player);
    }

    private spawnCollectibles(config: LevelConfig, player: PlayerController): void {
        if (!this.collectibleParent) return;
        for (const item of config.collectibles ?? []) {
            const prefab = item.kind === 'point' ? this.pointPrefab : item.kind === 'coin' ? this.coinPrefab : this.coinBoostPrefab;
            if (!prefab) {
                console.error(`[LevelBuilder] Missing ${item.kind} Prefab`);
                return;
            }
            const node = instantiate(prefab);
            const collectible = node.getComponent(Collectible);
            if (!collectible) {
                console.error('[LevelBuilder] Collectible Prefab missing Collectible');
                node.destroy();
                return;
            }
            node.setPosition(this.grid.cellToWorld(item.x, item.y));
            this.collectibleParent.addChild(node);
            collectible.configure(item.kind === 'point' ? CollectibleKind.Point : item.kind === 'coin' ? CollectibleKind.Coin : CollectibleKind.CoinBoost, player, this.ui, this.activateCoinBoost);
            this.collectibles.push(collectible);
        }
    }

    private activateCoinBoost = (center: Readonly<Vec3>): void => {
        this.ui?.showCoinAddict();
        for (const collectible of this.collectibles) {
            const delay = Vec3.distance(center, collectible.node.worldPosition) / this.grid.cellSize * this.coinWaveDelayPerCell;
            collectible.convertToCoin(delay);
        }
    };

    private onPlayerDied(): void { this.node.emit(PLAYER_DIED); }

    private validate(level: readonly (readonly string[])[]): { x: number; y: number } | null {
        if (level.length < 3 || level.some(row => row.length !== level[0].length || row.some(cell => cell.length !== 4))) return null;
        let start: { x: number; y: number } | null = null;
        for (let row = 0; row < level.length; row++) for (let column = 0; column < level[row].length; column++) {
            const cell = level[row][column];
            if ((row === 0 || column === 0 || row === level.length - 1 || column === level[row].length - 1) && !this.isWall(cell)) return null;
            if (cell.includes('P')) {
                if (start) return null;
                start = { x: column, y: row };
            }
        }
        return start;
    }

    private isWall(cell: string | undefined): boolean { return cell?.includes('#') || cell?.includes('^') || false; }
}
