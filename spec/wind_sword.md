# Wind Sword

[Common Specifications](README.md) / Item ID: `bellity:wind_sword`

## Status

Implemented in source. On 2026-11-20, user-supplied artwork replaced the generated temporary image; the PNG is copied unchanged from `model_data/wind_sword.png` to the runtime texture. The supplied Blockbench project is retained as an editable source, while runtime rendering remains a flat item icon with no geometry changes. New-image rendering requires device verification. Following the initial failed device test on 2026-11-19, the user confirmed that the revised movement corrected the reported 7-block rise and 5-block horizontal-travel behavior. Exact measurements, target, device, and test conditions were not supplied. Other verification items remain pending.

## Item Specifications

| Field | Specification |
|---|---|
| Category | Sword |
| Japanese Name | ウィンドソード |
| English Name | Wind Sword |
| Display Name Key | `item.bellity:wind_sword.name` |
| Total Attack Power | 9 |
| Additional Damage | `minecraft:damage: 8`, following the existing sword convention of base attack power 1; total damage requires device verification |
| Maximum Durability | 1927 |
| Maximum Stack Size | 1, following the existing sword convention |
| Special Ability | Wind Charge impact visual effect and sound on a damaging hit against any mob, including players; launch the target approximately 7 blocks upward and 5 blocks horizontally under baseline conditions |
| Enchantments | Same compatible enchantments as vanilla swords, following vanilla levels and mutual exclusions |
| Image | User-supplied PNG at `resource_pack/textures/items/wind_sword.png`, copied unchanged from `model_data/wind_sword.png` |
| Editable Source | `model_data/wind_sword.bbmodel`; retained for editing, without runtime geometry changes |

Follow the common sword conventions: handheld display, the sword equipment group in the Creative inventory, and the `minecraft:is_sword` tag. Obtain it with `/give @s bellity:wind_sword` or from the Creative inventory. The enchantable slot is `sword`, with value 14 as an implementation default. Vanilla sword enchantment compatibility requires device verification. Default rarity is retained. Repair material remains unspecified, so no material-repair component is configured.

## Crafting

Craft one Wind Sword at the crafting table using the exact 3x3 layout below. `-` is empty.

```text
- C -
G W G
D S D
```

| Symbol | Material | Material ID / Status |
|---|---|---|
| C | Wind Charge | `minecraft:wind_charge` |
| G | Short Grass (短い草) | `minecraft:short_grass` |
| W | Stick | `minecraft:stick` |
| D | Water Bottle | `minecraft:potion`, data `0` |
| S | Stick | `minecraft:stick` |

The recipe ID and output are `bellity:wind_sword`, with output count 1 and pattern `[" C ", "GWG", "DSD"]`. Follow the common shaped-recipe, crafting-table, and `AlwaysUnlocked` policy. Both `G` slots require Short Grass; tall grass and grass blocks do not satisfy this ingredient. Both `W` and `S` are sticks. The two `D` slots require Water Bottles; empty bottles and other potion variants do not satisfy this ingredient. Verify ingredient matching in Minecraft, including rejection of other potion variants.

## Special Ability

### Wind Charge Impact

When a sword hit deals damage to a mob, reproduce the visual effect and sound of a vanilla Wind Charge hitting a target, at the struck target. All mobs are eligible, including hostile mobs, passive mobs, and players. Player targets remain subject to the world's PvP and damage rules. Missed attacks, fully blocked attacks, and attacks that deal no damage do not trigger the special ability. The implementation uses particle `minecraft:wind_explosion_emitter` and sound `wind_charge.burst`; visual and audible parity with the vanilla impact requires device verification.

Reproduce only the impact visual effect and sound, together with the specified knockback. Do not spawn a Wind Charge projectile, cause area damage, add separate impact damage, or activate or alter nearby blocks. Only the directly struck target receives the special knockback.

### Knockback

The baseline movement target is an approximate rise of 7 blocks above the position at impact and an approximate horizontal travel distance of 5 blocks. These values describe displacement in blocks, not raw knockback strength or velocity parameters. Account for ordinary melee knockback when tuning the baseline movement.

The horizontal direction is away from the attacker. The measurement baseline is a stationary target without knockback resistance on flat ground with unobstructed air space, struck without sprinting or a Knockback enchantment. Measure the maximum height above the hit position and horizontal displacement from that position to landing. The distances are approximate targets, rather than guaranteed movement in every environment; launch parameters and practical measurement tolerance require device calibration.

Sprint-attack knockback and the Knockback enchantment add to the baseline movement; do not clamp the resulting distance to 5 horizontal blocks or cancel these bonuses. Every damaging hit reapplies the launch, including hits against an already airborne target. No additional ability cooldown is specified; ordinary attack and damage rules still govern whether a hit deals damage.

Respect normal knockback resistance and immunity, including those of bosses; do not force resistant or immune targets to meet the baseline distances. Walls, ceilings, terrain, water, other movement effects, and target characteristics can alter the resulting movement. Do not teleport targets through obstacles or force them to travel the baseline distances. Targets take normal fall damage under vanilla rules; the sword grants no fall-damage protection. Verify these interactions on device without claiming a universal travel distance.

