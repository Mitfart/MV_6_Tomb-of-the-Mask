export enum LevelId {
    Demo,
}

export type LevelConfig = readonly (readonly string[])[];

export class LevelLibrary {
    // Cell chars: [top, down, left, right]. # wall, ^ spike, . empty, P player.
    // B bat and T turret: symbol position gives move/fire direction. F fish expands 1×1 to 3×3. o point, C coin, G coin boost.
    private static readonly demo: LevelConfig = [
        ['####', '####', '####', '####', '####', '####', '####', '####', '####', '####'],
        ['####', 'P...', 'o...', '....', 'G...', '....', '....', '....', 'C...', '####'],
        ['####', 'o...', '####', '####', '....', '....', 'T...', '....', 'o...', '####'],
        ['####', 'o...', '....', '....', '....', '....', '..T.', '....', '....', '####'],
        ['####', 'o...', '....', '....', '....', '....', '...T', '....', 'o...', '####'],
        ['####', 'o...', '....', '...B', '....', '....', '.T..', '....', '....', '####'],
        ['####', 'o...', '....', '....', '..F.', '....', '....', '^^^^', '....', '####'],
        ['####', 'o...', '....', '....', 'o...', '....', '....', '....', '####', '####'],
        ['####', '####', '####', '####', '####', '####', '####', '####', '####', '####'],
    ];

    public static get(levelId: LevelId): LevelConfig {
        switch (levelId) {
            case LevelId.Demo:
                return this.demo;
        }
    }
}
