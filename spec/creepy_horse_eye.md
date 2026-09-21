# Creepy Horse Eye

[Common Specifications](README.md) / Item ID: `bellity:creepy_horse_eye`

## Item Specifications

| Item | Specification | 
 | ----- | ----- | 
| Category | Usable Item (Not a sword, axe, or throwable weapon) | 
| Japanese Name | クリーピーホースの目 | 
| English Name | Creepy Horse Eye | 
| Display Name Key | `item.bellity:creepy_horse_eye.name` | 
| How to Use | Hold in hand and right-click on the spot to use | 
| Effect Area | A spherical area equivalent to a radius of 7 blocks centered on the player upon use, 15 blocks in diameter including the center. | 
| Freeze Duration | 10 seconds (200 game ticks) | 
| Cooldown Time | 20 seconds (400 game ticks) | 
| Maximum Stack Size | 1 (Unstackable) | 
| Image | `resource_pack/textures/items/creepy_horse_eye.png` | 
| Production Assets | `model_data/creepy_horse_eye.png`, `model_data/creepy_horse_eye.bbmodel` | 

Display in the equipment category in the creative inventory, and enable handheld display and the use button for touch operations. It does not generate a projectile when used; it instantly activates the ability with the player's current position as the center of the effect area. Use duration is 0.1 seconds, and movement multiplier during use is 1.0. Cannot be reused for 20 seconds after activation. Durability is not set, and the item is not consumed upon use.

## Crafting

Craft 1 item on the crafting table from the following 3x3 layout.

```text
S S S
S E S
S S S
```

| Symbol | Material ID | Material Name | 
 | ----- | ----- | ----- | 
| S | `minecraft:coal` | Coal | 
| E | `minecraft:ender_eye` | Ender Eye | 

Surround 1 Ender Eye with 8 Coals to craft 1 item using `minecraft:recipe_shaped`. The recipe ID and output are `bellity:creepy_horse_eye`. As per common specifications, specify the crafting table tag and `AlwaysUnlocked`. Also make it obtainable via the creative inventory and `/give @s bellity:creepy_horse_eye`.

## Special Ability

Confirm a spherical target area centered on the player's position at the exact moment of use (right-click), and freeze enemies within that area for 10 seconds. Do not add enemies that enter the area after activation to the targets; even if an enemy targeted at activation tries to leave the area, it remains frozen for the duration of the effect.

Targets shall be entities belonging to the `monster` family in Bedrock. This check excludes players, friendly mobs, items, and projectiles. Because the check uses the family rather than whether they are currently targeting the player, mobs like Endermen, Spiders, and Piglins are targeted even in a neutral state. Conversely, entities with hostile behavior that lack the `monster` family are excluded.

During a freeze, return the target to the position and rotation recorded at activation every game tick, and set its velocity to 0. This stops spontaneous movement such as walking or flying, as well as movement from knockback, falling, or water currents. Because Script API 2.0.0 lacks a stable API to universally stop AI or model animations, stopping attack processing, AI internal timers, Creeper fuses, and model animations is not guaranteed.

The space of the effect area will display `minecraft:colored_flame_particle` specified as white at 16 random points within the sphere every 10 game ticks, making it appear slightly whiter than usual only during the freeze. The types and states of the blocks themselves are not changed. After 10 seconds, stop generating new particles, returning to normal appearance as the remaining particles disappear. Check the ease of recognizing the sphere, whiteness, impact on visibility, appearance from multiple players, and rendering load on an actual device.

Implement the processing in the custom item component `bellity:freeze_nearby_enemies` and `behavior_pack/scripts/main.js`. Manage the effect end time and freeze position for each target, leaving no exceptions or permanent suspended states even if the target dies/despawns, changes dimensions, or the world reloads. If effects overlap on the same target, maintain the first freeze position and extend the end time until 10 seconds after the later-activated effect.

## Implementation Files and Verification

* Item: `behavior_pack/items/creepy_horse_eye.json`
* Recipe: `behavior_pack/recipes/creepy_horse_eye.json`
* Special Ability: `behavior_pack/scripts/main.js`
* Display Name: `resource_pack/texts/ja_JP.lang`, `resource_pack/texts/en_US.lang`
* Item Image: `resource_pack/textures/items/creepy_horse_eye.png`
* Image Registration: `resource_pack/textures/item_texture.json`
* On actual devices, verify the Japanese/English display names, image, specified recipe and obtaining method, on-the-spot activation via right-click, that the effect area is a sphere with a radius of 7 blocks, that only enemies in the area at activation stop for 10 seconds, and that it cannot be reused for 20 seconds after activation.
* Verify the boundary between inside and outside the area, airborne/underwater enemies, enemies taking knockback or falling, death/despawn/dimension transfer during the effect, simultaneous application to multiple entities, and overlapping use by multiple players.
* Verify that the white appearance matches the effect area and time, does not remain after deactivation, the appearance from players outside the area, and the rendering load.
* On 2026-09-21, ran `./build.ps1`, and source verification of 5 items/5 recipes, images, display names, 20-second cooldown, freeze processing, and generation of `dist/bellity_addon.mcaddon` succeeded. Confirmed that item definitions, recipes, scripts, and images are included in the distribution archive. Operation checks on Minecraft have not yet been conducted.
* On 2026-09-21, updated the development pack via `./install-dev.ps1 -Update`, and confirmed via `./tools/verify-dev.ps1` that the 13 Behavior Pack files and 14 Resource Pack files match the source. This is a deployment check; operation checks on Minecraft have not yet been conducted.