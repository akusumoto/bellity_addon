# In-game compatibility fix

Observed on 2026-09-20: item identifiers appeared instead of names, neither shaped recipe worked, and the Content Log reported `1.20+ Recipes require unlock data` for both recipes.

## Required behavior

- All three custom items display their existing English or Japanese names, according to the game language.
- The two shaped recipes remain craftable with their current ingredients and patterns.
- Loading the pack produces no recipe unlock errors.
- The distributable `.mcaddon` includes the repaired behavior and resource packs.

## Implementation and checks

- Add `minecraft:display_name` to each item, pointing at its existing localization key in both `.lang` files.
- Add `unlock: { "context": "AlwaysUnlocked" }` to each recipe using format version 1.20.10.
- Extend pack validation to require each name key and recipe unlock field, then rebuild and inspect the `.mcaddon`.
- In-game confirmation still requires importing the rebuilt pack, checking Content Log, inspecting each item name, and crafting both recipes.
