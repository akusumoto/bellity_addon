# Rainbow Leggings

[Common Specifications](README.md) / Item ID: `bellity:rainbow_leggings`

## Status and Scope

Item definitions, recipes, supplied inventory icons, worn texture, and armor attachables are implemented. Source checks cover the definitions and assets; actual protection, enchanting, infinite durability, and worn appearance remain pending device verification.

This item is part of Rainbow Armor (Japanese set name: 虹色アーマー), comprising the [helmet](rainbow_helmet.md), [chestplate](rainbow_chestplate.md), [leggings](rainbow_leggings.md), and [boots](rainbow_boots.md). The set differs from iron armor in its names, appearance, stone crafting material, and infinite durability. Other gameplay behavior must match the corresponding vanilla iron armor piece.

## Item Specifications

| Field | Specification |
|---|---|
| Item ID | `bellity:rainbow_leggings` |
| Japanese Name | 虹色のレギンス |
| English Name | Rainbow Leggings |
| Display Name Key | `item.bellity:rainbow_leggings.name` |
| Category | Equipment / armor |
| Equipment Slot | `slot.armor.legs` |
| Protection | 5 armor points, matching the corresponding iron piece |
| Durability | Infinite; never loses durability or breaks through use |
| Maximum Stack Size | 1 |
| Enchantability | 9, matching iron armor; slot `armor_legs` |
| Additional Knockback Resistance | 0, matching iron armor |
| Special Ability | None |
| Supplied Worn Texture | `model_data/rainbow_armor_layer_1.png` |
| Inventory Icon Source | `model_data/rainbow_leggings.png` |

A complete set provides 15 armor points (helmet 2, chestplate 6, leggings 5, boots 2). Use vanilla armor damage calculation, without custom damage-cancellation scripts or additional resistance effects.

Obtain the item through its crafting recipe, Creative equipment inventory, or `/give @s bellity:rainbow_leggings`. Match iron armor equip/unequip behavior and applicable enchantments, including armor-piece-specific enchantments, anvil application, and enchantment effects. Unbreaking and Mending must never be required to maintain infinite durability; Thorns must not damage or break the item. Repair is unnecessary because the item cannot become damaged. Do not introduce additional abilities or fire/lava immunity. Any vanilla compatibility that cannot be reproduced on custom items must be documented as a gap rather than silently omitted.

## Compatibility Gap

Smithing armor trims are not implemented for this custom armor, unlike vanilla iron armor. No trim recipes or trim rendering are supplied. This is a known compatibility gap, not a feature awaiting device verification.

## Crafting

Craft at a crafting table using the exact Stone and Cobblestone layout below.

`S` is one Stone block (`minecraft:stone`); `R` is one Cobblestone block (`minecraft:cobblestone`); `-` is empty. Smooth Stone is not a valid substitute.

```text
S S S
S - S
R - R
```

- Required materials: 5 Stone blocks and 2 Cobblestone blocks.
- Shaped recipe pattern: `["SSS","S S","R R"]`.
- Recipe ID: `bellity:rainbow_leggings`.
- Output: one `bellity:rainbow_leggings`.
- Follow the common `crafting_table`, format version 1.20.10, and `AlwaysUnlocked` policy.

## Appearance and Implementation

The equipped armor uses the supplied 64 x 32 `model_data/rainbow_armor_layer_1.png`, copied unchanged to the shared runtime texture. The editable reference model, `model_data/rainbow_armor.bbmodel`, supplies the head, hat, body, arm, and leg shapes and atlas layout; it is not installed as an attachable. Runtime geometry uses the corresponding vanilla humanoid bone names and pivots to inherit the wearer's pose without additional animations.

The leggings geometry includes a lower-body waistband at y=12..16 and both full legs with inflation 0.49. Cropped surfaces retain their matching source-atlas regions through per-face UV mapping. Leggings and boots use different inflation values to avoid coplanar surfaces when worn together. A separate second-layer texture is not required. Mixed-piece clipping and the final appearance still require device verification.

Use the supplied inventory icon `model_data/rainbow_leggings.png`, copied byte-for-byte to `resource_pack/textures/items/rainbow_leggings.png` and registered as `rainbow_leggings` in `resource_pack/textures/item_texture.json`. Do not generate a replacement icon or derive it from the worn armor atlas. Keep the source image unchanged.

The armor attachable references slot-appropriate geometry and the shared `controller.render.bellity.rainbow_armor` render controller. The controller uses the armor material and its enchanted variant for enchantment glint. Check all pieces worn together and in combination with vanilla armor.

Implementation files:

- Item: `behavior_pack/items/rainbow_leggings.json`.
- Recipe: `behavior_pack/recipes/rainbow_leggings.json`.
- Attachable: `resource_pack/attachables/rainbow_leggings.json`.
- Render controller: `resource_pack/render_controllers/rainbow_armor.render_controllers.json`.
- Geometry: `resource_pack/models/entity/rainbow_leggings.geo.json`.
- Shared worn texture: `resource_pack/textures/models/armor/rainbow_armor_layer_1.png`.
- Inventory icon: `resource_pack/textures/items/rainbow_leggings.png`, copied unchanged from `model_data/rainbow_leggings.png`.
- Icon registration: `resource_pack/textures/item_texture.json`.
- Names: `resource_pack/texts/ja_JP.lang`, `resource_pack/texts/en_US.lang`.
- Source validation: `tools/validate.mjs`.
- Device-verification record: `tests/test_checklist.md`.

The item uses `minecraft:wearable` for its slot and protection and `minecraft:enchantable` for its armor enchantment category. It omits `minecraft:durability`, consistent with existing unbreakable items; no large finite durability value or durability-repair script is used. Protection and applicable enchantments without a durability component require device verification on the project's target Bedrock version. Enchantments that specifically depend on durability may have no useful effect on this unbreakable item; record any inability to apply the corresponding iron armor enchantments as a compatibility gap.

References: [official wearable component documentation](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/itemreference/examples/itemcomponents/minecraft_wearable?view=minecraft-bedrock-stable) and [official enchantable component documentation](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/itemreference/examples/itemcomponents/minecraft_enchantable?view=minecraft-bedrock-stable). Check compatibility with the project's format version 1.21.110 before using properties from newer documentation.

## Device Verification

All checks are pending; source definitions and asset checks do not establish runtime behavior.

- Load both packs without Content Log errors; verify Japanese/English names, Creative availability, `/give`, and stack size one.
- Craft exactly one item from 5 Stone blocks and 2 Cobblestone blocks using the specified pattern. Check the recipe book; reject an all-Stone recipe, an all-Cobblestone recipe, swapped Stone/Cobblestone positions, and Smooth Stone substitutions.
- Equip only in the intended slot; compare equip, replacement, and removal behavior with the corresponding iron armor.
- Compare protection against iron armor under identical damage conditions, both individually and as a complete set.
- Receive repeated damage, including with Thorns, and verify no durability loss or breakage.
- Verify applicable enchanting-table and anvil enchantments and their effects, including the behavior of Unbreaking and Mending on an unbreakable item.
- Verify that the inventory icon matches the supplied `model_data/rainbow_leggings.png` artwork.
- Check the equipped rainbow texture, UV alignment, and enchantment glint in first-person and third-person views, while moving and crouching, and on an armor stand.
- Check a full rainbow set and mixed vanilla/rainbow sets for clipping or missing surfaces.
- Verify multiplayer appearance and persistence of equipment and enchantments after saving and reloading.

