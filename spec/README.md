# Bellity Addon Design Document

## Purpose and Scope

An addon that adds unique weapons and usable items to Minecraft Bedrock Edition. The pack name displayed in the game shall be "ベリティアドオン" (Bellity Addon) for both the Behavior Pack and Resource Pack. Item definitions, recipes, and images are separated for each item. The namespace is `bellity`, and the target version is Minecraft Bedrock 1.21.110 or later.

Current individual specifications:

| Item | ID | Category | Status | Details |
|---|---|---|---|---|
| Bellity Sword | `bellity:bellity_sword` | Sword | Implemented | [bellity_sword.md](bellity_sword.md) |
| Chotto Netherite Axe | `bellity:noboru_netherite_axe` | Axe | Implemented | [noboru_netherite_axe.md](noboru_netherite_axe.md) |
| Sun Bigman Light | `bellity:sun_bigman_light` | Throwable Weapon | Implemented | [sun_bigman_light.md](sun_bigman_light.md) |
| Gizagiza Sword | `bellity:gizagiza_sword` | Sword | Implemented | [gizagiza_sword.md](gizagiza_sword.md) |
| Creepy Horse Eye | `bellity:creepy_horse_eye` | Usable Item | Designed, Not Implemented | [creepy_horse_eye.md](creepy_horse_eye.md) |

## Pack Structure

```text
behavior_pack/
├─ manifest.json
├─ items/                 # Item definitions for each item
├─ recipes/               # Crafting table recipes for each item
├─ entities/              # Projectile definition for the light ball
└─ scripts/main.js        # Sword drops and throwing processing
resource_pack/
├─ manifest.json
├─ entity/                # Display definition for the light ball
├─ animations/            # Display animation for the light ball
├─ render_controllers/    # Render settings for the light ball
├─ textures/item_texture.json
├─ textures/items/        # Images for each item
├─ textures/entity/       # Image for the light ball
└─ texts/
   ├─ languages.json
   ├─ ja_JP.lang
   └─ en_US.lang
model_data/                # Blockbench production assets
tools/validate.mjs         # Source validation
tests/test_checklist.md    # Device verification items
dist/bellity_addon.mcaddon # Pack for distribution
```

The Behavior Pack defines the behavior of items, recipes, and the Script API. The Resource Pack provides display names and images. The Behavior Pack depends on the Resource Pack and `@minecraft/server` 2.0.0. The current pack versions are `1.0.8` for the Behavior Pack and `1.0.4` for the Resource Pack. The `min_engine_version` for both packs is `1.21.110`.

## Common Specifications

- Item identifiers shall be `bellity:<item_id>`, and file names must use lowercase English letters, numbers, and underscores.
- Each item references `item.bellity:<item_id>.name` using `minecraft:display_name`. Define the same key in both `ja_JP.lang` and `en_US.lang`.
- Place the image for each item in `resource_pack/textures/items/` and register it in `item_texture.json`. The original image assets are stored in `model_data/`.
- The 4 implemented crafting recipes use `minecraft:recipe_shaped` with `format_version: 1.20.10`, specifying `crafting_table` for `tags` and `AlwaysUnlocked` for `unlock.context`. The 3x3 layout and materials are described in each weapon's design document.
- Item definitions use `format_version: 1.21.110`. Custom item components are used only for items that require special processing. The current swords and throwable weapons are registered in `scripts/main.js`. The Gizagiza Sword adds additional horizontal knockback to normal attacks upon hitting.
- Experimental features are not used in the current implementation. If they become necessary in the future, compatibility and implementation conditions will be considered individually.

## Build and Development Packs

Run `./build.ps1` directly under the project root. If the script syntax and `tools/validate.mjs` verification pass, both packs are bundled into `dist/bellity_addon.mcaddon`. If using the distribution pack, import it into Minecraft and enable both the Behavior Pack and Resource Pack in the world.

Deployment locations for the development packs on the Windows version of Minecraft Bedrock:

```text
%appdata%\Minecraft Bedrock\Users\Shared\games\com.mojang\development_behavior_packs\Bellity_BP
%appdata%\Minecraft Bedrock\Users\Shared\games\com.mojang\development_resource_packs\Bellity_RP
```

Use `./install-dev.ps1` for the first time, and `./install-dev.ps1 -Update` to update existing Bellity development packs. After updating, use `./tools/verify-dev.ps1` to cross-check the source and deployed files, then reload the Minecraft world.

## Verification Criteria and Unconfirmed Items

- The current source verification checks the definitions of the 4 implemented items, display name keys, images, the layout/materials/output/unlock settings of the 4 recipes, and manifest dependencies. The Creepy Horse Eye will be added to the verification target upon implementation.
- The current device verification checks the loading of both packs, content log errors, Japanese/English display names of the 4 implemented items, images, obtaining methods, the operation of each weapon, and retention after saving. Check items are recorded in [test_checklist.md](../tests/test_checklist.md). The Creepy Horse Eye will be added to the check target after implementation.
- Source verification is complete. On 2026-09-21, `./build.ps1` was used to verify 4 items and 4 recipes, generating `dist/bellity_addon.mcaddon`. It was also confirmed that the Gizagiza Sword recipe in the archive retains the specified layout, materials, and output. It was deployed to the development pack using `./install-dev.ps1 -Update`, and it was confirmed via `./tools/verify-dev.ps1` that the 11 Behavior Pack files and 13 Resource Pack files match the source. Operation checks on Minecraft, including the Gizagiza Sword, have not yet been conducted.
- Repair materials, enchantability, pack icons, 3D modeling, and balance for distribution will be considered in the future. Unresolved items specific to each item are detailed in their respective design documents.

## Expansion and Balance Policy

Based on the 3 implemented types (sword, axe, and throwable weapon), the structure will allow for the future addition of spears, daggers, hammers, shuriken, throwing knives, etc. Adjustments will be made not only to the attack power of each weapon but also to range, usage intervals, durability, material acquisition difficulty, and special abilities. In particular, weapons stronger than Netherite equipment will have appropriate acquisition costs or restrictions and will be tested in both PvE (against mobs) and PvP.

Images will be transparent PNG pixel art, preserving the Blockbench production assets. Whether to standardise on 16x16 or 32x32 is undecided. Outlines, light source directions, and colour counts will be aligned as much as possible across items. 3D models are out of scope for the current version; if adopted, first-person/third-person displays, holding styles, and attachables will be checked individually.

Features that can be realized with item components will be prioritized, while the Script API will be used for necessary functions like hit processing and throw processing. Multiplayer, retention after saving, and behavior upon reloading the world are also subject to device verification.

## Procedure to Add Items

1. Record the ID, name, performance, obtaining method, and unresolved items in this list and the new item's individual design document.
2. Add the item definition, image, texture registration, and Japanese/English translations. Add recipes and scripts as needed.
3. Update `tools/validate.mjs` and the device checklist, then verify and package using `./build.ps1`.
4. Perform device verification using the development pack or distribution pack, and record the results in the checklist.