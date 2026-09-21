# Chotto Netherite Axe

[Common Specifications](README.md) / Item ID: `bellity:noboru_netherite_axe`

## Item Specifications

| Item | Specification | 
 | ----- | ----- | 
| Category | Axe | 
| Japanese Name | ちょっとネザライトの斧 | 
| English Name | Chotto Netherite Axe | 
| Display Name Key | `item.bellity:noboru_netherite_axe.name` | 
| Additional Damage | `minecraft:damage: 5`. Assumed attack power 6 combined with base attack power 1 | 
| Maximum Durability | 1200 | 
| Maximum Stack Size | 1 | 
| Image | `resource_pack/textures/items/noboru_netherite_axe.png` | 
| Production Assets | `model_data/noboru_netherite_axe.png`, `model_data/noboru_netherite_axe.bbmodel` | 

Display in the axe group of the equipment category in the creative inventory. Enable handheld display and attach the `minecraft:is_axe` and `minecraft:is_tool` tags. Set the destruction speed of blocks with the `wood` tag to 6 using `minecraft:digger`. Scripts for special abilities are not used.

## Crafting

Craft 1 item on the crafting table from the following 3x3 layout. `-` is empty.

```
N N -
- B -
- B -

```

| Symbol | Material ID | Material Name | 
 | ----- | ----- | ----- | 
| N | `minecraft:netherite_ingot` | Netherite Ingot | 
| B | `minecraft:stick` | Stick | 

The recipe ID and output are `bellity:noboru_netherite_axe`. As per common specifications, specify the crafting table tag and `AlwaysUnlocked`. It can also be obtained from the creative inventory and via `/give`.

## Implementation Files and Verification

* Item: `behavior_pack/items/noboru_netherite_axe.json`

* Recipe: `behavior_pack/recipes/noboru_netherite_axe.json`

* On actual devices, verify the display name, image, crafting, attack power, durability reduction, and mining speed for wood-type blocks.

* Repair materials, enchantability, and additional effects specific to the axe are undecided.