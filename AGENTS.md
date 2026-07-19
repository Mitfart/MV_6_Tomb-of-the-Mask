# DOX framework

- DOX is the `AGENTS.md` hierarchy for this repo. Read this file and every child `AGENTS.md` on the target path before editing.
- Keep docs concise and operational. Update the nearest contract after durable workflow or structure changes.

## Project

Cocos Creator 3.8.8 playable: **Tomb of the Mask: Old Maze**. The implementation reuses the shared engine under `assets/Cocos_Engine/`.

## Working rules

- Default communication: `skill://caveman` unless the user requests otherwise.
- Before adding a component, helper, or system, inspect and reuse existing project code—especially `assets/Cocos_Engine/`—when it fits.
- Prefer composing/configuring existing Cocos Engine components over creating replacements. Tell the user when an existing engine component is the better choice.
- Use native Cocos components/APIs before custom code. Add code only for game-specific behavior the engine does not cover.
- For editor-owned assets (`.scene`, `.prefab`, `.anim`, `.mat`, `.material`, `.asset`, `.meta`), use the Cocos CodeMode/editor workflow; do not edit them directly.
- Do not modify generated directories: `library/`, `temp/`, `local/`, `build/`, `native/`.
- Preserve public component APIs unless all callers change together. No speculative abstractions, factories, or one-implementation interfaces.
- Art names: `e_` enemies (need Player-damaging HitBox), `item_` collectibles, `tile_` walls; tile suffixes use `t/l/r/b/c`, with `i` for inner corners. Dual-grid uses 15 separately assigned frames; do not rotate frames.

## Layout

- `assets/Cocos_Engine/` — shared reusable Cocos components and tutorial assets; read its contract before changes.
- `assets/Infrastructure/` — GameManager and code-configured LevelLibrary.
- `assets/Gameplay/` — grid, level rendering/building, and Player components.
- `assets/scene.scene` — main editor-owned scene.
- `_TASK/` — playable specification.
- `extensions/` — local Cocos extensions.

## Verification

- Run the smallest relevant TypeScript/Cocos validation available after code changes.
- Validate editor-owned changes in Cocos Creator through CodeMode, then inspect the console.
