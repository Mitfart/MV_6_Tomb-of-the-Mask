# Tutorial DOX

## Purpose

Tutorial/sample content that demonstrates the reusable components.

## Ownership

- `art/` owns tutorial-only visual assets.
- `code/` owns tutorial-only TypeScript components.

## Local Contracts

- Tutorial code may be concrete and example-focused; do not move tutorial assumptions into `General`.
- Keep sample code readable over abstract.
- Do not direct-edit editor-owned assets unless explicitly requested; prefer Cocos editor/CodeMode for asset wiring.

## Work Guidance

- Use existing `Tutorial_*` naming for tutorial-specific components.
- If logic becomes reusable, move the reusable part to `General/Code` and keep tutorial glue here.

## Verification

- For tutorial changes, verify the affected sample scene/prefab manually in Cocos when available.

## Child DOX Index

No child AGENTS.md files yet.
