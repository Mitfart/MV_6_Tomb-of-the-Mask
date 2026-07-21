import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { GridService } from '../../../Cocos_Engine/General/Code/grid/GridService';
import { HalfTileLite } from '../../../Cocos_Engine/General/Code/tile/HalfTileLite';
import { DoubleTileRenderer } from './DoubleTileRenderer';
import { PlayerController } from '../Player/PlayerController';
import { PlayerDamage, PLAYER_DIED } from '../Player/PlayerDamage';
import { Collectible, CollectibleKind } from '../Collectibles/Collectible';
import { Bat } from '../Enemies/Bat';
import { Turret } from '../Enemies/Turret';
import { Fish } from '../Enemies/Fish';
import { CellDirection } from '../Enemies/CellDirection';
import { HitBox } from '../Enemies/HitBox';
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

    @property({ type: Prefab, group: { name: 'Enemies' } }) public batPrefab: Prefab | null = null;
    @property({ type: Prefab, group: { name: 'Enemies' } }) public turretPrefab: Prefab | null = null;
    @property({ type: Prefab, group: { name: 'Enemies' } }) public fishPrefab: Prefab | null = null;
    @property({ type: Node, group: { name: 'Enemies' } }) public enemyParent: Node | null = null;

    private player: PlayerController | null = null;
    private ui: UI_GameController | null = null;
    private collectibles: Collectible[] = [];
    private spikeHitBoxes: HitBox[] = [];

    public setUIController(ui: UI_GameController | null): void {
        this.ui = ui;
    }

    public build(config: LevelConfig): void {
        const level = config;
        const start = this.validate(level);
        if (!start) {
            console.error('[LevelBuilder] Invalid level');
            return;
        }
        this.grid.configure(level[0].length, level.length);
        this.wallParent.removeAllChildren();
        this.spikeParent.removeAllChildren();
        this.collectibleParent?.removeAllChildren();
        this.enemyParent?.removeAllChildren();
        this.collectibles = [];
        this.spikeHitBoxes = [];
        this.ui?.resetCoins();
        this.tileRenderer.render(level);
        for (let row = 0; row < level.length; row++) for (let column = 0; column < level[row].length; column++) {
            const cell = level[row][column];
            if (this.isWall(cell) && !cell.includes('^')) {
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
                const hitBox = spike.getComponent(HitBox);
                if (!hitBox) console.error('[LevelBuilder] Spike Prefab missing HitBox');
                else this.spikeHitBoxes.push(hitBox);
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
        for (const hitBox of this.spikeHitBoxes) hitBox.configure(damage);
        this.spawnCollectibles(level, player);
        this.spawnEnemies(level, damage);
    }

    private spawnEnemies(level: readonly (readonly string[])[], playerDamage: PlayerDamage): void {
        for (let row = 0; row < level.length; row++) for (let column = 0; column < level[row].length; column++) {
            const cell = level[row][column];
            const batDirection = this.getDirection(cell, 'B');
            if (batDirection) this.spawnBat(level, playerDamage, column, row, batDirection);
            const turretDirection = this.getDirection(cell, 'T');
            if (turretDirection) this.spawnTurret(level, playerDamage, column, row, turretDirection);
            if (cell.includes('F')) this.spawnFish(playerDamage, column, row);
        }
    }

    private spawnBat(level: readonly (readonly string[])[], playerDamage: PlayerDamage, column: number, row: number, direction: CellDirection): void {
        if (!this.enemyParent || !this.batPrefab) {
            console.error('[LevelBuilder] Missing Enemy Parent or Bat Prefab');
            return;
        }
        const node = instantiate(this.batPrefab);
        const bat = node.getComponent(Bat);
        const hitBox = node.getComponent(HitBox);
        if (!bat || !hitBox) {
            console.error('[LevelBuilder] Bat Prefab missing Bat or HitBox');
            node.destroy();
            return;
        }
        this.enemyParent.addChild(node);
        bat.configure(this.grid, level, column, row, direction);
        hitBox.configure(playerDamage);
    }

    private spawnFish(playerDamage: PlayerDamage, column: number, row: number): void {
        if (!this.enemyParent || !this.fishPrefab) {
            console.error('[LevelBuilder] Missing Enemy Parent or Fish Prefab');
            return;
        }
        const node = instantiate(this.fishPrefab);
        const fish = node.getComponent(Fish);
        const hitBox = node.getComponent(HitBox);
        if (!fish || !hitBox) {
            console.error('[LevelBuilder] Fish Prefab missing Fish or HitBox');
            node.destroy();
            return;
        }
        this.enemyParent.addChild(node);
        node.setPosition(this.grid.cellToWorld(column, row));
        fish.configure(this.grid.cellSize);
        hitBox.configure(playerDamage);
    }

    private spawnTurret(level: readonly (readonly string[])[], playerDamage: PlayerDamage, column: number, row: number, direction: CellDirection): void {
        if (!this.enemyParent || !this.turretPrefab) {
            console.error('[LevelBuilder] Missing Enemy Parent or Turret Prefab');
            return;
        }
        const node = instantiate(this.turretPrefab);
        const turret = node.getComponent(Turret);
        if (!turret) {
            console.error('[LevelBuilder] Turret Prefab missing Turret');
            node.destroy();
            return;
        }
        this.enemyParent.addChild(node);
        node.setPosition(this.grid.cellToWorld(column, row));
        turret.configure(this.grid, level, column, row, direction, playerDamage);
    }

    private spawnCollectibles(level: LevelConfig, player: PlayerController): void {
        if (!this.collectibleParent) return;
        for (let row = 0; row < level.length; row++) for (let column = 0; column < level[row].length; column++) {
            const kind = this.getCollectibleKind(level[row][column]);
            if (kind === null) continue;
            const prefab = kind === CollectibleKind.Point ? this.pointPrefab : kind === CollectibleKind.Coin ? this.coinPrefab : this.coinBoostPrefab;
            if (!prefab) {
                console.error('[LevelBuilder] Missing collectible Prefab');
                return;
            }
            const node = instantiate(prefab);
            const collectible = node.getComponent(Collectible);
            if (!collectible) {
                console.error('[LevelBuilder] Collectible Prefab missing Collectible');
                node.destroy();
                return;
            }
            node.setPosition(this.grid.cellToWorld(column, row));
            this.collectibleParent.addChild(node);
            collectible.configure(kind, player, this.ui, this.activateCoinBoost);
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

    private getCollectibleKind(cell: string): CollectibleKind | null {
        if (cell.includes('o')) return CollectibleKind.Point;
        if (cell.includes('C')) return CollectibleKind.Coin;
        return cell.includes('G') ? CollectibleKind.CoinBoost : null;
    }

    private getDirection(cell: string, symbol: string): CellDirection | null {
        const index = cell.indexOf(symbol);
        return index < 0 ? null : ['top', 'down', 'left', 'right'][index] as CellDirection;
    }

    private isWall(cell: string | undefined): boolean { return cell?.includes('#') || cell?.includes('^') || cell?.includes('T') || false; }
}
