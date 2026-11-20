# Osu Sword

[Common Specifications](README.md) / Item ID: `bellity:osu_sword`

## Status

Implemented in source. On 2026-11-20, user-supplied artwork replaced the generated temporary image; the PNG is copied unchanged from `model_data/osu_sword.png` to the runtime texture. The supplied Blockbench project is retained as an editable source, while runtime rendering remains a flat item icon with no geometry changes. New-image rendering requires device verification. Following the initial failed device test on 2026-11-19, the user confirmed that the revised movement corrected the reported 10-block slide behavior. Exact measurements, target, device, and test conditions were not supplied. Other verification items remain pending.

## Item Specifications

| Field | Specification |
|---|---|
| Category | Sword |
| Japanese Name | オスソード |
| English Name | Osu Sword |
| Display Name Key | `item.bellity:osu_sword.name` |
| Total Attack Power | 6 |
| Additional Damage | `minecraft:damage: 5`, following the existing sword convention of base attack power 1; total damage requires device verification |
| Maximum Durability | 2032 |
| Maximum Stack Size | 1, following the existing sword convention |
| Ability Targets | All mobs, including players |
| Activation Condition | Only attacks that deal damage to the target |
| Enchantments | Same compatible enchantments as vanilla swords in Bedrock Edition, following vanilla levels and mutual exclusions |
| Special Ability | The struck mob slides away from the attacker approximately 10 blocks on flat ground with an unobstructed path |
| Image | User-supplied PNG at `resource_pack/textures/items/osu_sword.png`, copied unchanged from `model_data/osu_sword.png` |
| Editable Source | `model_data/osu_sword.bbmodel`; retained for editing, without runtime geometry changes |

Use handheld display, the sword equipment group in the Creative inventory, and the `minecraft:is_sword` tag, following the common sword conventions. Obtain it with `/give @s bellity:osu_sword` or from the Creative inventory.

The explicit specifications are total attack power 6 and maximum durability 2032. These values take precedence over the original vanilla-sword comparisons. Verify total damage including base attack damage during implementation, and distinguish the durability component limit from the observed number of uses before breakage. Neither damage nor durability has been device-verified.

The enchantable slot is `sword`, with value 14 as an implementation default. Vanilla Bedrock sword enchantment compatibility, levels, exclusions, and acquisition methods require device verification. Knockback remains additive as specified below. Default rarity is retained. Repair material remains unspecified, so no material-repair component is configured. No fire or lava resistance is configured.

## Crafting

Craft one Osu Sword at the crafting table using the exact 3x3 layout below. `-` is empty.

```text
A A P
A A P
- S -
```

| Symbol | Material | Material ID | Quantity |
|---|---|---|---|
| A | Air Block (空気ブロック) | `bellity:air_block` | 4 |
| P | Poppy | `minecraft:poppy` | 2 |
| S | Stick | `minecraft:stick` | 1 |

`A` refers to this add-on's [Air Block](air_block.md), not vanilla air or an empty slot. The recipe ID and output are `bellity:osu_sword`, with output count 1 and pattern `["AAP", "AAP", " S "]`. Follow the common shaped-recipe, crafting-table, and `AlwaysUnlocked` policy.

## Special Ability

When an attack deals damage to a mob, including a player, make the struck target slide backward approximately 10 blocks through knockback on flat ground with an unobstructed path. All mobs are eligible, including hostile mobs, passive mobs, and players. Misses, fully blocked attacks, and any attacks that deal no damage do not activate the ability. Player targets are subject to the world's PvP and damage rules; if those rules prevent damage, the ability does not activate. The distance is an approximate target, not a strict requirement to stop at exactly 10 blocks. The requested movement is horizontal sliding; no additional upward launch is specified. Do not introduce a Wind Sword-style launch, impact visual effect, sound, or area attack.