### Runtime Approach and Verification Limits

The shared module uses the sword's custom `onHitEntity` callback and `hadEffect`, correlated with positive melee damage from the same attacker to the same target within a bounded two-tick window. Projectile and unrelated damage causes are excluded. Activation does not depend on observing a change in native velocity or on both events sharing exactly the same tick.

The previous implementation inferred resistance from pre-hit and post-hit velocity samples. That inference could suppress additional movement when the samples were absent, overwritten, or already included ordinary knockback. It has been removed. The corrected movement uses additive `applyImpulse` adjustments toward a baseline vertical speed of 1.10 blocks per tick and horizontal speed of 0.50 blocks per tick, scaled for supported resistance cases. Existing faster movement is not canceled, and ordinary sprint and Knockback-enchantment bonuses are retained. These launch targets are model-based starting values; they do not prove a 7-block rise or 5-block horizontal travel in Minecraft.

The shared resistance helper uses explicit vanilla compatibility data: Armor Stands, Ender Dragons, Iron Golems, and Wardens are immune; Ravagers have resistance 0.75, and Hoglins and Zoglins have resistance 0.6. Each equipped Netherite armor piece adds 0.1 resistance, read at the hit. Other entity types default to no additional resistance. These values are not runtime attribute introspection: other packs can override vanilla definitions, and custom or state-dependent resistance is not generally available through stable Script API 2.0.0. Vanilla equipment interactions, custom entities, simultaneous hits, water, and repeat-hit behavior require device verification. Source checks and mock tests do not establish runtime movement distances or universal resistance parity.

Implementation references: [Mojang Wind Charge projectile](https://github.com/Mojang/bedrock-samples/blob/main/behavior_pack/entities/wind_charge_projectile.json), [Mojang wind impact particle](https://github.com/Mojang/bedrock-samples/blob/main/resource_pack/particles/wind_explosion.json), [Bedrock shaped recipes](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/recipereference/examples/recipedefinitions/minecraftrecipe_shaped), and [Water Bottle data value](https://learn.microsoft.com/en-us/minecraft/creator/documents/create-custom-potions).

## Implementation Files

Runtime definitions and user-supplied assets are included at the following paths.

- Item definition: `behavior_pack/items/wind_sword.json`
- Recipe: `behavior_pack/recipes/wind_sword.json`
- Hit behavior: `behavior_pack/scripts/knockback_swords.js`, registered by `behavior_pack/scripts/main.js`
- Resistance compatibility data and equipment handling: `behavior_pack/scripts/knockback_resistance.js`
- Runtime image: `resource_pack/textures/items/wind_sword.png`, user-supplied artwork
- Image source: `model_data/wind_sword.png`, copied unchanged to the runtime image
- Editable Blockbench source: `model_data/wind_sword.bbmodel`; runtime remains a flat item icon
- Historical generated image: `model_data/wind_sword_generated.png`; former temporary-asset prompts and provenance in `model_data/temporary_sword_images.md`
- Image registration: `resource_pack/textures/item_texture.json`
- Localization: `resource_pack/texts/ja_JP.lang`, `resource_pack/texts/en_US.lang`
- Source validation: `tools/validate.mjs`
- Mock runtime tests: `tests/knockback_swords.test.mjs`
- Device-verification record: `tests/test_checklist.md`

## Device Verification

The initial device test failed the requested launch-distance behavior. On 2026-11-19, the user confirmed the correction after testing the revised implementation in Minecraft. This confirms the reported launch behavior, without a detailed measurement or conditions log. The remaining checks are:

- Check pack loading and Content Log errors, both display names, Creative availability, `/give`, sword handling, stack size one, and the user-supplied image added on 2026-11-20 in inventory, first-person, and third-person views. The new image is not yet device-verified.
- Check the exact recipe, Short Grass in both `G` slots, sticks in both the `W` and `S` slots, Water Bottles in both `D` slots, empty slots, and output count one. Confirm that tall grass and grass blocks do not satisfy `G`, and that diamonds, empty bottles, and other potion variants do not satisfy `D`.
- Measure total attack power 9 under controlled conditions and verify maximum durability 1927 and durability consumption. Check compatibility with vanilla sword enchantments, their levels and mutual exclusions, and their normal acquisition methods.
- Compare the hit visual effect and sound with a vanilla Wind Charge impact. Check the effect position and repeated hits.
- User confirmed the corrected approximate 7-block rise and 5-block horizontal-travel behavior. A measured baseline run and confirmation across target types remain pending.
- Check hostile and passive mobs and damage-enabled player targets. Confirm that misses, fully blocked hits, and damage-immune attacks trigger neither the impact effect nor special knockback.
- Confirm sprint-attack and Knockback-enchantment bonuses add to baseline movement. Check repeated launches on damaging airborne hits, resistance and immunity, bosses, walls and ceilings, water and other movement modifiers, and normal fall damage.
- Confirm there is no spawned projectile, area damage, separate impact damage, or interaction with nearby blocks.
- Check target death or despawning, simultaneous multiplayer hits, and behavior after saving and reloading.
