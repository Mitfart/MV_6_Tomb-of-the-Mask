export enum LevelId {
    Demo,
}

export type LevelConfig = readonly (readonly string[])[];

export class LevelLibrary {
    // Cell chars: [top, down, left, right]. # wall, ^ spike, . empty, P player.
    // B bat and T turret: symbol position gives first move/fire direction. o point, C coin, G coin boost.
    private static readonly demo: LevelConfig = [
        ['####', '####', '####', '####', '####', '####', '####', '####', '####', '####'],
        ['####', 'P...', 'o...', '....', '....', '....', '....', '....', 'C...', '####'],
        ['####', '....', '####', '####', '....', '....', '....', '....', 'o...', '####'],
        ['####', '....', '....', '....', '....', '....', '..T.', '....', '....', '####'],
        ['####', 'o...', '....', '....', 'G...', '....', '....', '....', 'o...', '####'],
        ['####', '....', '....', '...B', '....', '....', '....', '....', '....', '####'],
        ['####', 'o...', '....', '....', '....', '....', '....', '####', '....', '####'],
        ['####', '....', '....', '....', 'o...', '....', '....', '....', '^###', '####'],
        ['####', '####', '####', '####', '####', '####', '####', '####', '####', '####'],
    ];

    public static get(levelId: LevelId): LevelConfig {
        switch (levelId) {
            case LevelId.Demo:
                return this.demo;
        }
    }
}
