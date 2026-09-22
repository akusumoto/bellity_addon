# Bellity Addon Design

## Purpose and Scope

Bellity is a Minecraft Bedrock Edition add-on that provides custom weapons, use-activated items, and entities. The Behavior Pack and Resource Pack use the display name "ベリティアドオン." Definitions, recipes, and images are separated by feature, the namespace is `bellity`, and the target version is Minecraft Bedrock 1.21.110 or later.

Current feature specifications:

| Feature | ID | Category | Status | Details |
|---|---|---|---|---|
| Bellity Sword | `bellity:bellity_sword` | Sword | Implemented | [bellity_sword.md](bellity_sword.md) |
| Slightly Netherite Axe | `bellity:noboru_netherite_axe` | Axe | Implemented | [noboru_netherite_axe.md](noboru_netherite_axe.md) |
| Sun Bigman Light | `bellity:sun_bigman_light` | Throwable weapon | Implemented | [sun_bigman_light.md](sun_bigman_light.md) |
| Gizagiza Sword | `bellity:gizagiza_sword` | Sword | Implemented | [gizagiza_sword.md](gizagiza_sword.md) |
| Creepy Horse Eye | `bellity:creepy_horse_eye` | Use-activated item | Implemented; device verification pending | [creepy_horse_eye.md](creepy_horse_eye.md) |
| Connectable Train Cart | `bellity:connectable_train_cart` | Entity | Implemented; device verification pending | [connectable_train_cart.md](connectable_train_cart.md) |

## Pack Structure

```text
behavior_pack/
├─ manifest.json
├─ items/                 # Item definitions
├─ recipes/               # Crafting recipes
├─ entities/              # Custom entity definitions
└─ scripts/main.js        # Script API behavior
resource_pack/
├─ manifest.json
├─ entity/                # Client entity definitions
├─ animations/            # Display animations
├─ render_controllers/    # Render controllers
├─ models/                # Runtime geometry
├─ textures/item_texture.json
├─ textures/items/        # Item textures
├─ textures/entity/       # Entity textures
└─ texts/                 # Language files
model_data/                        # Editable source assets
tools/validate.mjs                 # Source validation
tests/test_checklist.md            # Device-verification record
dist/bellity_addon.mcaddon         # Distribution package
```

The Behavior Pack defines items, recipes, entities, and Script API behavior. The Resource Pack provides display names, textures, geometry, and rendering data. The Behavior Pack depends on the Resource Pack and `@minecraft/server` 2.0.0. Consult the manifests for the current pack versions. Both packs use `min_engine_version` 1.21.110.

## Common Specifications

- Feature IDs use `bellity:<feature_id>`, and file names use lowercase English letters, digits, and underscores.
- Each item references `item.bellity:<item_id>.name` through `minecraft:display_name`, with matching entries in `ja_JP.lang` and `en_US.lang`.
- Item textures are stored in `resource_pack/textures/items/` and registered in `item_texture.json`; editable source assets are retained in `model_data/`.
- Crafting recipes use `minecraft:recipe_shaped`, format version 1.20.10, the `crafting_table` tag, and `AlwaysUnlocked`. Each feature specification records its exact layout and ingredients.
- Item definitions use format version 1.21.110. Custom item components and Script API code are used only when a feature requires them.
- Experimental features are avoided unless a feature specification explicitly documents why they are required and how to enable them.

## Build and Development Packs

Run `./build.ps1` from the project root. After JavaScript syntax and `tools/validate.mjs` checks pass, the script packages both packs as `dist/bellity_addon.mcaddon`. Import that package into Minecraft and enable both the Behavior Pack and Resource Pack in the world.

Development-pack locations for Minecraft Bedrock on Windows are:

```text
%appdata%\Minecraft Bedrock\Users\Shared\games\com.mojang\development_behavior_packs\Bellity_BP
%appdata%\Minecraft Bedrock\Users\Shared\games\com.mojang\development_resource_packs\Bellity_RP
```

Use `./install-dev.ps1` for the initial installation and `./install-dev.ps1 -Update` to update existing development packs. After updating, use `./tools/verify-dev.ps1` to compare the source and installed files, then reload the Minecraft world.

## Verification Policy

- Source validation checks definitions, identifiers, localization keys, assets, recipes, manifest dependencies, and selected script invariants. It does not demonstrate runtime behavior.
- Device verification checks pack loading, the Content Log, names and appearances, acquisition methods, feature behavior, and persistence after saving and reloading. Results are recorded in [test_checklist.md](../tests/test_checklist.md).
- A packaged archive and matching development-pack hashes prove file inclusion and deployment only. They do not prove in-game behavior.
- Do not mark behavior as verified until it has been observed in Minecraft Bedrock. Record feature-specific pending checks in its design document and the device checklist.

## Extension and Balance Policy

The project can extend its weapon and item base with spears, daggers, hammers, shuriken, throwing knives, and other features. Balance considers reach, use interval, durability, material availability, special abilities, and attack damage. Powerful weapons require both PvE and PvP device verification.

Item images use transparent pixel-art PNGs, with editable assets retained in `model_data/`. Resolution, outlines, lighting direction, and color count should remain consistent. When a feature uses geometry or an attachable, verify first-person and third-person presentation separately.

Prefer item and entity components for behavior they can express reliably. Use the Script API for behavior such as hit handling, throwing, freezing, or train coordination. Multiplayer behavior, persistence, and world-reload recovery are device-verification targets.

## Feature Addition Procedure

1. Record the ID, names, behavior, acquisition method, and unresolved decisions in an individual specification, then link it from the feature table above.
2. Add definitions, assets, localization, and any required recipes and scripts.
3. Update `tools/validate.mjs` and `tests/test_checklist.md`, then run the relevant source checks.
4. Package only when requested, install or update the development packs, and record separately what source/deployment checks and in-game checks established.
