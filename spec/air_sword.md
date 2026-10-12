# Air Sword

[Common Specifications](README.md) / Item ID: `bellity:air_sword`

## Item Specifications

| Field | Specification |
|---|---|
| Category | Sword |
| Japanese Name | 空気ソード |
| English Name | Air Sword |
| Display Name Key | `item.bellity:air_sword.name` |
| Additional Damage | `minecraft:damage: 5`; assumed total attack power 6 with base attack power 1 |
| Durability | Unbreakable; no `minecraft:durability` component |
| Maximum Stack Size | 1 |
| Image | `resource_pack/textures/items/air_sword.png` |
| Source Asset | `model_data/air_sword.png`, copied unchanged |
| Special Ability | Levitation I for 200 ticks (10 seconds) on a successful hit |

The sword uses handheld display, the sword equipment group, and the `minecraft:is_sword` tag. Obtain it from the Creative inventory or with `/give @s bellity:air_sword`. Repair materials, enchantability, and rarity are TODO.

## Crafting

Craft one Air Sword at the crafting table using the exact 3x3 layout below. `-` is empty.

```text
- A -
- A -
- B -
```

| Symbol | Material ID | Material Name |
|---|---|---|
| A | `bellity:air_block` | Air Block |
| B | `minecraft:black_concrete` | Black Concrete |

The shaped recipe ID and output are `bellity:air_sword`; the pattern is `[" A ", " A ", " B "]`. The recipe follows the common crafting-table and `AlwaysUnlocked` policy.

## Special Ability

The custom item component `bellity:levitation_on_hit`, registered in `behavior_pack/scripts/main.js`, applies the vanilla `levitation` effect with amplifier 0 for 200 ticks after a successful hit. This causes eligible targets to rise like targets struck by a shulker projectile. A missed or unsuccessful attack does not apply the effect.

There is no monster-family filter: any struck living entity that accepts the effect is eligible, including friendly mobs and players when damage is allowed. Repeated hits refresh the same effect rather than adding another level. Vanilla effect immunities remain in force. The duration and level are implementation defaults because the request did not specify them; balance adjustments are TODO after device verification.

## Implementation Files

- Item definition: `behavior_pack/items/air_sword.json`
- Recipe: `behavior_pack/recipes/air_sword.json`
- Special ability: `behavior_pack/scripts/main.js`
- Image: `resource_pack/textures/items/air_sword.png`
- Image registration: `resource_pack/textures/item_texture.json`
- Localization: `resource_pack/texts/ja_JP.lang`, `resource_pack/texts/en_US.lang`

## Device Verification

All checks remain pending in Minecraft Bedrock. Verify pack loading and Content Log errors, Japanese and English names, unchanged supplied image, Creative availability, `/give`, stack size one, the exact recipe and output count, total attack damage under controlled conditions, and that repeated attacks and normal sword use never break the item. Check Levitation I on successful hits, the 10-second duration, repeated-hit refresh, missed or blocked hits, friendly targets and damage-enabled players, vanilla immune targets, target death or despawning, overlapping multiplayer attacks, and persistence after saving and reloading.