The 10-block value describes displacement, not a raw knockback strength or velocity parameter. The corrected implementation starts horizontal movement immediately and maintains a bounded slide for 24 ticks, using additive `applyImpulse` adjustments toward a baseline horizontal speed of 0.42 blocks per tick. Sprinting adds 0.10 to this speed target, and each Knockback level adds another 0.10, with supported resistance applied to the target speed. Existing faster movement and vertical velocity are not canceled. Normal ground friction, water, and collision affect travel. Three consecutive stalled ticks stop the pushing task. These constants are model-based starting values that require device calibration against the approximate 10-block target.

"Backward" means away from the attacker, regardless of the target's facing direction. Flat ground with an unobstructed path, a target without knockback resistance, a non-sprinting attack, and no Knockback enchantment are the baseline for the approximate 10-block distance. A stationary target remains a proposed additional measurement condition. Measure horizontal displacement from the position at impact to the stopping position. Calibrate practical measurement tolerance during implementation and device testing.

Normal sprint-attack knockback and the Knockback enchantment add to the sword's baseline slide. When both are present, retain both bonuses. Do not cancel either bonus or clamp the resulting movement to approximately 10 blocks. Resistance, obstacles, and environmental effects still apply.

Respect normal knockback resistance and immunity, including those of bosses. Resistant targets may slide a shorter distance, and immune targets do not slide. Do not bypass resistance or immunity to force the baseline distance.

Respect normal collision with walls and other solid obstacles. An obstacle blocks further sliding into it, even if the target has not traveled approximately 10 blocks. Do not move or teleport the target through an obstacle to complete the distance.

The ability also activates underwater when the attack deals damage. Water resistance, currents, and normal water movement can change the resulting travel distance. Do not force the approximate 10-block flat-ground distance underwater.

Underwater targets receive the initial push, but sustained speed correction pauses while the target is in water so water drag can reduce travel naturally. Horizontal support continues during ordinary melee hops and airborne movement without adding vertical force.

The ability also activates against airborne targets when the attack deals damage, pushing them horizontally away from the attacker without an additional upward launch. Existing movement, gravity, and the lack of ground contact can change the travel distance. Do not force the approximate 10-block flat-ground distance while airborne.

The ability remains active on slopes and at terrain edges, following normal terrain collision and gravity. Slopes can change the resulting travel distance. A target pushed beyond a cliff or other unsupported edge falls normally; do not stop it at the edge or constrain it to the original ground height. Targets take normal fall damage under vanilla rules. The sword provides no fall-damage immunity or reduction.

When another damaging hit activates the ability while the target is already sliding, restart the slide from the target's position at that hit, away from the attacker responsible for the new hit. Apply the same baseline distance and applicable modifiers; do not merely append distance to the previous slide's destination. Existing sliding does not itself prevent reactivation. There is no additional ability cooldown: every attack that deals damage activates the ability. Normal attack and damage-immunity timing still determines whether an attack deals damage.

### Runtime Approach and Verification Limits

The shared module uses the sword's custom `onHitEntity` callback and `hadEffect`, correlated with positive melee damage from the same attacker to the same target within a bounded two-tick window. Projectile and unrelated damage causes are excluded. Activation does not depend on observing a change in native velocity or on both events sharing exactly the same tick. Slide tasks are replaced rather than stacked on repeat hits and are discarded when targets become unavailable or change dimension. No velocity clearing or teleportation is used.

The previous implementation inferred resistance from pre-hit and post-hit velocity samples. That inference could suppress additional movement when the samples were absent, overwritten, or already included ordinary knockback. It has been removed. The shared resistance helper uses explicit vanilla compatibility data: Armor Stands, Ender Dragons, Iron Golems, and Wardens are immune; Ravagers have resistance 0.75, and Hoglins and Zoglins have resistance 0.6. Each equipped Netherite armor piece adds 0.1 resistance, read at the hit. Other entity types default to no additional resistance. These values are not runtime attribute introspection: other packs can override vanilla definitions, and custom or state-dependent resistance is not generally available through stable Script API 2.0.0. Vanilla equipment interactions, custom entities, simultaneous hits, water, and repeat-hit behavior require device verification. Source checks and mock tests do not establish runtime movement distances or universal resistance parity.

