# Pallet

[Common Specifications](README.md) / Item ID: `bellity:pallet`

## Item Specifications

| Field | Specification |
|---|---|
| Category | Use-activated item, Creative Items tab |
| English Name | Pallet |
| Japanese Name | パレット |
| Display Name Key | `item.bellity:pallet.name` |
| Maximum Stack Size | 1 |
| Durability | No durability component |
| Image | `resource_pack/textures/items/pallet.png` |
| Source Asset | `model_data/pallet.png`, copied unchanged |
| Special Ability | Open a server form and place the selected concrete beside the aimed block |

Obtain the item through crafting, the Creative inventory, or `/give @s bellity:pallet`. Using the item does not consume it. Concrete placement generates one block without requiring concrete in the player's inventory. An inventory cost, cooldown, attack performance, enchantability, and rarity are unspecified; additional balance decisions remain TODO.

## Crafting

Craft one Pallet at a crafting table with the following exact layout. `-` is empty.

```text
- T -
T B T
T P T
```

| Symbol | Material ID | Material Name |
|---|---|---|
| T | `minecraft:spruce_planks` | Spruce Planks |
| B | `minecraft:brush` | Brush |
| P | `minecraft:purple_concrete` | Purple Concrete |

The shaped recipe ID and output are `bellity:pallet`. The pattern is `[" T ", "TBT", "TPT"]`, with the `crafting_table` tag and `AlwaysUnlocked` unlock policy.

## Concrete Selection and Placement

The custom item component `bellity:open_pallet` opens an `ActionFormData` server form for the player using the item. The title uses the localized item name. The body is exactly `セットするコンクリートを選択`. Buttons appear in this order and use the corresponding vanilla concrete textures:

| Text | Concrete Block ID | Icon Path |
|---|---|---|
| 赤 | `minecraft:red_concrete` | `textures/blocks/concrete_red` |
| オレンジ | `minecraft:orange_concrete` | `textures/blocks/concrete_orange` |
| 黄色 | `minecraft:yellow_concrete` | `textures/blocks/concrete_yellow` |
| 緑 | `minecraft:green_concrete` | `textures/blocks/concrete_green` |
| 空色 | `minecraft:light_blue_concrete` | `textures/blocks/concrete_light_blue` |
| 青 | `minecraft:blue_concrete` | `textures/blocks/concrete_blue` |
| 紫 | `minecraft:purple_concrete` | `textures/blocks/concrete_purple` |
| 桃 | `minecraft:pink_concrete` | `textures/blocks/concrete_pink` |

When the form opens, the script captures the block face the player is aiming at using a six-block raycast. Selecting a color places one corresponding concrete block in the adjacent cell outside that face. The target remains the cell captured at opening, so aiming elsewhere while the form is open does not change the destination.

Placement requires an air block at the destination, a valid player in the same dimension, and a destination center within seven blocks of the player's feet when the choice returns. The seven-block response limit allows for the adjacent cell beyond the six-block raycast target. The reach and empty-cell policy are implementation defaults. Occupied destinations are preserved. Missing targets, excessive distance, and dimension changes produce feedback without placement. Cancellation, invalid responses, and player disconnection do not place a block. Only one form may be open per player; different players have independent forms. UI failures are caught and clear the open-form guard so a later use can succeed.

## Implementation Files

- Item definition: `behavior_pack/items/pallet.json`
- Recipe: `behavior_pack/recipes/pallet.json`
- Custom component registration: `behavior_pack/scripts/main.js`
- Server form and placement: `behavior_pack/scripts/pallet.js`
- Script dependency: `@minecraft/server-ui` 2.0.0 in `behavior_pack/manifest.json`
- Image: `resource_pack/textures/items/pallet.png`
- Image registration: `resource_pack/textures/item_texture.json`
- Localization: `resource_pack/texts/en_US.lang`, `resource_pack/texts/ja_JP.lang`
- Source checks: `tools/validate.mjs`

## Device Verification

All Minecraft Bedrock checks remain pending. Verify pack loading and the Content Log, localized names, supplied image, Creative availability, `/give`, stack size, recipe, exact form body and ordered button labels/icons, and placement for every color on all six block faces. Verify cancellation, no aimed block, out-of-range targets, occupied destinations, moving or changing dimensions while the form is open, repeated use, multiplayer use, player disconnection, and saving/reloading. Confirm the Pallet is retained, no concrete inventory is required, and placed concrete persists. Mock callbacks and source validation do not establish in-game behavior.
