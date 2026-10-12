# Air Block

[Common Specifications](README.md) / Block ID: `bellity:air_block`

## Block Specifications

| Field | Specification |
|---|---|
| Category | Placeable block |
| Japanese Name | 空気ブロック |
| English Name | Air Block |
| Display Name Key | `tile.bellity:air_block.name` |
| Maximum Stack Size | 64 |
| Geometry | `resource_pack/models/blocks/air_block.geo.json`, identifier `geometry.unknown` |
| Texture | `resource_pack/textures/blocks/air_block.png` |
| Material | `alpha_test`, with the same geometry and material for placed, inventory, and handheld rendering |
| Source Assets | `model_data/air_block.geo.json`, `model_data/air_block_texture.png` |
| Collision and Selection | Default solid cube collision and selection boxes |
| Breaking Time and Blast Resistance | Engine defaults; explicit balance values are TODO |
| Normal Breaking Drop | One Air Block |

The block is placeable and uses the supplied geometry and texture unchanged. Its name does not imply that it behaves like vanilla air. The block remains solid, and its collision and selection boxes do not follow individual model details. Obtain it from the Creative inventory or with `/give @s bellity:air_block`.

## Crafting

Craft one Air Block at the crafting table using the exact 3x3 layout below.

```text
W W W
W W W
W W W
```

`W` is `minecraft:white_concrete` (White Concrete). The shaped recipe ID and output are `bellity:air_block`; the pattern is `["WWW", "WWW", "WWW"]`. The recipe follows the common crafting-table and `AlwaysUnlocked` policy.

## Implementation Files

- Block definition: `behavior_pack/blocks/air_block.json`
- Recipe: `behavior_pack/recipes/air_block.json`
- Loot table: `behavior_pack/loot_tables/blocks/air_block.json`
- Geometry: `resource_pack/models/blocks/air_block.geo.json`
- Texture: `resource_pack/textures/blocks/air_block.png`
- Texture registration: `resource_pack/textures/terrain_texture.json`
- Localization: `resource_pack/texts/ja_JP.lang`, `resource_pack/texts/en_US.lang`

## Device Verification

All checks remain pending in Minecraft Bedrock. Verify pack loading and Content Log errors, Japanese and English names, Creative availability, `/give`, stack size 64, the exact nine-White-Concrete recipe and output count, inventory rendering, placement, model and texture rendering from all sides, selection and collision, breaking and dropped-item behavior, and persistence after saving and reloading. Record the observed breaking time and blast behavior before choosing explicit balance values.
