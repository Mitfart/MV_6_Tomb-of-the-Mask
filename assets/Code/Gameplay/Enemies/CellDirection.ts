export type CellDirection = 'top' | 'down' | 'left' | 'right';

export function directionToDelta(direction: CellDirection): [number, number] {
    switch (direction) {
        case 'top': return [0, -1];
        case 'down': return [0, 1];
        case 'left': return [-1, 0];
        case 'right': return [1, 0];
    }
}
