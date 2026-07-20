# Domain context

## Product

**Tomb of the Mask: Old Maze** — Cocos Creator 3.8.8 swipe-maze playable. Player swipes, runs to obstruction, collects boosts, survives trap section, then reaches win endcard.

## Core contracts

- **Swipe run:** travel in one cardinal direction to last free grid cell; speed changes duration only.
- **Level cell:** four chars `[top, down, left, right]`; `#` wall, `^` spike, `.` empty, `P` spawn. A directional spike replaces both affected half-tiles.
- **Wall rendering:** `DoubleTileRenderer` derives corner, line, and inner-corner frames from exposed micro-sides. Empty outside-map space renders outer wall borders.
- **Spike death:** player moves half a cell into the spike, updates trail to death position, then trail retracts while input remains disabled.
- **Player lifetime:** `LevelBuilder` instantiates `player.prefab` under its configured parent each build; it forwards `PLAYER_DIED` to `GameManager`, which restarts after 0.5s.

## Product terms

- **Coin / freeze / magnet:** scripted boosts for coin conversion, trap immunity, and coin attraction.
- **Flight corridor:** no-input transition between sections.
- **Endcard:** win CTA; only Play now opens store in two-click variants.

## Sources

`_TASK/MV 6.md` is full playable/analytics/endcard specification. Engine reuse source: `assets/Cocos_Engine/`.
