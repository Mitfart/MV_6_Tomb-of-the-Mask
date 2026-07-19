# DOX framework

- DOX is the AGENTS.md hierarchy for this repo.
- AGENTS.md files are binding work contracts for their subtrees.
- Before editing, read this file, then every child AGENTS.md on the path to the target.
- After meaningful changes, update the nearest AGENTS.md if purpose, structure, workflow, rules, or durable behavior changed.
- Keep docs concise and operational; delete stale rules instead of explaining history.

## Project

Cocos Creator shared engine/tooling repo with reusable TypeScript components and sample/tutorial assets.

## Global work rules

- Default communication: `skill://caveman` unless user asks otherwise.
- Use Cocos Creator TypeScript style: `_decorator`, `@ccclass`, `@property`, one component per file, class name matches filename.
- Prefer serialized editor references over scene-wide lookup. Never add `find()`/string-path lookup unless explicitly required by existing code.
- Required serialized refs must fail clearly with `console.error('[ComponentName] Missing fieldName')` and return/disable safely.
- Do not direct-edit Cocos editor-owned `.prefab`, `.anim`, `.scene`, or `.meta` files unless the user explicitly asks and the edit is safe; prefer CodeMode/editor workflow for scene or prefab data.
- No speculative abstractions, one-implementation interfaces, factories, or config layers.
- Preserve existing public component APIs unless changing callers too.
- Before adding a component or helper, search this engine first and reuse/combine an existing component when it fits. Prefer native Cocos APIs over new engine code, and tell the user when an engine component is the recommended solution.

## Verification

- No package/build metadata is present at repo root.
- For TypeScript changes, at minimum inspect imports/types locally and run the project's available Cocos/TS check if one is later added.

## Layout

- `General/Code/` — reusable engine components, grouped by concern.
- `Tutorial/code/` — tutorial/sample components.
