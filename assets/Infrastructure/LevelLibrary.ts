export enum LevelId {
    Demo,
}

export class LevelLibrary {
    private static readonly demo: readonly (readonly string[])[] = [
        ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
        ['#', 'P', '.', '.', '#', '.', '.', '.', '#'],
        ['#', '#', '#', '.', '#', '.', '#', '.', '#'],
        ['#', '.', '.', '.', '.', '.', '#', '.', '#'],
        ['#', '.', '#', '#', '#', '.', '#', '.', '#'],
        ['#', '.', '#', '.', '.', '.', '.', '.', '#'],
        ['#', '.', '#', '.', '#', '#', '#', '#', '#'],
        ['#', '.', '.', '.', '.', '.', '.', '.', '#'],
        ['#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ];

    public static get(levelId: LevelId): readonly (readonly string[])[] {
        switch (levelId) {
            case LevelId.Demo:
                return this.demo;
        }
    }
}
