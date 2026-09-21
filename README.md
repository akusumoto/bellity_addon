# Bellity Addon

This is a custom item addon for Minecraft Bedrock Edition 1.21.110 or later. Common specifications and details for each item are summarized in the [Design Document List](spec/README.md).

| Item | Obtaining Method | Details |
|---|---|---|
| Bellity Sword | Crafting Table, Creative, `/give` | [Design Document](spec/bellity_sword.md) |
| Slightly Netherite Axe | Crafting Table, Creative, `/give` | [Design Document](spec/noboru_netherite_axe.md) |
| Sun Bigman Light | Crafting Table, Creative, `/give` | [Design Document](spec/sun_bigman_light.md) |
| Gizagiza Sword | Crafting Table, Creative, `/give` | [Design Document](spec/gizagiza_sword.md) |
| Creepy Horse Eye | Crafting Table, Creative, `/give` | [Design Document](spec/creepy_horse_eye.md) |

## Build and Installation

Run `./build.ps1` from the root of the project using PowerShell. If verification succeeds, it generates `dist/bellity_addon.mcaddon`. Import this file into Minecraft and enable both the Behavior Pack and Resource Pack in your world.

Development packs are deployed initially using `./install-dev.ps1`. To update existing Bellity development packs, run `./install-dev.ps1 -Update`, and use `./tools/verify-dev.ps1` to verify that the destination matches the source. Reload the world after updating.

Obtaining commands:

```text
/give @s bellity:bellity_sword
/give @s bellity:noboru_netherite_axe
/give @s bellity:sun_bigman_light
/give @s bellity:gizagiza_sword
/give @s bellity:creepy_horse_eye
```

## Device Verification

Verify Japanese and English display names, images, five crafting recipes, and the behavior of each item along the [Device CheckList](tests/test_checklist.md). Content logs are located at `%appdata%\Minecraft Bedrock\logs`. Operation checks on Minecraft for the current build are incomplete.