## Implementation Files

Runtime definitions and user-supplied assets are included at the following paths.

- Item definition: `behavior_pack/items/osu_sword.json`
- Recipe: `behavior_pack/recipes/osu_sword.json`
- Hit behavior: `behavior_pack/scripts/knockback_swords.js`, registered by `behavior_pack/scripts/main.js`
- Resistance compatibility data and equipment handling: `behavior_pack/scripts/knockback_resistance.js`
- Runtime image: `resource_pack/textures/items/osu_sword.png`, user-supplied artwork
- Image source: `model_data/osu_sword.png`, copied unchanged to the runtime image
- Editable Blockbench source: `model_data/osu_sword.bbmodel`; runtime remains a flat item icon
- Historical generated image: `model_data/osu_sword_generated.png`; former temporary-asset prompts and provenance in `model_data/temporary_sword_images.md`
- Image registration: `resource_pack/textures/item_texture.json`
- Localization: `resource_pack/texts/ja_JP.lang`, `resource_pack/texts/en_US.lang`
- Source validation: `tools/validate.mjs`
- Mock runtime tests: `tests/knockback_swords.test.mjs`
- Device-verification record: `tests/test_checklist.md`

## Device Verification

The initial device test failed the requested slide-distance behavior. On 2026-11-19, the user confirmed the correction after testing the revised implementation in Minecraft. This confirms the reported slide behavior, without a detailed measurement or conditions log. The remaining checks are:

- Check pack loading and Content Log errors, Japanese and English names, Creative availability, `/give`, sword handling, stack size one, and the user-supplied image added on 2026-11-20 in inventory, first-person, and third-person views. The new image is not yet device-verified.
- Check the exact recipe, four custom Air Blocks, two Poppies, one Stick, the two empty lower corners, and output count one.
- Measure total attack damage 6 without armor, enchantments, critical hits, or other damage modifiers.
- Verify maximum durability 2032, durability consumption, and the observed number of uses before breakage under controlled conditions.
- User confirmed the corrected approximate 10-block slide behavior. A measured baseline run, confirmation across target types, and a separate no-added-upward-launch check remain pending.
- Verify activation on damaging hits against hostile mobs, passive mobs, and players. Confirm that misses, fully blocked attacks, damage-immune targets, and player damage restrictions that prevent damage do not activate the ability.
- Verify that normal knockback resistance reduces movement and knockback immunity prevents sliding, including for bosses.
- Verify that walls and other solid obstacles block sliding without allowing the target to pass through them, including when the traveled distance is less than 10 blocks.
- Verify activation on damaging underwater hits and confirm that water affects movement without forcing a 10-block distance. Check both still water and currents.
- Verify activation on damaging hits against airborne targets, horizontal movement away from the attacker, and no additional upward launch. Allow distance to vary with airborne movement.
- Verify activation on slopes with terrain-dependent travel distances, and that a target pushed beyond an unsupported edge falls normally.
- Verify normal fall damage after knockback, with no immunity or reduction granted by the sword.
- Verify that sprint-attack knockback adds to the baseline slide under otherwise identical conditions, without canceling the bonus or clamping movement to 10 blocks.
- Verify that the Knockback enchantment adds to the baseline slide at its supported levels, including when combined with sprint attacks, without canceling either bonus or clamping movement to 10 blocks.
- Verify that another damaging hit during sliding restarts the slide from the target's current position, away from the new attacker, with the same baseline and applicable modifiers. Check successive hits from different attackers.
- Verify activation on every damaging hit with no additional ability cooldown, while preserving normal attack and damage-immunity timing.
- Verify compatibility with vanilla Bedrock sword enchantments, their maximum levels, mutual exclusions, and applicable acquisition methods.
- Check target death or despawning, simultaneous multiplayer attacks, and behavior after saving and reloading, including cleanup of any active movement processing.
