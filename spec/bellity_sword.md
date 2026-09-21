# Bellity Sword

[Common Specifications](README.md) / Item ID: `bellity:bellity_sword`

## Item Specifications

| Item | Specification |
|---|---|
| Category | Sword |
| Japanese Name | ベリティソード |
| English Name | Bellity Sword |
| Display Name Key | `item.bellity:bellity_sword.name` |
| Additional Damage | `minecraft:damage: 31`. Assumed attack power 32 combined with base attack power 1 |
| Maximum Durability | 1233 |
| Maximum Stack Size | 1 |
| Image | `resource_pack/textures/items/bellity_sword.png` |
| Production Assets | `model_data/bellity_sword.png`, `model_data/bellity_sword.bbmodel` |

Display in the sword group of the equipment category in the creative inventory. Enable handheld display and attach the `minecraft:is_sword` tag.

## Crafting

Craft 1 item on the crafting table from the following 3x3 layout. `-` is empty.

```text
H G -
- C -
- B -
```

| Symbol | Material ID | Material Name |
|---|---|---|
| H | `minecraft:flint_and_steel` | Flint and Steel |
| G | `minecraft:gold_ingot` | Gold Ingot |
| C | `minecraft:creeper_head` | Creeper Head |
| B | `minecraft:stick` | Stick |

The recipe ID and output are `bellity:bellity_sword`. As per common specifications, specify the crafting table tag and `AlwaysUnlocked`.

## Special Ability

Attach `bellity:random_drop_on_hit`. In the entity hit event, if `hadEffect` is true, drop 1 item from the following 8 types with equal probability at the hit location.

`minecraft:apple`, `minecraft:coal`, `minecraft:iron_ingot`, `minecraft:gold_ingot`, `minecraft:redstone`, `minecraft:lapis_lazuli`, `minecraft:emerald`, `minecraft:diamond`.

Implement the processing in `behavior_pack/scripts/main.js`. If an exception occurs during the drop processing, output a warning to the content log.

## Implementation Files and Verification

- Item: `behavior_pack/items/bellity_sword.json`
- Recipe: `behavior_pack/recipes/bellity_sword.json`
- On actual devices, verify the display name, image, crafting, attack power, durability reduction, and drop on hit.
- Repair materials, enchantability, and rarity are undecided.