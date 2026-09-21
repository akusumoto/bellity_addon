# Creepy Horse Eye

[Common Specifications](README.md) / Item ID: `bellity:creepy_horse_eye`

## Item Specifications

| Item | Specification |
|---|---|
| Category | Usable item (not a sword, axe, or throwable weapon) |
| Japanese Name | クリーピーホースの目 |
| English Name | Creepy Horse Eye |
| Display Name Key | `item.bellity:creepy_horse_eye.name` |
| How to Use | Hold the item and right-click to use it at the player's current position |
| Effect Area | A sphere with a 7-block radius centered on the player at activation (15 blocks across when including the center) |
| Freeze Duration | 10 seconds (200 game ticks) |
| Cooldown | 20 seconds (400 game ticks) |
| Maximum Stack Size | 1 (unstackable) |
| Image | `resource_pack/textures/items/creepy_horse_eye.png` |
| Activation Sound | `bellity.creepy_horse_eye_activate`, played at the player's position when the item activates |
| Production Assets | `model_data/creepy_horse_eye.png`, `model_data/creepy_horse_eye.bbmodel`, `model_data/creepy_horse_eye_activate.ogg` |

Display the item in the equipment category of the Creative inventory, use the handheld presentation, and enable the use button for touch controls. Using the item does not create a projectile; it activates immediately with the player's current position as the center of the effect area. The use duration is 0.1 seconds and the movement multiplier while using it is 1.0. The item cannot be used again for 20 seconds after activation. It has no durability and is not consumed when used.

## Crafting

Craft one item at a crafting table with this 3x3 layout:

```text
S S S
S E S
S S S
```

| Symbol | Material ID | Material Name |
|---|---|---|
| S | `minecraft:coal` | Coal |
| E | `minecraft:ender_eye` | Ender Eye |

Surround one Ender Eye with eight Coal and produce one item using `minecraft:recipe_shaped`. The recipe ID and output are both `bellity:creepy_horse_eye`. In accordance with the common specifications, include the crafting-table tag and `AlwaysUnlocked`. The item must also be obtainable from the Creative inventory and with `/give @s bellity:creepy_horse_eye`.

## Special Ability

At the moment of use, establish a spherical target area centered on the player's position and freeze enemies within it for 10 seconds. Enemies entering the area after activation are not added as targets. An enemy captured at activation remains frozen for the full duration even if it attempts to leave the area.

Targets are entities in Bedrock's `monster` family. This excludes players, friendly mobs, items, and projectiles. Because selection is based on family rather than current hostility, neutral Endermen, Spiders, Piglins, and similar mobs are included. Conversely, an entity with hostile behavior but without the `monster` family is excluded.

In this specification, "freeze" means stopping the target's normal self-directed motion—including walking, flying, falling, knockback, movement caused by water currents, and changes to its body or head direction—while retaining the position and direction captured at activation. To make the frozen state visible, apply a slight tremble of no more than 0.025 blocks around the anchor position every tick without cumulative drift. At the end of the effect, restore the exact anchor position and direction so normal movement can resume.

The implementation stores the target's location and rotation, teleports it to a tiny offset from the anchor every tick, reapplies its captured rotation, and clears its velocity. This corrects movement, primary body rotation, and the head direction of most mobs. However, stable Script API 2.0.0 has no API that can individually and comprehensively suspend AI, attacks, internal timers, model animations, vocalizations, or attack sounds for every arbitrary vanilla mob. Sound stopping operates by listener or sound ID and would affect unrelated sounds, so it is not used. These behaviors are not guaranteed to stop completely and any remaining behavior must be recorded during device verification.

Within the effect area, display white `minecraft:colored_flame_particle` particles at 16 random points inside the sphere every 10 game ticks. Do not change any block type or state. Stop generating particles after 10 seconds; the appearance returns to normal as the remaining particles disappear. Verify the sphere's visibility, whiteness, effect on visibility, appearance to multiple players, and rendering load on a device.

At activation, play `model_data/creepy_horse_eye_activate.ogg` once from the player's current position through the `bellity.creepy_horse_eye_activate` sound event. The resource-pack copy is `resource_pack/sounds/creepy_horse_eye_activate.ogg` and its registration is in `resource_pack/sounds/sound_definitions.json`.

Implement the behavior in the `bellity:freeze_nearby_enemies` custom item component and `behavior_pack/scripts/main.js`. Do not leave exceptions or permanently suspended state when a target dies, despawns, changes dimensions, or the world reloads. If effects overlap on the same target, retain the first anchor position and rotation and extend the end time until 10 seconds after the later activation.

## Implementation Files and Verification

- Item: `behavior_pack/items/creepy_horse_eye.json`
- Recipe: `behavior_pack/recipes/creepy_horse_eye.json`
- Special ability: `behavior_pack/scripts/main.js`
- Display names: `resource_pack/texts/ja_JP.lang`, `resource_pack/texts/en_US.lang`
- Item image: `resource_pack/textures/items/creepy_horse_eye.png`
- Image registration: `resource_pack/textures/item_texture.json`
- Activation sound: `resource_pack/sounds/creepy_horse_eye_activate.ogg`
- Sound registration: `resource_pack/sounds/sound_definitions.json`
- On a device, verify the Japanese and English display names, image, specified recipe, obtaining methods, activation at the player's current position, 7-block-radius spherical area, 10-second freeze of only the enemies present in the area at activation, and 20-second cooldown.
- Verify that body and head direction, walking, flying, knockback, falling, and movement caused by water currents are corrected every tick; that the slight tremble does not accumulate into drift; and that the target returns to its anchor and resumes normal motion when the effect ends.
- For each tested mob, record any AI attacks, Creeper fuse progress, model animations, vocalizations, or attack sounds that remain because the API cannot guarantee their complete suspension.
- Verify the inside/outside boundary, airborne and underwater enemies, death, despawning, dimension changes, simultaneous application to multiple entities, and overlapping use by multiple players.
- Verify that the white appearance matches the effect area and duration, does not remain after deactivation, appears correctly to players outside the area, and has acceptable rendering cost.
- Verify that the custom activation sound plays exactly once on each successful activation, including the first and subsequent uses after the cooldown, without a Content Log error. Confirm its audible range and behavior for nearby players on a device.
- On 2026-09-21, `./build.ps1` passed source validation for five items, five recipes, images, display names, the 20-second cooldown, and freeze processing, and generated `dist/bellity_addon.mcaddon`. The item definition, recipe, script, and image were confirmed in the distribution archive. Minecraft operation was not verified.
- On 2026-09-21, the development packs were updated with `./install-dev.ps1 -Update`, and `./tools/verify-dev.ps1` confirmed that 13 Behavior Pack files and 14 Resource Pack files matched the source. This was a deployment check, not Minecraft operation verification.
- On 2026-09-21, a device run reported that constructing `MolangVariableMap` during early execution stopped `main.js`. The white-particle variable map was changed to initialize lazily when the effect first runs. `node --check behavior_pack/scripts/main.js` and `node tools/validate.mjs` passed, but the corrected behavior has not yet been retested in Minecraft.
- On 2026-09-21, the freeze definition was updated to anchor position and direction while applying a slight tremble, and source validation passed. The tremble, head direction, release behavior, and sounds, AI, or animations remaining because of API limitations have not yet been verified in Minecraft.
