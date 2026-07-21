export enum LevelId {
    Demo,
}

export type LevelConfig = readonly (readonly string[])[];

export class LevelLibrary {
    // Cell chars: [top, down, left, right]. # wall, ^ spike, . empty, P player.
    // B bat (position gives first move), o point, C coin, G coin boost.
    private static readonly demo: LevelConfig = [
        ['####', '####', '####', '####', '####', '####'],
        ['####', 'P...', '####', '....', 'o...', '####'],
        ['####', 'o...', '####', 'B...', 'o...', '####'],
        ['####', 'o...', 'o...', 'G...', 'o...', '####'],
        ['####', '####', '####', '^###', '####', '####'],
    ];

    public static get(levelId: LevelId): LevelConfig {
        switch (levelId) {
            case LevelId.Demo:
                return this.demo;
        }
    }
}
