export enum LevelId {
    Demo,
}

export interface CollectibleConfig {
    x: number;
    y: number;
    kind: 'point' | 'coin' | 'coinBoost';
}

export interface LevelConfig {
    cells: readonly (readonly string[])[];
    collectibles?: readonly CollectibleConfig[];
}

export class LevelLibrary {
    // Cell chars: [0] top, [1] down, [2] left, [3] right. 
    // # wall, ^ spike, . empty, P player.
    private static readonly demo: LevelConfig = {
        cells: [
            ['####', '####', '####', '####', '####', '####'],
            ['####', 'P...', '####', '....', '....', '####'],
            ['####', '....', '####', '....', '....', '####'],
            ['####', '....', '....', '....', '....', '####'],
            ['####', '####', '####', '^###', '####', '####'],
        ],
        collectibles: [
            { x: 1, y: 2, kind: 'point' },
            { x: 1, y: 3, kind: 'point' },
            { x: 2, y: 3, kind: 'point' },
            { x: 3, y: 3, kind: 'coinBoost' },
            { x: 4, y: 3, kind: 'point' },
            { x: 4, y: 2, kind: 'point' },
            { x: 4, y: 1, kind: 'point' },
        ],
    };

    public static get(levelId: LevelId): LevelConfig {
        switch (levelId) {
            case LevelId.Demo:
                return this.demo;
        }
    }
}
