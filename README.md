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

Run the following commands from the project root in PowerShell.

### Create an `.mcaddon` Package

```powershell
./build.ps1
```

This command checks the JavaScript syntax, validates the pack files, and then creates `dist/bellity_addon.mcaddon`. Node.js must be available on `PATH`. Any existing package at that path is replaced. Import the generated file into Minecraft, then enable both the Behavior Pack and Resource Pack in your world.

### Install Development Packs

Close the affected Minecraft world before installing or updating the development packs. For the initial installation, run:

```powershell
./install-dev.ps1
```

This copies the Behavior Pack and Resource Pack to the Minecraft Bedrock development-pack directories under `%APPDATA%\Minecraft Bedrock\Users\Shared\games\com.mojang`. The script stops if those directories cannot be found or if Bellity development packs are already installed.

After changing the source files, update the existing development packs with:

```powershell
./install-dev.ps1 -Update
```

Update mode requires both installed Bellity packs to exist and verifies that their UUIDs match the source packs before overwriting their contents. It does not remove stale files that exist only in the installed directories. After installation or an update, verify the copied files and reload the world:

```powershell
./tools/verify-dev.ps1
```

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
