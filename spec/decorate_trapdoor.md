# Decorate Trapdoor

[Common Specifications](README.md) / Block ID: `bellity:decorate_trapdoor`

## Block Specifications

| Field | Specification |
|---|---|
| English Name | Decorate Trapdoor |
| Japanese Name | 模様付きのトラップドア |
| Display Name Key | `tile.bellity:decorate_trapdoor.name` |
| Category | Construction, trapdoors (`minecraft:itemGroup.name.trapdoor`) |
| Maximum Stack Size | Engine block default, 64 |
| Source Geometry | `model_data/decorate_trapdoor.geo.json` |
| Source Texture | `model_data/decorate_trapdoor_texture.png` |
| Runtime Geometry | `geometry.bellity.decorate_trapdoor`, `geometry.bellity.decorate_trapdoor.open` |
| Thickness | 3/16 block, matching the supplied model |
| Collision and Selection | Horizontal plate when closed; vertical plate when open |
| Normal Breaking Drop | One Decorate Trapdoor |
| Breaking Time and Blast Resistance | Engine defaults; explicit balance values are TODO |

Obtain from Creative inventory, the recipe, or `/give @s bellity:decorate_trapdoor`.

The Creative inventory group identifier must include the `minecraft:` namespace. An unnamespaced group prevents block parsing, which also invalidates the recipe result and leaves the custom component unused.

## Behavior

The requested behavior is a normal hand-operable trapdoor. Interact to toggle open/closed with wooden-trapdoor sounds. Sneaking leaves interaction available for block placement. Placement supports four horizontal directions and top/bottom halves. Side placement puts the hinge against the supporting block; top/bottom placement uses the player's facing trait. Closed top placement is translated upward by 13/16 block. Open geometry rotates the supplied plate 90 degrees around `[0, 8, 0]`, keeping it within the block cell. Geometry, collision, and selection rotate together for each direction.

Open and powered states are saved as block permutation states. The inventory geometry always shows the closed model. Source files remain unchanged; the runtime closed geometry has a unique identifier to avoid the existing Air Block's `geometry.unknown`. The runtime texture is an exact copy of the supplied PNG.

Redstone compatibility uses a one-tick callback and stable `Block.getRedstonePower()` on the trapdoor and its six neighbors. Rising power opens it; falling power closes it. Manual opening/closing is retained while the power level remains unchanged. This preserves the existing 1.21.110 target and server 2.0.0 dependency without experiments. Neighbor polling is an approximation: powered neighbors can affect the trapdoor even when a directional component points away. Exact vanilla redstone parity, waterlogging, ladder climbing, and piston behavior are not implemented or established by source checks. These are compatibility gaps, not verified vanilla equivalence. Native redstone consumer migration is TODO if the pack's minimum version is raised.

API references: [block traits](https://learn.microsoft.com/en-us/minecraft/creator/documents/intro-block-traits), [block tick](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/blockreference/examples/blockcomponents/minecraftblock_tick), [Block.getRedstonePower](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/block#getredstonepower), and [native redstone consumer version requirements](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/blockreference/examples/blockcomponents/minecraftblock_redstone_consumer).

## Crafting

Craft one Decorate Trapdoor at a crafting table:

```text
Q B Q
Q S Q
Q B Q
```

- `Q`: Quartz Block (`minecraft:quartz_block`), six blocks.
- `B`: Black Dye (`minecraft:black_dye`), two dyes.
- `S`: Sea Lantern (`minecraft:sea_lantern`), one lantern, interpreted from "Sea rantan".

The shaped recipe uses `AlwaysUnlocked` and produces one block. Output count was unspecified, so one follows the existing custom-block recipe convention.

## Implementation Files

- Definition: `behavior_pack/blocks/decorate_trapdoor.json`
- Interaction and power: `behavior_pack/scripts/decorate_trapdoor.js`, registered by `scripts/main.js`
- Recipe: `behavior_pack/recipes/decorate_trapdoor.json`
- Loot: `behavior_pack/loot_tables/blocks/decorate_trapdoor.json`
- Geometry: `resource_pack/models/blocks/decorate_trapdoor.geo.json`
- Texture: `resource_pack/textures/blocks/decorate_trapdoor.png`
- Atlas: `resource_pack/textures/terrain_texture.json`
- Names: `resource_pack/texts/en_US.lang`, `resource_pack/texts/ja_JP.lang`
- Source validation: `tools/validate.mjs`

## Device Verification

All in-game checks are pending. Verify names, Creative grouping, `/give`, stack size, exact recipe/output, inventory and handheld rendering, all four directions and both halves, hinge alignment, selection and collision in both states, manual interaction and sounds, sneaking placement, lever/button/dust power edges, directional circuit limitations, multiple players, normal drops, reload persistence, world-height/chunk boundaries, and Content Log errors. Test waterlogging, ladder and piston behavior separately before extending compatibility claims. Record observations in [test_checklist.md](../tests/test_checklist.md).
