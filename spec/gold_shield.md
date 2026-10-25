# Gold Shield

[Common Specifications](README.md) / Item ID: `bellity:gold_shield`

## Item Specifications

| Field | Specification |
|---|---|
| Category | Offhand item |
| Japanese Name | ゴールド盾 |
| English Name | Gold Shield |
| Display Name Key | `item.bellity:gold_shield.name` |
| Durability | 551 |
| Maximum Stack Size | 1 |
| Offhand | Allowed |
| Image | `resource_pack/textures/items/gold_shield.png` |
| Geometry | `resource_pack/models/entity/gold_shield.geo.json`, identifier `geometry.bellity.gold_shield` |
| Source Assets | `model_data/gold_shield.png` and `model_data/gold_shield.geo.json` |
| Special Ability | Blocking and damage protection are TODO; not implemented |

Obtain the item from the Creative inventory or with `/give @s bellity:gold_shield`. The attachable displays the supplied model while held, with dedicated first-person and third-person animations for both hands. The texture is copied byte-for-byte. Source geometry remains unchanged; the runtime copy changes only its identifier from `geometry.shield` to `geometry.bellity.gold_shield` to avoid overriding vanilla shield geometry, retaining the supplied bones and UV data. The item declares durability 551 and permits offhand placement. These definitions do not implement shield protection or durability consumption when blocking. Repair materials, enchantability, and rarity are TODO.

## Crafting

Craft one Gold Shield at the crafting table using the exact 3x3 layout below. `-` is empty.

```text
W G W
W W W
- W -
```

| Symbol | Material ID | Material Name |
|---|---|---|
| G | `minecraft:gold_ingot` | Gold Ingot |
| W | `minecraft:warped_planks` | Warped Planks |

The shaped recipe ID and output are `bellity:gold_shield`; the pattern is `["WGW", "WWW", " W "]` and output count is one. The recipe follows the common crafting-table and `AlwaysUnlocked` policy.

## Shield Behavior Limitation

The project's item format 1.21.110 does not provide a native custom-item shield blocking component. This implementation adds the named item, durability definition, recipe, supplied image and geometry, and offhand support. It does not intercept attacks, reduce incoming damage, or consume durability on blocked attacks. Blocking behavior remains TODO and must be specified and implemented before protection can be claimed.

## Implementation Files

- Item definition: `behavior_pack/items/gold_shield.json`
- Recipe: `behavior_pack/recipes/gold_shield.json`
- Attachable: `resource_pack/attachables/gold_shield.json`
- Display animations: `resource_pack/animations/gold_shield.animation.json`
- Render controller: `resource_pack/render_controllers/gold_shield.render_controllers.json`
- Geometry: `resource_pack/models/entity/gold_shield.geo.json`
- Image: `resource_pack/textures/items/gold_shield.png`
- Image registration: `resource_pack/textures/item_texture.json`
- Localization: `resource_pack/texts/ja_JP.lang`, `resource_pack/texts/en_US.lang`

## Device Verification

All checks remain pending in Minecraft Bedrock. Verify pack loading without Content Log errors, Japanese and English names, Creative availability, `/give`, stack size one, the exact recipe and output count, durability 551, and offhand placement. Check the supplied texture and geometry in first-person and third-person views in both hands, including ordinary held and sneaking poses. Verify item persistence after saving and reloading. Record observed damage and durability behavior separately; shield blocking and damage protection are not implemented.
