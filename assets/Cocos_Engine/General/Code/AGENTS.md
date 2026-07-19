# General Code DOX

## Purpose

Reusable Cocos Creator TypeScript components.

## Ownership

- `adaptive/` — orientation and responsive layout helpers.
- `export/` — playable/export and download-button helpers.
- `limit/` — camera/position clamps.
- `localisation/` — localization data and localized renderers.
- `misc/` — small utility components.
- `movement/` — movement/follow helpers.
- `score/` — score model/display helpers.
- `ui/` — generic UI component helpers.

## Local Contracts

- One `@ccclass` component per file; filename, class, and component name match.
- Serialized fields live at top, default to `null`, `[]`, or explicit primitive values.
- Prefer local `getComponent` on known references; avoid global `find()` and hidden scene dependencies.
- Bind/unbind listeners in matching lifecycle methods when components can toggle.
- Stop tweens/schedules/listeners in `onDisable`/`onDestroy` when they can outlive the component.

## Work Guidance

- Keep public API minimal and stable; these files are reusable package material.
- Add no factories/interfaces/config until there are multiple real implementations.
- If a shortcut has a known ceiling, mark it with `// ponytail:` and the upgrade trigger.

## Verification

- No repo-level test runner exists. For non-trivial logic, leave the smallest runnable self-check only if it fits the existing project style.

## Child DOX Index

No child AGENTS.md files yet; feature folders are simple enough for this contract.
