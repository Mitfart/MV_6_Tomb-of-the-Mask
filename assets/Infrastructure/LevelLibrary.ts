export enum LevelId {
    Demo,
}

export interface LevelConfig {
    cells: readonly (readonly string[])[];
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
    };

    public static get(levelId: LevelId): LevelConfig {
        switch (levelId) {
            case LevelId.Demo:
                return this.demo;
        }
    }
}
