# General DOX

## Purpose

Reusable Cocos assets and TypeScript components intended to be copied into projects.

## Ownership

- `Art/` owns shared sprites/prefabs/animations.
- `Code/` owns reusable TypeScript components grouped by feature.

## Local Contracts

- Keep reusable components generic; do not bake tutorial/game-specific assumptions into `General`.
- Preserve Cocos serialization names and defaults unless the migration cost is intentional.
- Do not direct-edit editor-owned art/prefab/animation data casually; use editor/CodeMode when changing asset wiring.

## Work Guidance

- Prefer small Cocos components with serialized `@property` references.
- Component filenames, class names, and `@ccclass` names should stay aligned.
- UI code stays in `Code/ui` or `Code/export`; gameplay/math helpers stay in their feature folder.

## Verification

- For code changes, check affected imports and any serialized property rename impact.

## Child DOX Index

- `Code/AGENTS.md` — reusable TypeScript component rules and folder map.
