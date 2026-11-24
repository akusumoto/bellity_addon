# Rainbow Leggings

[Common Specifications](README.md) / Item ID: `bellity:rainbow_leggings`

## Status and Scope

Design only. Item definitions, recipes, runtime textures, and armor rendering are not implemented. All device checks are pending.

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

## Appearance and Implementation Plan

Use the supplied 64 x 32 rainbow artwork for the equipped armor, preserving its colors and intended placement. The supplied reference model, `model_data/rainbow_armor.bbmodel`, contains head, hat, body, arm, and leg elements with identifier `player.armor.base`; it is an editable source model, not a ready-to-install attachable. Both legs use UV offset `[0,16]`. The texture file name does not limit the feature to upper-body armor: all four requested pieces must render correctly. Verify the UV layout for each piece before exporting runtime assets; no second-layer leggings texture is supplied. If different leggings UVs are needed, adapt the runtime geometry/UV mapping to the supplied texture. Keep source artwork unchanged.

Use the supplied inventory icon `model_data/rainbow_leggings.png`, copied byte-for-byte to `resource_pack/textures/items/rainbow_leggings.png` and registered as `rainbow_leggings` in `resource_pack/textures/item_texture.json`. Do not generate a replacement icon or derive it from the worn armor atlas. Keep the source image unchanged.

Use armor attachables and slot-appropriate geometry for the equipped armor, with enchantment glint and player-bone binding. Check all pieces worn together and in combination with vanilla armor.

Planned files (not yet created):

- Item: `behavior_pack/items/rainbow_leggings.json`.
- Recipe: `behavior_pack/recipes/rainbow_leggings.json`.
- Attachable: `resource_pack/attachables/rainbow_leggings.json`.
- Geometry, if required: `resource_pack/models/entity/rainbow_leggings.geo.json`.
- Shared worn texture: `resource_pack/textures/models/armor/rainbow_armor_layer_1.png`.
- Inventory icon: `resource_pack/textures/items/rainbow_leggings.png`, copied unchanged from `model_data/rainbow_leggings.png`.
- Icon registration: `resource_pack/textures/item_texture.json`.
- Names: `resource_pack/texts/ja_JP.lang`, `resource_pack/texts/en_US.lang`.
- Source validation: `tools/validate.mjs`.
- Device-verification record: `tests/test_checklist.md`.

Use `minecraft:wearable` for the slot and protection, and `minecraft:enchantable` for the appropriate armor enchantment category. Prefer omitting `minecraft:durability` for the unbreakable item, consistent with existing unbreakable items. Verify that protection and applicable enchantments still function without durability on the project's target Bedrock version; do not substitute a large finite durability value. Resolve component compatibility during implementation.

References: [official wearable component documentation](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/itemreference/examples/itemcomponents/minecraft_wearable?view=minecraft-bedrock-stable) and [official enchantable component documentation](https://learn.microsoft.com/en-us/minecraft/creator/reference/content/itemreference/examples/itemcomponents/minecraft_enchantable?view=minecraft-bedrock-stable). Check compatibility with the project's format version 1.21.110 before using properties from newer documentation.

## Device Verification

All checks are pending; this design does not establish runtime behavior.

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

