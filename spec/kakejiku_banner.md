# Kakejiku Banner

[Common Specifications](README.md) / Block and Item ID: `bellity:kakejiku_banner`

## Specifications

| Field | Specification |
|---|---|
| Category | Decorative banner block with an explicit placement item |
| English Name | Kakejiku Banner |
| Japanese Name | 掛け軸 |
| Maximum Stack Size | 16 |
| Collision | None |
| Light Dampening | 0 |
| Breaking Time | 1.5 seconds by bare hand, equivalent to vanilla banner hardness 1 |
| Blast Resistance | 1 |
| Sound | Wood |
| Normal Breaking Drop | One Kakejiku Banner |
| Floor Placement | 16 headings at 22.5-degree intervals |
| Wall Placement | Four horizontal directions |
| Ceiling Placement | Unsupported |
| Source Texture | `model_data/kakejiku_banner_texture.png` |
| Source Geometry | `model_data/kakejiku_banner.geo.json` |

Obtain from Creative inventory or `/give @s bellity:kakejiku_banner`. The placement item uses `minecraft:block_placer` with `replace_block_item: true` to replace the automatically generated block item and enforce a maximum stack size of 16. A native `minecraft:placement_filter` requires support for floor and wall placement.

## Appearance and Placement

The supplied artwork is fixed. The runtime texture at `resource_pack/textures/blocks/kakejiku_banner_texture.png` is a byte-for-byte copy of the source. Both supplied source assets remain unchanged.

The runtime geometry at `resource_pack/models/blocks/kakejiku_banner.geo.json` uses namespaced identifiers to avoid the source's generic `geometry.unknown`. Floor variants `geometry.bellity.kakejiku_banner.floor_0` through `.floor_15` retain the standing model and rotate its root bone around Y by the variant number multiplied by 22.5 degrees. Inventory rendering uses `minecraft:item_visual` with the floor-zero geometry.

The wall variant `geometry.bellity.kakejiku_banner.wall` removes the standing pole (source cube zero) and shifts the remaining model by `[0, -16, 7]`. Block transformations rotate that wall model in 90-degree steps for the four directions. Placement state is managed by `behavior_pack/scripts/kakejiku_banner.js`, registered by `scripts/main.js`.

The supplied standing model is 30 pixels tall and extends above its base block cell. This oversized geometry is supported, but selection remains within the base cell; the upper cloth has no independent hitbox. Verify selection, nearby-block overlap, and appearance in Minecraft.

Floor selection bounds enclose the rotated model within the base cell. The native `minecraft:block_face` placement trait selects each support filter independently of the script-managed visual states, so the supporting face remains recorded after reload. References: [oversized geometry limits](https://learn.microsoft.com/en-us/minecraft/creator/documents/customblockoversized?view=minecraft-bedrock-stable), [placement filters](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/blockreference/examples/blockcomponents/minecraftblock_placement_filter?view=minecraft-bedrock-stable), and [block placement items](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/itemreference/examples/itemcomponents/minecraft_block_placer?view=minecraft-bedrock-stable).

## Crafting and Compatibility

No recipe is added. The wool color needed for a vanilla-style six-wool-and-stick banner recipe was not specified, so the ingredient decision and recipe remain TODO.

Common banner parameters are used where custom block components support them. Native loom interaction, dyeing, pattern layers, map markers, waving animation, furnace fuel behavior, axe mining speed, and exact water and piston behavior remain TODO compatibility gaps. The fixed supplied artwork does not implement native banner pattern data. Do not infer full vanilla banner equivalence from matching stack size, placement, or breaking parameters.

## Implementation Files

- Block: `behavior_pack/blocks/kakejiku_banner.json`
- Placement item: `behavior_pack/items/kakejiku_banner.json`
- Placement script: `behavior_pack/scripts/kakejiku_banner.js`, registered by `behavior_pack/scripts/main.js`
- Normal drop: `behavior_pack/loot_tables/blocks/kakejiku_banner.json`
- Runtime geometry: `resource_pack/models/blocks/kakejiku_banner.geo.json`
- Runtime texture: `resource_pack/textures/blocks/kakejiku_banner_texture.png`
- Texture registration: `resource_pack/textures/terrain_texture.json`
- Block rendering: `resource_pack/blocks.json`
- Localization: `resource_pack/texts/en_US.lang`, `resource_pack/texts/ja_JP.lang`
- Source validation: `tools/validate.mjs`
- Asset and block-permutation generation: `tools/generate-kakejiku-banner.mjs`; run with Node.js after editing the supplied source assets.

## Device Verification

All checks remain pending in Minecraft Bedrock. Verify pack loading and Content Log errors, both localized names, Creative availability, `/give`, stack size 16, inventory and handheld rendering, the supplied texture and model, all 16 floor headings and four wall directions, ceiling rejection, support requirements, support removal, no collision, light transmission, selection within the base cell, normal one-item drops, breaking time, blast behavior, wood sounds, and persistence after saving and reloading. Test Survival consumption, Creative retention, multiplayer placement, world-height boundaries, and unloaded neighbors. Record native banner compatibility observations separately before extending claims. See [test_checklist.md](../tests/test_checklist.md).
