# Domain context

## Product

**Tomb of the Mask: Old Maze** is a Cocos Creator 3.8.8 arcade playable based on a vertical maze experience. The playable teaches swipes, then demonstrates coin, freeze, and magnet boosts through a scripted level progression.

## Core terms

- **Player**: swipe-controlled maze character.
- **Swipe run**: Player travels in one cardinal direction from its current cell to last free cell before a wall; speed affects only travel time.
- **Level map**: authored character grid holding terrain and cell content; Dual-grid derives numeric terrain data from it. `#` wall, `.` empty floor, `P` Player spawn; future passable cell content uses `o` dot, `C` coin, `B` coin boost, `F` freeze, `M` magnet. Its world origin is center cell `(0,0)` and its outer edge is walls.
- **Loot / boost**: prominent collectible that changes the current play segment: coin conversion, freeze, or magnet.
- **Coin boost**: turns dots into coins sequentially.
- **Freeze boost**: pauses traps for the full hazardous segment; traps cannot hurt the player while frozen.
- **Magnet boost**: attracts nearby coins to the player.
- **Flight corridor**: scripted, no-input transition between level sections with trail and camera change.
- **Endcard**: win-only CTA screen. Only the Play now button may open the store in two-click variants.
- **Cocos Engine**: reusable components under `assets/Cocos_Engine/`; prefer these before creating project-specific replacements.

## Level flow

Tutorial swipes → coin boost → flight corridor → trap segment and freeze boost → coin field and magnet boost → final flight corridor → win endcard.

## Source of truth

`_TASK/MV 6.md` contains the full playable specification, including analytics events and platform-specific endcard rules.
