# DOX

Read this contract plus child `AGENTS.md` files on target path before editing. Keep contracts operational and update nearest one after durable changes.

## Project

Cocos Creator 3.8.8 playable: **Tomb of the Mask: Old Maze**. Shared engine: `assets/Cocos_Engine/`.

## Workflow

- English, terse/caveman. Smallest correct change; no speculative abstractions.
- Reuse project/engine code; prefer native Cocos APIs.
- Typed `getComponent(Type)` only; never string lookup.
- User owns scene/prefab wiring. Give manual Creator steps; CodeMode/MCP only on explicit request.
- Never direct-edit `.scene`, `.prefab`, `.anim`, `.mat`, `.material`, `.asset`, `.meta`; never modify `library/`, `temp/`, `local/`, `build/`, `native/`.
- Preserve unrelated work: check `git status`; one feature/change per commit.
- Visual changes: code + smallest check, then user validates exact playable export; request console/screenshot for failures.

## Game contracts

- Level cell: `[top, down, left, right]`; `#` wall, `^` spike, `.` empty, `P` spawn, `B` bat, `T` turret, `o` point, `C` coin, `G` coin boost. B/T position sets first move/fire direction.
- `DoubleTileRenderer`: exposed-side corner/line/inner-corner frames; spikes use directional `HalfTileLite`.
- `LevelBuilder` spawns `player.prefab`, forwards `PLAYER_DIED` to `GameManager`; scene assigns Player Prefab + dedicated Player Parent.
- Art: `e_` enemies require Player-damaging HitBox; `item_` collectibles; `tile_` walls. Tile suffixes `t/l/r/b/c`, `i` inner corner. Do not rotate 15-frame dual-grid art.

## Layout

- `assets/Cocos_Engine/` shared components; read child contract before changes.
- `assets/Code/Infrastructure/` composition/level config; `assets/Code/Gameplay/` level/player behavior; `assets/Code/UI/` UI behavior.
- `assets/scene.scene` main editor scene; `_TASK/MV 6.md` full spec.

## Verification

Run smallest relevant TypeScript/Cocos check. Editor-owned changes need Creator validation + console inspection.
